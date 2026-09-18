import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectArchive';
import { mergePermanentProjects } from '@/data/permanent-projects';
import { getServiceShowroom, projectsForService, serviceShowrooms } from '@/data/service-showrooms';
import { getPublishedProjects } from '@/lib/cms/publicProjects';
import styles from './service.module.css';
import { WebDesignOutcomePage } from './WebDesignOutcomePage';

export const dynamic = 'force-dynamic';

export function generateStaticParams() { return serviceShowrooms.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceShowroom(slug);
  if (!service) return { title: 'Service' };
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.title} — Barnx`, description: service.summary, url: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceShowroom(slug);
  if (!service) notFound();

  const projects = projectsForService(service, mergePermanentProjects(await getPublishedProjects()));
  const requestHref = `mailto:mrbarnx@gmail.com?subject=${encodeURIComponent(`${service.title} service request`)}`;

  if (service.slug === 'web-design-development') return <WebDesignOutcomePage projects={projects} requestHref={requestHref}/>;

  return <main className={styles.page}>
    <Link className={styles.back} href="/capabilities">← All services</Link>
    <section className={styles.hero}>
      <span className="eyebrow">SERVICE {service.number}</span>
      <h1>{service.title}</h1>
      <p>{service.lead}</p>
      <div className={styles.actions}><a className="button black" href={requestHref}>Request this service <ArrowRight/></a><a className="button" href="#selected-work">See related work</a></div>
    </section>

    <section className={styles.details}>
      <div><span className="eyebrow">WHAT I CAN BUILD</span><h2>Work shaped around your actual need.</h2></div>
      <div className={styles.lists}>
        <article><h3>Deliverables</h3><ul>{service.offerings.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><h3>Problems this can solve</h3><ul>{service.problems.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section className={styles.showroom} id="selected-work">
      <div className={styles.sectionHead}><div><span className="eyebrow">SELECTED WORK</span><h2>Relevant project proof.</h2></div><p>Projects connected to this service, showing the level of proof that is safe and useful to share.</p></div>
      {projects.length ? <div className="projectGrid">{projects.map((project) => <ProjectCard project={project} key={project.slug}/>)}</div> : <div className={styles.empty}><h3>Project proof is being prepared.</h3><p>I can still discuss the product you need and explain the most suitable approach.</p></div>}
    </section>

    <section className={styles.cta}><div><span className="eyebrow light">HAVE A PROJECT IN MIND?</span><h2>Let’s define the right solution.</h2><p>Share the problem, users and outcome you are aiming for. I’ll help identify a practical next step.</p></div><a href={requestHref}>Request this service ↗</a></section>
  </main>;
}
