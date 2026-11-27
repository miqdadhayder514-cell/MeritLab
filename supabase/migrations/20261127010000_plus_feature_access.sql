create function public.has_plus_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.user_subscriptions as subscription
     where subscription.user_id = (select auth.uid())
       and subscription.plan_code in ('plus', 'premium')
       and subscription.status = 'active'
       and subscription.starts_at <= now()
       and subscription.ends_at > now()
  );
$$;

revoke all on function public.has_plus_access() from public, anon;
grant execute on function public.has_plus_access() to authenticated;

create function public.enforce_paid_exam_access()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_exam_type text;
begin
  if new.user_id is distinct from (select auth.uid()) then
    raise exception 'Exam attempts must belong to the authenticated user';
  end if;

  select exam_type
    into v_exam_type
    from public.exam_catalog
   where slug = new.exam_slug;

  if v_exam_type is null then
    raise exception 'Unknown exam';
  end if;

  if (v_exam_type = 'past_paper' or new.exam_slug <> 'net-engineering')
     and not public.is_admin()
     and not public.has_plus_access() then
    raise exception 'An active Plus subscription is required for this exam';
  end if;

  return new;
end;
$$;

create trigger exam_attempts_require_paid_access
  before insert on public.exam_attempts
  for each row execute function public.enforce_paid_exam_access();

revoke all on function public.enforce_paid_exam_access() from public, anon, authenticated;
