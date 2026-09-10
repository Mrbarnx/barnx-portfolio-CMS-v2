-- Project ownership categories and context-aware portfolio actions

begin;

alter table public.projects
  add column if not exists project_type text not null default 'public_build',
  add column if not exists case_study_enabled boolean not null default true,
  add column if not exists buy_url text;

update public.projects
set project_type = case
  when status = 'private_demo' then 'private_project'
  else 'public_build'
end
where project_type = 'public_build';

alter table public.projects
  drop constraint if exists projects_project_type_check,
  add constraint projects_project_type_check check (
    project_type in ('public_build', 'client_work', 'private_project', 'template')
  ),
  drop constraint if exists projects_buy_url_https_check,
  add constraint projects_buy_url_https_check check (
    buy_url is null or buy_url ~ '^https://'
  ),
  drop constraint if exists projects_buy_url_template_check,
  add constraint projects_buy_url_template_check check (
    buy_url is null or project_type = 'template'
  );

comment on column public.projects.project_type is
  'Ownership/context classification used by public portfolio filters.';
comment on column public.projects.case_study_enabled is
  'Controls whether the detailed internal case study is publicly accessible.';
comment on column public.projects.buy_url is
  'Optional secure purchase destination, primarily for template projects.';

commit;
