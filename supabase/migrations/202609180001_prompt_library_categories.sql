-- Barnx Prompt Library categories and optional visual previews
begin;

create table if not exists public.prompt_categories (
  id uuid primary key default gen_random_uuid(), name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '', icon text not null default '✦',
  published boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.prompt_categories (name,slug,description,icon,published,sort_order) values
('Code','code','Prompts for planning, building, reviewing and improving software.','</>',true,0),
('AI Agents','ai-agents','Prompts for designing capable agents, tools and multi-step workflows.','◎',true,1),
('Web Design','web-design','Prompts for interfaces, landing pages and thoughtful digital experiences.','◫',true,2),
('Image Creation','image-creation','Prompts for art direction, product visuals and image generation.','◇',true,3),
('Video Creation','video-creation','Prompts for concepts, scenes, motion and generated video.','▶',true,4),
('Business & Automation','business-automation','Prompts for practical systems, operations and repeatable workflows.','↻',true,5),
('Writing & Content','writing-content','Prompts for clearer ideas, useful content and stronger communication.','Aa',true,6)
on conflict (slug) do update set name=excluded.name,description=excluded.description,icon=excluded.icon,sort_order=excluded.sort_order;

alter table public.prompt_resources
  add column if not exists category_id uuid references public.prompt_categories(id) on delete restrict,
  add column if not exists preview_type text not null default 'none',
  add column if not exists preview_video_url text;
update public.prompt_resources set category_id=(select id from public.prompt_categories where slug='code') where category_id is null;
alter table public.prompt_resources drop constraint if exists prompt_resources_preview_type_check;
alter table public.prompt_resources add constraint prompt_resources_preview_type_check check (preview_type in ('none','image','video'));
create index if not exists prompt_resources_category_order_idx on public.prompt_resources(category_id,published,sort_order);

create trigger prompt_categories_set_updated_at before update on public.prompt_categories
for each row execute function public.set_updated_at();
alter table public.prompt_categories enable row level security;
create policy "Published prompt categories are publicly readable" on public.prompt_categories for select to anon,authenticated using (published or public.is_cms_admin());
create policy "CMS admins can manage prompt categories" on public.prompt_categories for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
grant select on table public.prompt_categories to anon;
grant select,insert,update,delete on table public.prompt_categories to authenticated;
commit;
