create table public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code in ('plus', 'premium')),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  description text not null default '',
  amount_pkr integer,
  duration_days integer,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (amount_pkr is null and duration_days is null)
    or (amount_pkr > 0 and duration_days > 0)
  ),
  check (
    not is_active
    or (amount_pkr is not null and duration_days is not null)
  )
);

create trigger payment_plans_set_updated_at
  before update on public.payment_plans
  for each row execute function public.set_updated_at();

insert into public.payment_plans (code, name, description)
values
  ('plus', 'MeritLab Plus', 'Expanded preparation access.'),
  ('premium', 'MeritLab Premium', 'Complete preparation access.')
on conflict (code) do nothing;

create table public.payment_settings (
  id boolean primary key default true check (id),
  account_name text,
  account_number text,
  instructions text not null default '',
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  check (account_name is null or char_length(btrim(account_name)) between 2 and 120),
  check (account_number is null or char_length(btrim(account_number)) between 5 and 64),
  check (char_length(instructions) <= 1000),
  check (
    not enabled
    or (
      account_name is not null
      and account_number is not null
      and char_length(btrim(account_name)) between 2 and 120
      and char_length(btrim(account_number)) between 5 and 64
    )
  )
);

insert into public.payment_settings (id)
values (true)
on conflict (id) do nothing;

create trigger payment_settings_set_updated_at
  before update on public.payment_settings
  for each row execute function public.set_updated_at();

create table public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid not null references public.payment_plans (id) on delete restrict,
  plan_code text not null check (plan_code in ('plus', 'premium')),
  plan_name text not null,
  amount_pkr integer not null check (amount_pkr > 0),
  duration_days integer not null check (duration_days > 0),
  transaction_reference text not null
    check (char_length(btrim(transaction_reference)) between 4 and 120)
    check (transaction_reference !~ '[[:cntrl:]]'),
  receipt_path text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text
    check (rejection_reason is null or char_length(btrim(rejection_reason)) between 1 and 500),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete restrict,
  check (receipt_path like user_id::text || '/%'),
  check (
    (status = 'pending' and reviewed_at is null and reviewed_by is null and rejection_reason is null)
    or (status = 'approved' and reviewed_at is not null and reviewed_by is not null and rejection_reason is null)
    or (status = 'rejected' and reviewed_at is not null and reviewed_by is not null and rejection_reason is not null)
  )
);

create unique index payment_submissions_one_pending_per_user_idx
  on public.payment_submissions (user_id)
  where status = 'pending';
create index payment_submissions_created_idx
  on public.payment_submissions (status, submitted_at desc);
create index payment_submissions_user_idx
  on public.payment_submissions (user_id, submitted_at desc);

create table public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  payment_submission_id uuid not null unique
    references public.payment_submissions (id) on delete cascade,
  plan_code text not null check (plan_code in ('plus', 'premium')),
  plan_name text not null,
  amount_pkr integer not null check (amount_pkr > 0),
  duration_days integer not null check (duration_days > 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index user_subscriptions_user_expiry_idx
  on public.user_subscriptions (user_id, ends_at desc)
  where status = 'active';

alter table public.payment_plans enable row level security;
alter table public.payment_settings enable row level security;
alter table public.payment_submissions enable row level security;
alter table public.user_subscriptions enable row level security;

revoke all on public.payment_plans from anon, authenticated;
grant select on public.payment_plans to anon, authenticated;
grant insert, update, delete on public.payment_plans to authenticated;

create policy "Anyone can read configured active plans"
  on public.payment_plans for select to anon, authenticated
  using (
    is_active
    and amount_pkr is not null
    and duration_days is not null
  );
create policy "Administrators can manage payment plans"
  on public.payment_plans for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke all on public.payment_settings from anon, authenticated;
grant select, update on public.payment_settings to authenticated;

create policy "Students can read enabled payment settings"
  on public.payment_settings for select to authenticated
  using (enabled or (select public.is_admin()));
create policy "Administrators can update payment settings"
  on public.payment_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke all on public.payment_submissions from anon, authenticated;
grant select on public.payment_submissions to authenticated;

create policy "Students can read their payment submissions"
  on public.payment_submissions for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Administrators can read payment submissions"
  on public.payment_submissions for select to authenticated
  using ((select public.is_admin()));

revoke all on public.user_subscriptions from anon, authenticated;
grant select on public.user_subscriptions to authenticated;

create policy "Students can read their subscriptions"
  on public.user_subscriptions for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Administrators can read subscriptions"
  on public.user_subscriptions for select to authenticated
  using ((select public.is_admin()));

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'payment-receipts',
  'payment-receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

do $$
begin
  if exists (
    select 1
      from storage.buckets
     where id = 'payment-receipts'
       and (
         public
         or file_size_limit is distinct from 5242880
         or allowed_mime_types is distinct from
           array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
       )
  ) then
    raise exception 'The payment-receipts bucket exists with unsafe settings; make it private and restrict it to the migration MIME types and size before retrying.';
  end if;
end;
$$;

create policy "Students and administrators can read authorized receipts"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'payment-receipts'
    and (
      owner_id = (select auth.uid())::text
      or (select public.is_admin())
    )
  );
