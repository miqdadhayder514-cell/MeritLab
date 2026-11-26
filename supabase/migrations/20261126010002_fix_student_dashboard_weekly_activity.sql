create or replace function public.student_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_today date := (now() at time zone 'Asia/Karachi')::date;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  with user_attempts as (
    select a.*, c.exam_type, c.title
      from public.exam_attempts as a
      join public.exam_catalog as c on c.slug = a.exam_slug
     where a.user_id = v_user_id
  ),
  daily_activity as (
    select (completed_at at time zone 'Asia/Karachi')::date as activity_date,
           count(*)::integer as attempt_count,
           sum(attempted_questions)::integer as question_count,
           sum(correct_answers)::integer as correct_count
      from user_attempts
     group by 1
  ),
  streak_groups as (
    select activity_date,
           activity_date - row_number() over (order by activity_date)::integer as streak_group
      from daily_activity
  ),
  best_streak as (
    select coalesce(max(streak_length), 0)::integer as value
      from (
        select count(*) as streak_length
          from streak_groups
         group by streak_group
      ) as groups_by_streak
  ),
  current_streak as (
    with recursive start_day as (
      select activity_date
        from daily_activity
       where activity_date between v_today - 1 and v_today
       order by activity_date desc
       limit 1
    ),
    consecutive_days(activity_date) as (
      select activity_date from start_day
      union all
      select previous_day.activity_date
        from daily_activity as previous_day
        join consecutive_days as current_day
          on previous_day.activity_date = current_day.activity_date - 1
    )
    select count(*)::integer as value from consecutive_days
  ),
  recent_activity as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', title,
          'exam_type', exam_type,
          'completed_at', completed_at,
          'total_questions', total_questions,
          'attempted_questions', attempted_questions,
          'correct_answers', correct_answers,
          'accuracy', case
            when attempted_questions = 0 then 0
            else round(100.0 * correct_answers / attempted_questions, 1)
          end
        )
        order by completed_at desc
      ),
      '[]'::jsonb
    ) as value
    from (
      select *
        from user_attempts
       order by completed_at desc
       limit 5
    ) as latest
  ),
  weekly_activity as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'date', v_today - (6 - days.day_offset),
          'attempts', coalesce(activity.attempt_count, 0),
          'questions', coalesce(activity.question_count, 0),
          'correct', coalesce(activity.correct_count, 0)
        )
        order by days.day_offset
      ),
      '[]'::jsonb
    ) as value
    from generate_series(0, 6) as days(day_offset)
    left join daily_activity as activity
      on activity.activity_date = v_today - (6 - days.day_offset)
  ),
  subject_performance as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'subject', subject,
          'attempted', attempted,
          'correct', correct,
          'accuracy', case
            when attempted = 0 then 0
            else round(100.0 * correct / attempted, 1)
          end
        )
        order by attempted desc, subject
      ),
      '[]'::jsonb
    ) as value
    from (
      select subject,
             count(*)::integer as attempted,
             count(*) filter (where is_correct)::integer as correct
        from public.exam_attempt_answers
       where user_id = v_user_id
       group by subject
    ) as per_subject
  ),
  summary_totals as (
    select coalesce(sum(attempted_questions), 0) as questions_attempted,
         coalesce(sum(correct_answers), 0) as correct_answers,
         count(*) filter (where exam_type = 'mock_test') as mock_tests_completed,
         count(*) filter (where exam_type = 'past_paper') as past_papers_completed,
         coalesce(sum(attempted_questions) filter (
           where (completed_at at time zone 'Asia/Karachi')::date >= date_trunc(
             'week',
             v_today::timestamp
           )::date
         ), 0) as questions_this_week
    from user_attempts
  )
  select jsonb_build_object(
    'questions_attempted', summary_totals.questions_attempted,
    'correct_answers', summary_totals.correct_answers,
    'accuracy', case
    when summary_totals.questions_attempted = 0 then 0
    else round(
      100.0 * summary_totals.correct_answers / summary_totals.questions_attempted,
      1
    )
    end,
    'mock_tests_completed', summary_totals.mock_tests_completed,
    'past_papers_completed', summary_totals.past_papers_completed,
    'questions_this_week', summary_totals.questions_this_week,
    'current_streak', current_streak.value,
    'best_streak', best_streak.value,
    'recent_activity', recent_activity.value,
    'weekly_activity', weekly_activity.value,
    'subject_performance', subject_performance.value
  )
    into v_result
    from summary_totals
    cross join current_streak
    cross join best_streak
    cross join recent_activity
    cross join weekly_activity
    cross join subject_performance;

  return v_result;
end;
$$;

revoke all on function public.student_dashboard() from public, anon;
grant execute on function public.student_dashboard() to authenticated;
