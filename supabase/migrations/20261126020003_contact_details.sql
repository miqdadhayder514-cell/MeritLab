create table public.contact_settings (
  id boolean primary key default true check (id),
  email text,
  whatsapp_number text,
  updated_at timestamptz not null default now(),
  check (
    email is null
    or (
      char_length(btrim(email)) between 6 and 254
      and btrim(email) ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9-]+(\.[A-Z0-9-]+)+$'
    )
  ),
  check (
    whatsapp_number is null
    or btrim(whatsapp_number) ~ '^\+?[0-9][0-9 ()-]{6,23}$'
  )
);

insert into public.contact_settings (id)
values (true)
on conflict (id) do nothing;

create trigger contact_settings_set_updated_at
  before update on public.contact_settings
  for each row execute function public.set_updated_at();

alter table public.contact_settings enable row level security;
revoke all on public.contact_settings from anon, authenticated;
grant select on public.contact_settings to anon, authenticated;
grant update (email, whatsapp_number) on public.contact_settings to authenticated;

create policy "Public can read configured contact channels"
  on public.contact_settings for select to anon, authenticated
  using (email is not null or whatsapp_number is not null);
create policy "Administrators can read contact channels"
  on public.contact_settings for select to authenticated
  using ((select public.is_admin()));

create policy "Administrators can update contact channels"
  on public.contact_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
