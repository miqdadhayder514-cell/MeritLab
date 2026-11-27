alter table public.payment_submissions
  alter column transaction_reference drop not null;

update storage.buckets
   set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id = 'payment-receipts';

drop function if exists public.submit_payment(text, text, text, text, integer, integer);
drop function if exists public.submit_payment(text, text, text, integer, integer);

create function public.submit_payment(
  p_plan_code text,
  p_student_name text,
  p_receipt_path text,
  p_expected_amount integer,
  p_expected_duration_days integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_role text;
  v_plan public.payment_plans%rowtype;
  v_submission_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select role into v_role
    from public.user_roles
   where user_id = v_user_id;
  if v_role is distinct from 'student' then
    raise exception 'Student account required';
  end if;

  if p_plan_code is null or p_plan_code not in ('plus', 'premium') then
    raise exception 'Choose a valid payment plan';
  end if;
  if p_student_name is null
     or char_length(btrim(p_student_name)) not between 2 and 100
     or p_student_name ~ '[[:cntrl:]]'
  then
    raise exception 'Enter your full name';
  end if;
  if p_receipt_path is null
     or char_length(p_receipt_path) > 512
     or p_receipt_path not like v_user_id::text || '/%'
  then
    raise exception 'The transaction screenshot path is invalid';
  end if;

  select *
    into v_plan
    from public.payment_plans
   where code = p_plan_code
     and is_active
     and amount_pkr is not null
     and duration_days is not null
   for share;
  if not found then
    raise exception 'This payment plan is not currently available';
  end if;
  if p_expected_amount is distinct from v_plan.amount_pkr
     or p_expected_duration_days is distinct from v_plan.duration_days
  then
    raise exception 'Plan pricing changed. Refresh the page and verify the amount before transferring.';
  end if;

  if not exists (
    select 1
      from public.payment_settings
     where id
       and enabled
       and account_name is not null
       and account_number is not null
  ) then
    raise exception 'NayaPay payment instructions are not configured';
  end if;

  if not exists (
    select 1
      from storage.objects
     where bucket_id = 'payment-receipts'
       and name = p_receipt_path
       and owner_id = v_user_id::text
       and metadata ->> 'mimetype' in ('image/jpeg', 'image/png', 'image/webp')
  ) then
    raise exception 'Upload a valid transaction screenshot before submitting';
  end if;

  if exists (
    select 1
      from public.payment_submissions
     where user_id = v_user_id
       and status = 'pending'
  ) then
    raise exception 'You already have a payment request awaiting review';
  end if;

  insert into public.payment_submissions (
    user_id,
    student_name,
    plan_id,
    plan_code,
    plan_name,
    amount_pkr,
    duration_days,
    receipt_path
  )
  values (
    v_user_id,
    btrim(p_student_name),
    v_plan.id,
    v_plan.code,
    v_plan.name,
    v_plan.amount_pkr,
    v_plan.duration_days,
    p_receipt_path
  )
  returning id into v_submission_id;

  return v_submission_id;
end;
$$;

revoke all on function public.submit_payment(text, text, text, integer, integer) from public, anon;
grant execute on function public.submit_payment(text, text, text, integer, integer)
  to authenticated;
