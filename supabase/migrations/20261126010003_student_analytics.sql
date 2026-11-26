create function public.student_analytics(p_period_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_today date := (now() at time zone 'Asia/Karachi')::date;
  v_start_date date;
  v_previous_start date;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_period_days is null or p_period_days not in (7, 30, 90) then
    raise exception 'Unsupported analytics period';
  end if;

  v_start_date := v_today - (p_period_days - 1);
  v_previous_start := v_start_date - p_period_days;

  with attempts as (
    select a.*,
           c.exam_type,
           c.title,
           greatest(0, 10800 - a.seconds_remaining) as elapsed_seconds,
           (a.completed_at at time zone 'Asia/Karachi')::date as activity_date
      from public.exam_attempts as a
      join public.exam_catalog as c on c.slug = a.exam_slug
     where a.user_id = v_user_id
       and a.completed_at >= (
         v_previous_start::timestamp at time zone 'Asia/Karachi'
       )
       and a.completed_at < (
         (v_today + 1)::timestamp at time zone 'Asia/Karachi'
       )
  ),
  selected_period as (
    select *
      from attempts
     where activity_date between v_start_date and v_today
  ),
  previous_period as (
    select *
      from attempts
     where activity_date between v_previous_start and v_start_date - 1
  ),
  summary as (
    select count(*)::integer as exams_completed,
           coalesce(sum(attempted_questions), 0)::integer as questions_attempted,
           coalesce(sum(correct_answers), 0)::integer as correct_answers,
           round(
             100.0 * sum(correct_answers) / nullif(sum(attempted_questions), 0),
             1
           ) as accuracy,
           round(avg(100.0 * correct_answers / total_questions), 1)
             as average_test_score,
           round(
             (sum(elapsed_seconds) filter (where attempted_questions > 0))::numeric
               / nullif(sum(attempted_questions), 0),
             1
           ) as average_pace_seconds
      from selected_period
  ),
  previous_summary as (
    select count(*)::integer as exams_completed,
           coalesce(sum(attempted_questions), 0)::integer as questions_attempted,
           round(
             100.0 * sum(correct_answers) / nullif(sum(attempted_questions), 0),
             1
           ) as accuracy,
           round(avg(100.0 * correct_answers / total_questions), 1)
             as average_test_score,
           round(
             (sum(elapsed_seconds) filter (where attempted_questions > 0))::numeric
               / nullif(sum(attempted_questions), 0),
             1
           ) as average_pace_seconds
      from previous_period
  ),
  daily_activity as (
    select activity_date,
           sum(attempted_questions)::integer as questions_attempted,
           sum(correct_answers)::integer as correct_answers
      from selected_period
     group by activity_date
  ),
  accuracy_over_time as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'date', v_start_date + days.day_offset,
          'accuracy', round(
            100.0 * activity.correct_answers
              / nullif(activity.questions_attempted, 0),
            1
          ),
          'questions_attempted', coalesce(activity.questions_attempted, 0)
        )
        order by days.day_offset
      ),
      '[]'::jsonb
    ) as value
    from generate_series(0, p_period_days - 1) as days(day_offset)
    left join daily_activity as activity
      on activity.activity_date = v_start_date + days.day_offset
  ),
  subject_performance as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'subject', subject,
          'attempted', attempted,
          'correct', correct,
          'accuracy', round(100.0 * correct / nullif(attempted, 0), 1)
        )
        order by attempted desc, subject
      ),
      '[]'::jsonb
    ) as value
    from (
      select answer.subject,
             count(*)::integer as attempted,
             count(*) filter (where answer.is_correct)::integer as correct
        from public.exam_attempt_answers as answer
        join public.exam_attempts as attempt
          on attempt.id = answer.attempt_id
       where answer.user_id = v_user_id
         and (attempt.completed_at at time zone 'Asia/Karachi')::date
           between v_start_date and v_today
       group by answer.subject
    ) as per_subject
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
        from selected_period
       order by completed_at desc
       limit 5
    ) as latest
  )
  select jsonb_build_object(
    'period_days', p_period_days,
    'summary', (
      select jsonb_build_object(
        'exams_completed', exams_completed,
        'questions_attempted', questions_attempted,
        'correct_answers', correct_answers,
        'accuracy', accuracy,
        'average_test_score', average_test_score,
        'average_pace_seconds', average_pace_seconds
      )
      from summary
    ),
    'previous_period', (
      select jsonb_build_object(
        'exams_completed', exams_completed,
        'questions_attempted', questions_attempted,
        'accuracy', accuracy,
        'average_test_score', average_test_score,
        'average_pace_seconds', average_pace_seconds
      )
      from previous_summary
    ),
    'accuracy_over_time', accuracy_over_time.value,
    'subject_performance', subject_performance.value,
    'recent_activity', recent_activity.value
  )
    into v_result
    from accuracy_over_time
    cross join subject_performance
    cross join recent_activity;

  return v_result;
end;
$$;

revoke all on function public.student_analytics(integer) from public, anon;
grant execute on function public.student_analytics(integer) to authenticated;
