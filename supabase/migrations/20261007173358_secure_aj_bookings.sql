create table if not exists public.aj_booking_requests (
request_id uuid primary key,
inserted_at timestamptz not null default now(),
name text not null check(length(name) between 2 and 80),
phone text not null check(phone ~ '^[2-9][0-9]{2}[2-9][0-9]{6}$'),
email text not null default '' check(length(email)<=254),
vehicle text not null check(length(vehicle) between 2 and 120),
address text not null check(length(address) between 5 and 240),
service text not null check(service in ('refresh','full','complete')),
date text not null default '', requests text not null default '' check(length(requests)<=2000)
);
alter table public.aj_booking_requests enable row level security;
revoke all on public.aj_booking_requests from public,anon,authenticated;
grant all on public.aj_booking_requests to service_role;
create table if not exists public.aj_booking_limits (key text primary key, window_start timestamptz not null, attempts integer not null);
alter table public.aj_booking_limits enable row level security;
revoke all on public.aj_booking_limits from public,anon,authenticated;
grant all on public.aj_booking_limits to service_role;
create or replace function public.aj_booking_rate_limit(bucket_key text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare global_count integer; client_count integer; current_window timestamptz := to_timestamp(floor(extract(epoch from now()) /900)*900);
begin
if bucket_key !~ '^[0-9a-f]{64}$' then return false; end if;
insert into public.aj_booking_limits as limits values('global',current_window,1)
on conflict(key) do update set attempts=case when limits.window_start=excluded.window_start then limits.attempts+1 else 1 end, window_start=excluded.window_start returning attempts into global_count;
insert into public.aj_booking_limits as limits values(bucket_key,current_window,1)
on conflict(key) do update set attempts=case when limits.window_start=excluded.window_start then limits.attempts+1 else 1 end, window_start=excluded.window_start returning attempts into client_count;
delete from public.aj_booking_limits where window_start<now()-interval '1 day';
return global_count<=100 and client_count<=5;
end; $$;
revoke all on function public.aj_booking_rate_limit(text) from public,anon,authenticated;
grant execute on function public.aj_booking_rate_limit(text) to service_role;
