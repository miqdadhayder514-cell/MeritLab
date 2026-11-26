create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  notification_type text not null
    check (notification_type in ('exam_result', 'announcement')),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  body text not null check (char_length(btrim(body)) between 1 and 500),
  href text check (
    href is null
    or (
      left(href, 1) = '/'
      and left(href, 2) <> '//'
      and href !~ '[[:cntrl:]]'
    )
  ),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;
create index notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;
revoke all on public.notifications from anon, authenticated;

create policy "Users can read their own notifications"
  on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));

create function public.student_notifications(p_limit integer default 20)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_limit is null or p_limit not between 1 and 50 then
    raise exception 'Notification limit is invalid';
  end if;

  select jsonb_build_object(
    'unread_count', (
      select count(*)::integer
        from public.notifications
       where user_id = v_user_id
         and read_at is null
    ),
    'notifications', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', recent.id,
            'notification_type', recent.notification_type,
            'title', recent.title,
            'body', recent.body,
            'href', recent.href,
            'created_at', recent.created_at,
            'read_at', recent.read_at
          )
          order by recent.created_at desc
        )
        from (
          select id, notification_type, title, body, href, created_at, read_at
            from public.notifications
           where user_id = v_user_id
           order by created_at desc
           limit p_limit
        ) as recent
      ),
      '[]'::jsonb
    )
  )
    into v_result;

  return v_result;
end;
$$;

create function public.mark_notification_read(p_notification_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.notifications
     set read_at = now()
   where id = p_notification_id
     and user_id = v_user_id
     and read_at is null;

  return found;
end;
$$;

create function public.mark_all_notifications_read()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_updated integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.notifications
     set read_at = now()
   where user_id = v_user_id
     and read_at is null;

  get diagnostics v_updated = row_count;
  return v_updated;
end;
$$;

create function public.notify_exam_attempt()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_exam_title text;
  v_exam_type text;
  v_score numeric;
  v_href text;
begin
  select title, exam_type
    into v_exam_title, v_exam_type
    from public.exam_catalog
   where slug = new.exam_slug;

  if not found then
    raise exception 'Exam catalog entry not found for submitted attempt';
  end if;

  v_score := round(100.0 * new.correct_answers / new.total_questions, 1);
  v_href := '/analytics';

  insert into public.notifications (
    user_id,
    notification_type,
    title,
    body,
    href
  )
  values (
    new.user_id,
    'exam_result',
    'Your exam result is ready',
    v_exam_title || ': ' || new.correct_answers || '/' || new.total_questions
      || ' correct (' || v_score || '%).',
    v_href
  );

  return new;
end;
$$;

create trigger exam_attempt_create_notification
  after insert on public.exam_attempts
  for each row execute function public.notify_exam_attempt();

create function public.admin_publish_announcement(
  p_title text,
  p_body text,
  p_href text default null
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recipients integer;
begin
  if not (select public.is_admin()) then
    raise exception 'Administrator access required';
  end if;
  if p_title is null or char_length(btrim(p_title)) not between 1 and 120 then
    raise exception 'Announcement title must be between 1 and 120 characters';
  end if;
  if p_body is null or char_length(btrim(p_body)) not between 1 and 500 then
    raise exception 'Announcement body must be between 1 and 500 characters';
  end if;
  if p_href is not null and not (
    left(p_href, 1) = '/'
    and left(p_href, 2) <> '//'
    and p_href !~ '[[:cntrl:]]'
  ) then
    raise exception 'Announcement link must be a relative site path';
  end if;

  insert into public.notifications (
    user_id,
    notification_type,
    title,
    body,
    href
  )
  select roles.user_id,
         'announcement',
         btrim(p_title),
         btrim(p_body),
         p_href
    from public.user_roles as roles
   where roles.role = 'student';

  get diagnostics v_recipients = row_count;
  return v_recipients;
end;
$$;

revoke all on function public.student_notifications(integer) from public, anon;
revoke all on function public.mark_notification_read(uuid) from public, anon;
revoke all on function public.mark_all_notifications_read() from public, anon;
revoke all on function public.notify_exam_attempt() from public, anon, authenticated;
revoke all on function public.admin_publish_announcement(text, text, text)
  from public, anon;

grant execute on function public.student_notifications(integer) to authenticated;
grant execute on function public.mark_notification_read(uuid) to authenticated;
grant execute on function public.mark_all_notifications_read() to authenticated;
grant execute on function public.admin_publish_announcement(text, text, text)
  to authenticated;
