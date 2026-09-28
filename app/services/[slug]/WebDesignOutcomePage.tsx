import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectArchive';
import type { ArchiveProject } from '@/data/permanent-projects';
import { webCapabilityProofs } from '@/data/web-capabilities';
import styles from './web-design-outcome.module.css';

const process = [
  ['01', 'Understand the goal', 'We begin with what the business needs the website to accomplish.'],
  ['02', 'Map the customer journey', 'I identify what visitors need to understand, trust and do next.'],
  ['03', 'Architect the solution', 'I recommend the right pages, functionality and supporting systems.'],
  ['04', 'Design and develop', 'The approved direction becomes a responsive, accessible experience.'],
  ['05', 'Test and launch', 'The website is checked across devices before it goes live.'],
];

export function WebDesignOutcomePage({ projects, requestHref }: { projects: ArchiveProject[]; requestHref: string }) {
  const proofProjects = webCapabilityProofs.map(({ projectSlug }) => projects.find((project) => project.slug === projectSlug)).filter((project): project is ArchiveProject => Boolean(project));
  return <main className={styles.page}>
    <Link className={styles.back} href="/services">← All services</Link>

    <section className={styles.hero}>
      <span className="eyebrow">WEB DESIGN & DEVELOPMENT</span>
      <h1>Websites built around business outcomes.</h1>
      <p>I design and develop websites that help businesses build trust, generate leads, simplify bookings, explain their services and sell more effectively.</p>
      <div className={styles.actions}><a className="button black" href={requestHref}>Request this service <ArrowRight/></a><a className="button" href="#selected-work">View website projects</a></div>
    </section>

    <section className={styles.outcomeSection}>
      <div className={styles.sectionHead}><div><span className="eyebrow">PROBLEM → SOLUTION → PROOF</span><h2>Eight common business problems. Eight working proofs.</h2></div><p>Choose the problem closest to yours. Each example shows the minimum useful system built to address it—without presenting a concept as client work.</p></div>
      <div className={styles.outcomeGrid}>{webCapabilityProofs.map((item, index) => {
        const project = projects.find(({ slug }) => slug === item.projectSlug);
        return <article key={item.capability}><small>{String(index + 1).padStart(2, '0')} · {item.capability}</small><h3>{item.problem}</h3><div className={styles.outcomeDetail}><strong>Desired outcome</strong><p>{item.outcome}</p></div><div className={styles.outcomeDetail}><strong>What I’d build</strong><p>{item.solution}</p></div>{project && <Link className={styles.proofLink} href={`/projects/${project.slug}`}>View the {project.title} proof <ArrowRight/></Link>}</article>;
      })}</div>
    </section>

    <section className={styles.approach}>
      <div><span className="eyebrow">MY APPROACH</span><h2>I start with the outcome—not the framework.</h2></div>
      <div className={styles.steps}>{process.map(([number, title, body]) => <article key={number}><small>{number}</small><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
    </section>

    <section className={styles.showroom} id="selected-work">
      <div className={styles.sectionHead}><div><span className="eyebrow">SELECTED WORK</span><h2>Relevant website proof.</h2></div><p>Selected projects showing responsive interfaces, clear presentation and product-focused web development.</p></div>
      {proofProjects.length ? <div className="projectGrid">{proofProjects.map((project) => <ProjectCard project={project} key={project.slug}/>)}</div> : <div className={styles.empty}><h3>Project proof is being prepared.</h3><p>Tell me the outcome you need and I’ll recommend the most suitable approach.</p></div>}
    </section>

    <section className={styles.cta}><div><span className="eyebrow light">HAVE A BUSINESS GOAL?</span><h2>Tell me the goal. I’ll tell you what I’d build.</h2><p>Share what your business should be doing better digitally, and we’ll define the right website or supporting system.</p></div><a href={requestHref}>Request Web Design & Development ↗</a></section>
  </main>;
}
