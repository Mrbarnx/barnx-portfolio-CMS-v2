-- Public résumé delivery with writes restricted to authenticated CMS admins.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-documents', 'cms-documents', true, 5242880, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "CMS admins can view document objects" on storage.objects;
create policy "CMS admins can view document objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'cms-documents'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "CMS admins can upload document objects" on storage.objects;
create policy "CMS admins can upload document objects"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'cms-documents'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) = 'pdf'
);

drop policy if exists "CMS admins can delete document objects" on storage.objects;
create policy "CMS admins can delete document objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'cms-documents'
  and public.is_cms_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

commit;
