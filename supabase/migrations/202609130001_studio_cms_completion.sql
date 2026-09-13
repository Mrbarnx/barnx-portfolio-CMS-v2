-- Batch G: make Studio resources fully CMS-controlled and add open-source projects.
begin;
delete from public.studio_resources where slug = 'prompt-library';

alter table public.studio_resources
  drop constraint if exists studio_resources_resource_type_check;

update public.studio_resources set resource_type = 'other' where resource_type = 'prompt_library';

alter table public.studio_resources
  add constraint studio_resources_resource_type_check
  check (resource_type in ('guide', 'component', 'workflow', 'open_source_project', 'template', 'blueprint', 'visual_asset', 'other'));

update storage.buckets set
  file_size_limit = 15728640,
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'application/pdf', 'text/markdown', 'text/plain', 'application/json',
    'application/zip', 'application/x-zip-compressed',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
where id = 'cms-media';

alter table public.media_assets
  drop constraint if exists media_assets_safe_metadata_check,
  add constraint media_assets_safe_metadata_check check (
    mime_type in (
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
      'application/pdf', 'text/markdown', 'text/plain', 'application/json',
      'application/zip', 'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    and size_bytes between 1 and 15728640
    and char_length(alt_text) between 3 and 300
    and (caption is null or char_length(caption) <= 500)
    and storage_path ~ '^[0-9a-f-]{36}/(documents/)?[0-9a-f-]{36}\.(jpg|png|webp|avif|gif|pdf|md|txt|json|zip|docx)$'
  ) not valid;

alter table public.media_assets validate constraint media_assets_safe_metadata_check;

drop policy if exists "CMS admins can upload media objects" on storage.objects;
create policy "CMS admins can upload media objects" on storage.objects for insert to authenticated
with check (
  bucket_id = 'cms-media' and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp', 'avif', 'gif', 'pdf', 'md', 'txt', 'json', 'zip', 'docx')
);

drop policy if exists "CMS admins can update media objects" on storage.objects;
create policy "CMS admins can update media objects" on storage.objects for update to authenticated
using (bucket_id = 'cms-media' and public.is_cms_admin() and (storage.foldername(name))[1] = auth.uid()::text)
with check (
  bucket_id = 'cms-media' and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp', 'avif', 'gif', 'pdf', 'md', 'txt', 'json', 'zip', 'docx')
);

commit;
