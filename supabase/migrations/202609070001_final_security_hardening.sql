-- Barnx CMS final security and production hardening
-- Tightens media ownership, validates stored metadata and limits anonymous
-- analytics volume without collecting network addresses or personal information.

begin;

alter table public.media_assets
  drop constraint if exists media_assets_safe_metadata_check,
  add constraint media_assets_safe_metadata_check check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif')
    and size_bytes between 1 and 8388608
    and char_length(alt_text) between 3 and 300
    and (caption is null or char_length(caption) <= 500)
    and storage_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$'
  ) not valid;

alter table public.media_assets validate constraint media_assets_safe_metadata_check;

drop policy if exists "CMS admins can view media objects" on storage.objects;
create policy "CMS admins can view media objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "CMS admins can upload media objects" on storage.objects;
create policy "CMS admins can upload media objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp', 'avif', 'gif')
);

drop policy if exists "CMS admins can update media objects" on storage.objects;
create policy "CMS admins can update media objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp', 'avif', 'gif')
);

drop policy if exists "CMS admins can delete media objects" on storage.objects;
create policy "CMS admins can delete media objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

create or replace function public.record_analytics_event(
  p_visitor_id uuid,
  p_session_id uuid,
  p_event_name text,
  p_pathname text,
  p_target text default null,
  p_referrer_host text default null,
  p_country_code text default null,
  p_device_type text default 'unknown'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event_name not in ('page_view', 'project_open', 'resource_open', 'download', 'external_click') then
    raise exception 'Unsupported analytics event';
  end if;

  if p_pathname !~ '^/' or char_length(p_pathname) > 500 then
    raise exception 'Invalid analytics pathname';
  end if;

  -- Serialize requests for one anonymous session so concurrent calls cannot
  -- bypass the limit. The UUID is anonymous and is not tied to a network address.
  perform pg_advisory_xact_lock(hashtextextended(p_session_id::text, 0));

  if (
    select count(*)
    from public.analytics_events
    where session_id = p_session_id
      and created_at >= timezone('utc', now()) - interval '1 hour'
  ) >= 120 then
    return;
  end if;

  -- Avoid recording repeated refreshes/navigation duplicates in quick succession.
  if p_event_name = 'page_view' and exists (
    select 1
    from public.analytics_events
    where session_id = p_session_id
      and event_name = 'page_view'
      and pathname = p_pathname
      and created_at >= timezone('utc', now()) - interval '10 seconds'
  ) then
    return;
  end if;

  insert into public.analytics_events (
    visitor_id, session_id, event_name, pathname, target,
    referrer_host, country_code, device_type
  ) values (
    p_visitor_id,
    p_session_id,
    p_event_name,
    left(p_pathname, 500),
    nullif(left(coalesce(p_target, ''), 500), ''),
    nullif(left(coalesce(p_referrer_host, ''), 255), ''),
    case when p_country_code ~ '^[A-Z]{2}$' then p_country_code else null end,
    case when p_device_type in ('desktop', 'mobile', 'tablet', 'unknown') then p_device_type else 'unknown' end
  );
end;
$$;

revoke all on function public.record_analytics_event(uuid, uuid, text, text, text, text, text, text) from public;
grant execute on function public.record_analytics_event(uuid, uuid, text, text, text, text, text, text) to anon, authenticated;

commit;
