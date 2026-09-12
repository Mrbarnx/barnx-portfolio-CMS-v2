'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project, ProjectType } from '@/data/content';
import { ProjectStar } from '@/components/ProjectStar';

type Filter = 'all' | ProjectType | 'case_studies';
type ArchiveProject = Project & { href?: string };

const filters: Array<[Filter, string]> = [
  ['all', 'All'],
  ['public_build', 'Public Builds'],
  ['client_work', 'Client Work'],
  ['case_studies', 'Case Studies'],
  ['template', 'Templates'],
];

const permanentProjects: ArchiveProject[] = [
  {
    slug: 'barnx-portfolio-cms', title: 'Barnx Portfolio CMS', display: 'BARNX CMS', category: 'Full-Stack CMS', status: 'Production',
    short: 'Authenticated content management, media storage, publishing workflows, analytics, privacy controls and automated deployments.',
    overview: '', visualSubtitle: 'Portfolio content and publishing system', tone: 'black', problem: '', solution: '', role: 'Software Engineer', features: [],
    tech: ['Next.js', 'Supabase', 'PostgreSQL', 'Vercel'], challenges: '', lessons: '', github: 'https://github.com/Mrbarnx/barnx-portfolio-CMS-v2',
    projectType: 'public_build', caseStudyEnabled: true, href: '/projects/barnx-portfolio-cms',
  },
  {
    slug: 'automation-systems', title: 'AI Automation & Software Systems', display: 'AUTOMATION', category: 'Software Systems', status: 'In development',
    short: 'Business systems and demos designed around lead response, support, CRM and repetitive operational work.',
    overview: '', visualSubtitle: 'Lead response · Support · CRM · Operations', tone: 'black', problem: '', solution: '', role: 'Software Engineer', features: [],
    tech: ['Automation', 'AI', 'APIs', 'Workflows'], challenges: '', lessons: '', projectType: 'public_build', caseStudyEnabled: true,
    href: '/barnx-studio/automation-systems',
  },
];

function typeLabel(type: ProjectType) {
  return { public_build: 'Public Build', client_work: 'Client Work', private_project: 'Private Project', template: 'Template' }[type];
}

function ProjectCard({ project }: { project: ArchiveProject }) {
  const type = project.projectType ?? 'public_build';
  const caseHref = project.href ?? `/projects/${project.slug}`;
  const visualHref = project.caseStudyEnabled !== false ? caseHref : project.live ?? project.buyUrl ?? project.github;
  const visual = <div className={`projectVisual ${project.tone}${project.coverImage ? ' hasCover' : ''}`}>
    <div className="browser"><i/><i/><i/></div>
    {project.coverImage
      ? <img className="projectCoverImage" src={project.coverImage.url} alt={project.coverImage.alt}/>
      : <><strong>{project.display}</strong><small>{project.visualSubtitle}</small></>}
  </div>;

  return <motion.div className="projectCardWrap" layout initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18,scale:.98}} transition={{duration:.42,ease:[.22,1,.36,1]}}>
    <motion.article className="projectCard" whileHover={{y:-8,rotateX:1.2,rotateY:-1.2}} transition={{duration:.25}}>
      {visualHref
        ? visualHref.startsWith('/') ? <Link href={visualHref}>{visual}</Link> : <a href={visualHref} target="_blank" rel="noreferrer">{visual}</a>
        : visual}
      <div className="projectBody">
        <span>{typeLabel(type)} · {project.category} · {project.status}</span>
        <h2>{project.title}</h2>
        <p>{project.short}</p>
        <div className="tags">{project.tech.slice(0, 4).map(item => <b key={item}>{item}</b>)}</div>
        <div className="projectActions" aria-label={`${project.title} links`}>
          {project.live ? <a href={project.live} target="_blank" rel="noreferrer">{type === 'client_work' ? 'View Project' : 'Live Preview'} ↗</a> : null}
          {project.video?.url ? project.caseStudyEnabled !== false
            ? <Link href={`${caseHref}#project-media`}>Watch Demo ▶</Link>
            : <a href={project.video.url} target="_blank" rel="noreferrer">Watch Demo ▶</a> : null}
          {project.video?.visibility === 'private' ? project.caseStudyEnabled !== false
            ? <Link href={`${caseHref}#project-media`}>Request Demo ↗</Link>
            : <a href={`mailto:mrbarnx@gmail.com?subject=${encodeURIComponent(`${project.title} private demo request`)}`}>Request Demo ↗</a> : null}
          {project.github ? <a href={project.github} target="_blank" rel="noreferrer">Source Code ↗</a> : null}
          {project.caseStudyEnabled !== false ? <Link href={caseHref}>Case Study →</Link> : null}
          {project.buyUrl ? <a href={project.buyUrl} target="_blank" rel="noreferrer">Buy Template ↗</a> : null}
        </div>
      </div>
    </motion.article>
    <ProjectStar id={project.slug}/>
  </motion.div>;
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>('all');
  const allProjects = [...permanentProjects, ...projects.filter(project => !permanentProjects.some(item => item.slug === project.slug))];
  const visible = allProjects.filter(project => active === 'all'
    || active === 'case_studies' && project.caseStudyEnabled !== false
    || (project.projectType ?? 'public_build') === active);

  return <>
    <nav className="projectFilters" aria-label="Filter projects">
      {filters.map(([value, label]) => <button className={active === value ? 'active' : ''} type="button" onClick={() => setActive(value)} aria-pressed={active === value} key={value}>{label}</button>)}
    </nav>
    {visible.length
      ? <motion.section className="projectGrid" layout aria-live="polite"><AnimatePresence mode="popLayout">{visible.map(project => <ProjectCard project={project} key={project.slug}/>)}</AnimatePresence></motion.section>
      : <section className="projectFilterEmpty" aria-live="polite"><h2>No published projects here yet.</h2><p>This category will appear as verified work is added through the CMS.</p></section>}
  </>;
}
