-- Run once through the project's SQL editor before activating the receptionist.
-- Kept separate from migration history until it has been applied and verified.
begin;
create table if not exists public.nova_receptionist_quota (
  bucket text primary key,
  starts_at timestamptz not null,
  count integer not null check(count >= 0)
);
alter table public.nova_receptionist_quota enable row level security;
revoke all on public.nova_receptionist_quota from public, anon, authenticated;
grant select, insert, update, delete on public.nova_receptionist_quota to service_role;
create or replace function public.nova_receptionist_rate_limit(client_key text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare k text; c integer; t timestamptz; span interval; cap integer;
begin
  if current_user <> 'service_role' or client_key !~ '^[a-f0-9]{64}$' then return false; end if;
  perform pg_catalog.pg_advisory_xact_lock(781290041);
  for k, span, cap in select * from (values
    ('client:' || client_key, interval '15 minutes', 3),
    ('global:quarter', interval '15 minutes', 30),
    ('global:day', interval '24 hours', 200)
  ) as limits(bucket, duration, maximum) loop
    select count, starts_at into c,t from public.nova_receptionist_quota where bucket = k;
    if t is not null and t + span > now() and c >= cap then return false; end if;
  end loop;
  for k, span in select * from (values
    ('client:' || client_key, interval '15 minutes'),
    ('global:quarter', interval '15 minutes'),
    ('global:day', interval '24 hours')
  ) as limits(bucket, duration) loop
    insert into public.nova_receptionist_quota(bucket,starts_at,count) values(k,now(),1)
    on conflict(bucket) do update set
      count = case when nova_receptionist_quota.starts_at + span <= now() then 1 else nova_receptionist_quota.count + 1 end,
      starts_at = case when nova_receptionist_quota.starts_at + span <= now() then now() else nova_receptionist_quota.starts_at end;
  end loop;
  delete from public.nova_receptionist_quota where starts_at < now() - interval '2 days';
  return true;
end;
$$;
revoke all on function public.nova_receptionist_rate_limit(text) from public, anon, authenticated;
grant execute on function public.nova_receptionist_rate_limit(text) to service_role;
commit;
