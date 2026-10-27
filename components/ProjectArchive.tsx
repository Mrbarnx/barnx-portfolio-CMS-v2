'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project, ProjectType } from '@/data/content';
import { ProjectStar } from '@/components/ProjectStar';
import { mergePermanentProjects, type ArchiveProject } from '@/data/permanent-projects';

type Filter = 'all' | ProjectType | 'custom_software' | 'web_design' | 'workflow_automation' | 'ai_automation';
const filterSlugs: Record<Filter, string | null> = {
  all: null,
  custom_software: 'custom-software',
  web_design: 'web-design',
  workflow_automation: 'workflow-automation',
  ai_automation: 'ai-automation',
  public_build: 'public-builds',
  private_project: 'case-studies',
  client_work: 'client-work',
  template: 'templates',
};
const filters: Array<[Filter, string]> = [
  ['all', 'All'],
  ['custom_software', 'Custom Software'],
  ['web_design', 'Web Design & Development'],
  ['workflow_automation', 'Workflow Automation'],
  ['ai_automation', 'AI & Automation'],
  ['public_build', 'Public Builds'],
  ['private_project', 'Case Studies'],
  ['client_work', 'Client Work'],
];

const filterIntroductions: Record<Filter, string> = {
  all: 'Explore custom software, web design, workflow automation, AI systems, public builds and detailed case studies. Each project shows the proof that is safe and useful to share.',
  custom_software: 'Operational products, dashboards and purpose-built systems designed around real business processes.',
  web_design: 'Responsive websites and customer journeys designed to explain, persuade and turn interest into a clear next step.',
  workflow_automation: 'Connected request and follow-up workflows that reduce repetitive work without claiming AI where none is used.',
  ai_automation: 'AI-assisted products with visible behavior, boundaries and human control.',
  public_build: 'Open-source products shared publicly so people can use the working software, inspect the implementation and build on the ideas.',
  client_work: 'Selected projects completed for clients who have permitted me to showcase the work, my contribution and the resulting solution.',
  private_project: 'Independent concept solutions showing the problem, product decisions, working flow, evidence and honest limitations.',
  template: 'Responsive web design systems for businesses and creators who need a strong, reusable starting point.',
};

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5 8.5 12l7 7"/><path d="M9 12h10"/></svg>;
}

function typeLabel(type: ProjectType) {
  return { public_build: 'Public Build', client_work: 'Client Work', private_project: 'Case Study', template: 'Template' }[type];
}

