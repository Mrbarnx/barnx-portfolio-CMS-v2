-- Barnx analytics automatic 90-day retention
-- Opportunistically prunes expired anonymous events at most once per day.

begin;

create table if not exists public.analytics_maintenance (
  maintenance_key text primary key,
  last_run_at timestamptz not null default to_timestamp(0)
);

alter table public.analytics_maintenance enable row level security;
revoke all on table public.analytics_maintenance from anon, authenticated;

insert into public.analytics_maintenance (maintenance_key)
values ('retention')
on conflict (maintenance_key) do nothing;

create or replace function public.enforce_analytics_retention()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  should_prune boolean := false;
begin
  update public.analytics_maintenance
  set last_run_at = timezone('utc', now())
  where maintenance_key = 'retention'
    and last_run_at < timezone('utc', now()) - interval '24 hours'
  returning true into should_prune;

  if coalesce(should_prune, false) then
    delete from public.analytics_events
    where created_at < timezone('utc', now()) - interval '90 days';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_analytics_retention() from public;

drop trigger if exists analytics_events_retention_trigger on public.analytics_events;
create trigger analytics_events_retention_trigger
before insert on public.analytics_events
for each row execute function public.enforce_analytics_retention();

delete from public.analytics_events
where created_at < timezone('utc', now()) - interval '90 days';

update public.analytics_maintenance
set last_run_at = timezone('utc', now())
where maintenance_key = 'retention';

commit;
