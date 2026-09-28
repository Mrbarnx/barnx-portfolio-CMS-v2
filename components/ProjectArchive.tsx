'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project, ProjectType } from '@/data/content';
import { ProjectStar } from '@/components/ProjectStar';
import { mergePermanentProjects, type ArchiveProject } from '@/data/permanent-projects';

type Filter = 'all' | ProjectType | 'case_studies';
const filters: Array<[Filter, string]> = [
  ['all', 'All'],
  ['case_studies', 'Case Studies'],
  ['client_work', 'Client Work'],
  ['template', 'Templates'],
];

const filterIntroductions: Record<Filter, string> = {
  all: 'Explore public builds, client work, detailed case studies and templates. Each project shows the proof that is safe and useful to share.',
  public_build: 'Personal products and experiments I build publicly to explore ideas, solve practical problems and demonstrate how I design and engineer software.',
  client_work: 'Selected projects completed for clients who have permitted me to showcase the work, my contribution and the resulting solution.',
  case_studies: 'Detailed breakdowns of selected projects, covering the problem, product decisions, technical approach, challenges and final outcome.',
  template: 'Polished, reusable website experiences for businesses and creators who want a strong starting point without building from scratch.',
  private_project: 'Selected private product work presented through the proof that is safe and appropriate to share.',
};

function typeLabel(type: ProjectType) {
  return { public_build: 'Public Build', client_work: 'Client Work', private_project: 'Private Project', template: 'Template' }[type];
}

export function ProjectCard({ project }: { project: ArchiveProject }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const type = project.projectType ?? 'public_build';
  const caseHref = project.href ?? `/projects/${project.slug}`;
  const visualHref = project.caseStudyEnabled !== false ? caseHref : project.live ?? project.buyUrl ?? project.github;
  const visual = <div className={`projectVisual ${project.tone}${project.coverImage ? ' hasCover' : ''}`}>
    <div className="browser"><i/><i/><i/></div>
    {project.coverImage
      ? <img className="projectCoverImage" src={project.coverImage.url} alt={project.coverImage.alt}/>
      : <><strong>{project.display}</strong><small>{project.visualSubtitle}</small></>}
  </div>;

  useEffect(() => {
    if (!previewOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setPreviewOpen(false);
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('projectPreviewOpen');
    closeButton.current?.focus();
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('projectPreviewOpen'); };
  }, [previewOpen]);

  return <motion.div className="projectCardWrap" layout initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18,scale:.98}} transition={{duration:.42,ease:[.22,1,.36,1]}}>
    <motion.article className="projectCard" whileHover={{y:-8,rotateX:1.2,rotateY:-1.2}} transition={{duration:.25}}>
      {project.interactivePreview && project.live
        ? <button className="projectVisualTrigger" type="button" onClick={() => setPreviewOpen(true)} aria-label={`Preview ${project.title} inside this page`}>{visual}</button>
        : visualHref
        ? visualHref.startsWith('/') ? <Link href={visualHref}>{visual}</Link> : <a href={visualHref} target="_blank" rel="noreferrer">{visual}</a>
        : visual}
      <div className="projectBody">
        <span>{project.caseStudyEnabled !== false ? 'Case Study' : typeLabel(type)} · {project.category}</span>
        <h2>{project.title}</h2>
        <p>{project.short}</p>
        <div className="tags">{project.tech.slice(0, 4).map(item => <b key={item}>{item}</b>)}</div>
        <div className="projectActions" aria-label={`${project.title} links`}>
          {project.interactivePreview && project.live ? <button type="button" onClick={() => setPreviewOpen(true)}>Interactive Preview ↗</button> : project.live ? <a href={project.live} target="_blank" rel="noreferrer">{type === 'client_work' ? 'View Project' : 'Live Preview'} ↗</a> : null}
          {project.video?.url ? project.caseStudyEnabled !== false
            ? <Link href={`${caseHref}#project-media`}>Watch Demo ▶</Link>
            : <a href={project.video.url} target="_blank" rel="noreferrer">Watch Demo ▶</a> : null}
          {project.video?.visibility === 'private' ? project.caseStudyEnabled !== false
            ? <Link href={`${caseHref}#project-media`}>Request Demo ↗</Link>
            : <a href={`mailto:mrbarnx@gmail.com?subject=${encodeURIComponent(`${project.title} private demo request`)}`}>Request Demo ↗</a> : null}
          {project.github ? <a href={project.github} target="_blank" rel="noreferrer">Source Code ↗</a> : null}
          {project.caseStudyEnabled !== false ? <Link href={caseHref}>Case Study →</Link> : null}
          {project.impactSlug ? <Link href={`/impact/${project.impactSlug}`}>Impact Story →</Link> : null}
          {project.buyUrl ? <a href={project.buyUrl} target="_blank" rel="noreferrer">Buy Template ↗</a> : null}
        </div>
      </div>
    </motion.article>
    <ProjectStar id={project.slug}/>
    {previewOpen && project.live ? <div className="projectPreviewBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPreviewOpen(false)}>
      <section className="projectPreviewDialog" role="dialog" aria-modal="true" aria-labelledby={`${project.slug}-preview-title`}>
        <header><div><span>Interactive public build</span><strong id={`${project.slug}-preview-title`}>{project.title}</strong></div><button ref={closeButton} type="button" onClick={() => setPreviewOpen(false)} aria-label="Close interactive preview">Close ×</button></header>
        <iframe title={`${project.title} interactive preview`} src={project.live} sandbox="allow-forms allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
      </section>
    </div> : null}
  </motion.div>;
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>('all');
  const allProjects = mergePermanentProjects(projects);
  const visible = allProjects.filter(project => active === 'all'
    || active === 'case_studies' && project.caseStudyEnabled !== false
    || (project.projectType ?? 'public_build') === active);

  return <>
    <AnimatePresence mode="wait" initial={false}>
      <motion.p className="projectFilterIntro" key={active} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}} aria-live="polite">{filterIntroductions[active]}</motion.p>
    </AnimatePresence>
    <nav className="projectFilters" aria-label="Filter projects">
      {filters.map(([value, label]) => <button className={active === value ? 'active' : ''} type="button" onClick={() => setActive(value)} aria-pressed={active === value} key={value}>{label}</button>)}
    </nav>
    {visible.length
      ? <motion.section className="projectGrid" layout aria-live="polite"><AnimatePresence mode="popLayout">{visible.map(project => <ProjectCard project={project} key={project.slug}/>)}</AnimatePresence></motion.section>
      : <section className="projectFilterEmpty" aria-live="polite"><h2>No published projects here yet.</h2><p>This category will appear as verified work is added through the CMS.</p></section>}
  </>;
}
