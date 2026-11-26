create table public.exam_catalog (
  slug text primary key,
  exam_type text not null check (exam_type in ('mock_test', 'past_paper')),
  title text not null,
  question_count integer not null check (question_count > 0),
  answer_key jsonb not null check (jsonb_typeof(answer_key) = 'array'),
  subject_key jsonb not null check (jsonb_typeof(subject_key) = 'array'),
  created_at timestamptz not null default now(),
  check (jsonb_array_length(answer_key) = question_count),
  check (jsonb_array_length(subject_key) = question_count)
);

create table public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exam_slug text not null references public.exam_catalog (slug),
  idempotency_key uuid not null,
  total_questions integer not null check (total_questions > 0),
  attempted_questions integer not null check (
    attempted_questions between 0 and total_questions
  ),
  correct_answers integer not null check (
    correct_answers between 0 and attempted_questions
  ),
  seconds_remaining integer not null check (seconds_remaining between 0 and 10800),
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  completed_at timestamptz not null default now(),
  unique (user_id, exam_slug, idempotency_key)
);

create index exam_attempts_user_completed_idx
  on public.exam_attempts (user_id, completed_at desc);
create index exam_attempts_user_exam_idx
  on public.exam_attempts (user_id, exam_slug, completed_at desc);

create table public.exam_attempt_answers (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.exam_attempts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_number integer not null check (question_number > 0),
  selected_option integer not null check (selected_option between 0 and 3),
  is_correct boolean not null,
  subject text not null,
  unique (attempt_id, question_number)
);

create index exam_attempt_answers_user_subject_idx
  on public.exam_attempt_answers (user_id, subject);

alter table public.exam_catalog enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_attempt_answers enable row level security;

revoke all on public.exam_catalog from anon, authenticated;
revoke all on public.exam_attempts from anon, authenticated;
revoke all on public.exam_attempt_answers from anon, authenticated;

grant select on public.exam_attempts, public.exam_attempt_answers to authenticated;

create policy "Users can read their own exam attempts"
  on public.exam_attempts for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Users can read their own submitted answers"
  on public.exam_attempt_answers for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create function public.submit_exam_attempt(
  p_exam_slug text,
  p_idempotency_key uuid,
  p_answers jsonb,
  p_seconds_remaining integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_catalog public.exam_catalog%rowtype;
  v_attempt_id uuid;
  v_attempted integer;
  v_correct integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_idempotency_key is null then
    raise exception 'Attempt identifier is required';
  end if;
  if jsonb_typeof(p_answers) is distinct from 'object' then
    raise exception 'Answers must be an object';
  end if;
  if p_seconds_remaining is null or p_seconds_remaining not between 0 and 10800 then
    raise exception 'Remaining time is invalid';
  end if;

  select *
    into v_catalog
    from public.exam_catalog
    where slug = p_exam_slug;
  if not found then
    raise exception 'Unknown exam';
  end if;

  if exists (
    select 1
      from public.exam_attempts
      where user_id = v_user_id
        and exam_slug = p_exam_slug
        and idempotency_key = p_idempotency_key
  ) then
    select id
      into v_attempt_id
      from public.exam_attempts
      where user_id = v_user_id
        and exam_slug = p_exam_slug
        and idempotency_key = p_idempotency_key;
    return v_attempt_id;
  end if;

  if exists (
    select 1
      from jsonb_each(p_answers) as entry
     where case
             when entry.key ~ '^[1-9][0-9]*$'
               then entry.key::numeric > v_catalog.question_count
             else true
           end
        or jsonb_typeof(entry.value) is distinct from 'number'
        or entry.value::text !~ '^[0-3]$'
  ) then
    raise exception 'One or more submitted answers are invalid';
  end if;

  select count(*)
    into v_attempted
    from jsonb_each(p_answers);

  select count(*)
    into v_correct
    from jsonb_each(p_answers) as entry
   where (v_catalog.answer_key ->> (entry.key::integer - 1))::integer
       = (entry.value #>> '{}')::integer;

  insert into public.exam_attempts (
    user_id,
    exam_slug,
    idempotency_key,
    total_questions,
    attempted_questions,
    correct_answers,
    seconds_remaining,
    answers
  )
  values (
    v_user_id,
    p_exam_slug,
    p_idempotency_key,
    v_catalog.question_count,
    v_attempted,
    v_correct,
    p_seconds_remaining,
    p_answers
  )
  on conflict (user_id, exam_slug, idempotency_key) do nothing
  returning id into v_attempt_id;

  if v_attempt_id is null then
    select id
      into v_attempt_id
      from public.exam_attempts
      where user_id = v_user_id
        and exam_slug = p_exam_slug
        and idempotency_key = p_idempotency_key;
    return v_attempt_id;
  end if;

  insert into public.exam_attempt_answers (
    attempt_id,
    user_id,
    question_number,
    selected_option,
    is_correct,
    subject
  )
  select
    v_attempt_id,
    v_user_id,
    entry.key::integer,
    (entry.value #>> '{}')::integer,
    (v_catalog.answer_key ->> (entry.key::integer - 1))::integer
      = (entry.value #>> '{}')::integer,
    v_catalog.subject_key ->> (entry.key::integer - 1)
  from jsonb_each(p_answers) as entry;

  return v_attempt_id;
end;
$$;

revoke all on function public.submit_exam_attempt(text, uuid, jsonb, integer)
  from public, anon;
grant execute on function public.submit_exam_attempt(text, uuid, jsonb, integer)
  to authenticated;

create function public.student_dashboard()
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
          'date', days.activity_date,
          'attempts', coalesce(activity.attempt_count, 0),
          'questions', coalesce(activity.question_count, 0),
          'correct', coalesce(activity.correct_count, 0)
        )
        order by days.activity_date
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