export function ProjectCard({ project }: { project: ArchiveProject }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [previewSize, setPreviewSize] = useState<'phone'|'tablet'|'desktop'>('desktop');
  const closeButton = useRef<HTMLButtonElement>(null);
  const type = project.projectType ?? 'public_build';
  const caseHref = project.href ?? `/projects/${project.slug}`;
  const visualHref = project.caseStudyEnabled !== false ? caseHref : project.live ?? project.buyUrl ?? project.github;
  const openPreview = () => {
    if (!project.live) return;
    setPreviewExpanded(false);
    setPreviewOpen(true);
  };
  const visual = <div className={`projectVisual ${project.tone}${project.coverImage ? ' hasCover' : ''}`}>
    <div className="browser"><i/><i/><i/></div>
    {project.coverImage
      ? <img className="projectCoverImage" src={project.coverImage.url} alt={project.coverImage.alt}/>
      : <><strong>{project.display}</strong><small>{project.visualSubtitle}</small></>}
  </div>;

  useEffect(() => {
    if (!previewOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (previewExpanded) setPreviewExpanded(false);
      else setPreviewOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('projectPreviewOpen');
    closeButton.current?.focus();
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('projectPreviewOpen'); };
  }, [previewExpanded, previewOpen]);

  return <motion.div className="projectCardWrap" layout initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18,scale:.98}} transition={{duration:.42,ease:[.22,1,.36,1]}}>
    <motion.article className="projectCard" whileHover={{y:-8,rotateX:1.2,rotateY:-1.2}} transition={{duration:.25}}>
      {visualHref
        ? visualHref.startsWith('/') ? <Link href={visualHref}>{visual}</Link> : <a href={visualHref} target="_blank" rel="noreferrer">{visual}</a>
        : visual}
      <div className="projectBody">
        <span>{typeLabel(type)} · {project.category}</span>
        <h2>{project.title}</h2>
        <p>{project.short}</p>
        <div className="tags">{project.tech.slice(0, 4).map(item => <b key={item}>{item}</b>)}</div>
        <div className="projectActions" aria-label={`${project.title} links`}>
          {project.interactivePreview && project.live ? <button type="button" onClick={openPreview}>Interactive Preview ↗</button> : project.live ? <a href={project.live} target="_blank" rel="noreferrer">{type === 'client_work' ? 'View Project' : 'Live Preview'} ↗</a> : null}
          {project.video?.url ? project.caseStudyEnabled !== false
            ? <Link href={`${caseHref}#project-media`}>Watch Demo ▶</Link>
            : <a href={project.video.url} target="_blank" rel="noreferrer">Watch Demo ▶</a> : null}
          {project.video?.visibility === 'private' ? project.caseStudyEnabled !== false
            ? <Link href={`${caseHref}#project-media`}>Request Demo ↗</Link>
            : <a href={`mailto:mrbarnx@gmail.com?subject=${encodeURIComponent(`${project.title} private demo request`)}`}>Request Demo ↗</a> : null}
          {project.github ? <a href={project.github} target="_blank" rel="noreferrer">Source Code ↗</a> : null}
          {project.caseStudyEnabled !== false ? <Link href={caseHref}>{type==='private_project'?'Case Study':'Project Details'} →</Link> : null}
          {project.impactSlug ? <Link href={`/impact/${project.impactSlug}`}>Impact Story →</Link> : null}
          {project.buyUrl ? <a href={project.buyUrl} target="_blank" rel="noreferrer">Buy Template ↗</a> : null}
        </div>
      </div>
    </motion.article>
    <ProjectStar id={project.slug}/>
    {previewOpen && project.live ? <div className={`projectPreviewBackdrop${previewExpanded ? ' isFullscreen' : ''}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setPreviewExpanded(false); setPreviewOpen(false); } }}>
      <section className="projectPreviewDialog" role="dialog" aria-modal="true" aria-labelledby={`${project.slug}-preview-title`}>
        <header><button className="previewBack" ref={closeButton} type="button" onClick={() => { setPreviewExpanded(false); setPreviewOpen(false); }} aria-label="Back to projects"><BackIcon/><span>Back</span></button><strong className="previewTitle" id={`${project.slug}-preview-title`}>{project.title}</strong><div className="previewDialogTools"><div className="previewSizeControls" aria-label="Preview size">{(['phone','tablet','desktop'] as const).map(size=><button type="button" className={previewSize===size?'active':''} onClick={()=>setPreviewSize(size)} aria-pressed={previewSize===size} key={size}>{size}</button>)}</div><button className="previewExpand" type="button" onClick={() => setPreviewExpanded(value => !value)}>{previewExpanded?'Exit full screen':'Full screen'}</button></div></header>
        <div className={`responsivePreviewStage ${previewSize}`}><iframe title={`${project.title} interactive preview`} src={project.live} sandbox="allow-forms allow-scripts allow-same-origin allow-popups" referrerPolicy="no-referrer" /></div>
      </section>
    </div> : null}
  </motion.div>;
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const active = (Object.entries(filterSlugs).find(([, slug]) => slug === requestedCategory)?.[0] as Filter | undefined) ?? 'all';
  const allProjects = mergePermanentProjects(projects);
  const visible = allProjects.filter(project => {
    if (active === 'all') return true;
    if (active === 'custom_software') return project.category === 'Custom Software';
    if (active === 'web_design') return project.category === 'Web Design & Development';
    if (active === 'workflow_automation') return project.category === 'Workflow Automation';
    if (active === 'ai_automation') return project.category === 'AI & Automation';
    return (project.projectType ?? 'private_project') === active;
  });

  const selectFilter = (filter: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    const slug = filterSlugs[filter];
    if (slug) params.set('category', slug);
    else params.delete('category');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return <>
    <AnimatePresence mode="wait" initial={false}>
      <motion.p className="projectFilterIntro" key={active} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}} aria-live="polite">{filterIntroductions[active]}</motion.p>
    </AnimatePresence>
    <nav className="projectFilters" aria-label="Filter projects">
      {filters.map(([value, label]) => <button className={active === value ? 'active' : ''} type="button" onClick={() => selectFilter(value)} aria-pressed={active === value} key={value}>{label}</button>)}
    </nav>
    {visible.length
      ? <motion.section className="projectGrid" layout aria-live="polite"><AnimatePresence mode="popLayout">{visible.map(project => <ProjectCard project={project} key={project.slug}/>)}</AnimatePresence></motion.section>
      : <section className="projectFilterEmpty" aria-live="polite"><h2>No published projects here yet.</h2><p>This category will appear as verified work is added through the CMS.</p></section>}
  </>;
}
