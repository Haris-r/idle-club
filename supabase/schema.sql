-- Run in Supabase SQL Editor. Replace the placeholder admin UUID after authenticating.
create extension if not exists pgcrypto;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(email) between 5 and 254),
  first_name text check (length(first_name) <= 80),
  colour text not null check (colour in ('Onyx Black','Stone Grey','Cloud Cream','Midnight Navy')),
  size text not null check (size in ('XS','S','M','L','XL','XXL')),
  quantity int not null check (quantity between 1 and 10),
  source text check (length(source) <= 60),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, colour, size)
);
create index if not exists reservations_created_at_idx on public.reservations(created_at desc);
alter table public.admin_users enable row level security;
alter table public.reservations enable row level security;
revoke all on public.admin_users from anon, authenticated;
revoke all on public.reservations from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.reservations to authenticated;
create policy "Admins can see themselves" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "Admins can view reservations" on public.reservations for select to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Only public function is exposed for visitor submissions. Visitors cannot read customers.
create or replace function public.submit_reservation(
 p_email text, p_first_name text, p_colour text, p_size text,
 p_quantity integer, p_source text, p_marketing_opt_in boolean
) returns void language plpgsql security definer set search_path = '' as $$
declare normalized_email text := lower(trim(p_email));
begin
 if length(normalized_email) not between 5 and 254 or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
   raise exception 'Invalid email';
 end if;
 if p_quantity not between 1 and 10 or p_colour not in ('Onyx Black','Stone Grey','Cloud Cream','Midnight Navy') or p_size not in ('XS','S','M','L','XL','XXL') then
   raise exception 'Invalid selection';
 end if;
 insert into public.reservations(email,first_name,colour,size,quantity,source,marketing_opt_in)
 values (normalized_email,nullif(left(trim(coalesce(p_first_name,'')),80),''),p_colour,p_size,p_quantity,left(coalesce(p_source,'direct'),60),coalesce(p_marketing_opt_in,false))
 on conflict (email,colour,size) do update set
 quantity=excluded.quantity, first_name=excluded.first_name,
 source=excluded.source, marketing_opt_in=excluded.marketing_opt_in,
 updated_at=now();
end $$;
revoke all on function public.submit_reservation(text,text,text,text,integer,text,boolean) from public, anon, authenticated;
grant execute on function public.submit_reservation(text,text,text,text,integer,text,boolean) to anon;

-- After an admin signs in for the first time, find UID in Authentication > Users;
-- then run separately (replacing the example UUID):
-- insert into public.admin_users(user_id) values ('YOUR-ADMIN-AUTH-USER-UUID');