create policy "Students can upload receipts to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'payment-receipts'
    and owner_id = (select auth.uid())::text
    and name like (select auth.uid())::text || '/%'
  );
create policy "Students can remove unattached receipts from their own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'payment-receipts'
    and owner_id = (select auth.uid())::text
    and name like (select auth.uid())::text || '/%'
    and not exists (
      select 1
        from public.payment_submissions
       where receipt_path = storage.objects.name
         and user_id = (select auth.uid())
    )
  );

create function public.public_payment_plans()
returns table (code text, amount_pkr integer, duration_days integer)
language sql
stable
security definer
set search_path = ''
as $$
  select plan.code, plan.amount_pkr, plan.duration_days
    from public.payment_plans as plan
   where plan.is_active
     and plan.amount_pkr is not null
     and plan.duration_days is not null
     and exists (
       select 1
         from public.payment_settings
        where id
          and enabled
          and account_name is not null
          and account_number is not null
     )
   order by plan.amount_pkr, plan.code;
$$;

revoke all on function public.public_payment_plans() from public;
grant execute on function public.public_payment_plans() to anon, authenticated;

create function public.submit_payment(
  p_plan_code text,
  p_transaction_reference text,
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

  if p_plan_code not in ('plus', 'premium') then
    raise exception 'Choose a valid payment plan';
  end if;
  if p_transaction_reference is null
     or char_length(btrim(p_transaction_reference)) not between 4 and 120
     or p_transaction_reference ~ '[[:cntrl:]]'
  then
    raise exception 'Enter a valid NayaPay transaction reference';
  end if;
  if p_receipt_path is null
     or char_length(p_receipt_path) > 512
     or p_receipt_path not like v_user_id::text || '/%'
  then
    raise exception 'The receipt path is invalid';
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
  ) then
    raise exception 'Upload a valid payment receipt before submitting';
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
    plan_id,
    plan_code,
    plan_name,
    amount_pkr,
    duration_days,
    transaction_reference,
    receipt_path
  )
  values (
    v_user_id,
    v_plan.id,
    v_plan.code,
    v_plan.name,
    v_plan.amount_pkr,
    v_plan.duration_days,
    btrim(p_transaction_reference),
    p_receipt_path
  )
  returning id into v_submission_id;

  return v_submission_id;
end;
$$;

revoke all on function public.submit_payment(text, text, text, integer, integer) from public, anon;
grant execute on function public.submit_payment(text, text, text, integer, integer) to authenticated;

create function public.admin_review_payment(
  p_submission_id uuid,
  p_outcome text,
  p_rejection_reason text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid := (select auth.uid());
  v_submission public.payment_submissions%rowtype;
  v_subscription_id uuid;
  v_starts_at timestamptz;
begin
  if v_admin_id is null or not (select public.is_admin()) then
    raise exception 'Administrator access required';
  end if;
  if p_outcome is null or p_outcome not in ('approved', 'rejected') then
    raise exception 'Choose approved or rejected';
  end if;
  if p_outcome = 'rejected'
     and (
       p_rejection_reason is null
       or char_length(btrim(p_rejection_reason)) not between 1 and 500
     )
  then
    raise exception 'A rejection reason between 1 and 500 characters is required';
  end if;
  if p_outcome = 'approved' and p_rejection_reason is not null then
    raise exception 'A rejection reason is only valid when rejecting a submission';
  end if;

  select *
    into v_submission
    from public.payment_submissions
   where id = p_submission_id
   for update;
  if not found then
    raise exception 'Payment submission not found';
  end if;
  if v_submission.status <> 'pending' then
    raise exception 'This payment submission has already been reviewed';
  end if;

  if p_outcome = 'approved' then
    perform 1
      from auth.users
     where id = v_submission.user_id
     for update;

    select greatest(coalesce(max(ends_at), now()), now())
      into v_starts_at
      from public.user_subscriptions
     where user_id = v_submission.user_id
       and status = 'active'
       and ends_at > now();

    insert into public.user_subscriptions (
      user_id,
      payment_submission_id,
      plan_code,
      plan_name,
      amount_pkr,
      duration_days,
      starts_at,
      ends_at
    )
    values (
      v_submission.user_id,
      v_submission.id,
      v_submission.plan_code,
      v_submission.plan_name,
      v_submission.amount_pkr,
      v_submission.duration_days,
      v_starts_at,
      v_starts_at + (v_submission.duration_days * interval '1 day')
    )
    returning id into v_subscription_id;
  end if;

  update public.payment_submissions
     set status = p_outcome,
         reviewed_at = now(),
         reviewed_by = v_admin_id,
         rejection_reason = case
           when p_outcome = 'rejected' then btrim(p_rejection_reason)
           else null
         end
   where id = v_submission.id;

  return v_subscription_id;
end;
$$;

revoke all on function public.admin_review_payment(uuid, text, text) from public, anon;
grant execute on function public.admin_review_payment(uuid, text, text) to authenticated;
