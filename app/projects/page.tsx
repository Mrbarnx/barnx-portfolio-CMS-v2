import type { Metadata } from 'next';
import { ProjectArchive } from '@/components/ProjectArchive';
import { getPublishedProjects } from '@/lib/cms/publicProjects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected Barnabas Mikel projects across software engineering, product UI, full-stack development and practical AI integrations.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects — Barnx',
    description: 'Public builds, client work, case studies and templates across software engineering, AI and automation.',
    url: '/projects',
  },
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <main className="page">
    <section className="pageHero">
      <span className="eyebrow">PROJECT ARCHIVE</span>
      <h1>Products, interfaces<br/>and intelligent systems.</h1>
      <p>Explore public builds, client work, detailed case studies and templates. Each project shows the proof that is safe and useful to share.</p>
    </section>
    <ProjectArchive projects={projects} />
  </main>;
}
