import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectArchive';
import type { ArchiveProject } from '@/data/permanent-projects';
import styles from './web-design-outcome.module.css';

const outcomes = [
  ['Build more trust', 'Professional business website'],
  ['Generate more leads from ads', 'Conversion-focused landing page'],
  ['Stop losing Instagram or WhatsApp leads', 'Lead capture and follow-up system'],
  ['Reduce booking back-and-forth', 'Online booking system'],
  ['Explain your services clearly', 'Service pages and FAQs'],
  ['Reduce repetitive manual work', 'Website and workflow automation'],
  ['Showcase or sell your products', 'Product catalogue or digital storefront'],
];

const process = [
  ['01', 'Understand the goal', 'We begin with what the business needs the website to accomplish.'],
  ['02', 'Map the customer journey', 'I identify what visitors need to understand, trust and do next.'],
  ['03', 'Architect the solution', 'I recommend the right pages, functionality and supporting systems.'],
  ['04', 'Design and develop', 'The approved direction becomes a responsive, accessible experience.'],
  ['05', 'Test and launch', 'The website is checked across devices before it goes live.'],
];

const deliverables = [
  'Business and company websites', 'Conversion-focused landing pages', 'Service and booking websites',
  'Product catalogues', 'Digital storefronts', 'Portfolio websites',
  'Lead-capture forms and follow-up systems', 'Websites connected to automation',
];

export function WebDesignOutcomePage({ projects, requestHref }: { projects: ArchiveProject[]; requestHref: string }) {
  return <main className={styles.page}>
    <Link className={styles.back} href="/services">← All services</Link>

    <section className={styles.hero}>
      <span className="eyebrow">WEB DESIGN & DEVELOPMENT</span>
      <h1>Websites built around business outcomes.</h1>
      <p>I design and develop websites that help businesses build trust, generate leads, simplify bookings, explain their services and sell more effectively.</p>
      <div className={styles.actions}><a className="button black" href={requestHref}>Request this service <ArrowRight/></a><a className="button" href="#selected-work">View website projects</a></div>
    </section>

    <section className={styles.outcomeSection}>
      <div className={styles.sectionHead}><div><span className="eyebrow">START WITH THE GOAL</span><h2>What does your business need to do better?</h2></div><p>The right website depends on the outcome—not the trendiest technology.</p></div>
      <div className={styles.outcomeGrid}>{outcomes.map(([need, solution]) => <article key={need}><small>BUSINESS NEED</small><h3>{need}</h3><span>→</span><p>{solution}</p></article>)}</div>
    </section>

    <section className={styles.approach}>
      <div><span className="eyebrow">MY APPROACH</span><h2>I start with the outcome—not the framework.</h2></div>
      <div className={styles.steps}>{process.map(([number, title, body]) => <article key={number}><small>{number}</small><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
    </section>

    <section className={styles.buildSection}>
      <div className={styles.sectionHead}><div><span className="eyebrow">WHAT I CAN BUILD</span><h2>The right experience for the job.</h2></div><p>From a focused campaign page to a complete business website connected to the systems behind it.</p></div>
      <div className={styles.deliverables}>{deliverables.map((item, index) => <article key={item}><small>{String(index + 1).padStart(2, '0')}</small><h3>{item}</h3></article>)}</div>
    </section>

    <section className={styles.showroom} id="selected-work">
      <div className={styles.sectionHead}><div><span className="eyebrow">SELECTED WORK</span><h2>Relevant website proof.</h2></div><p>Selected projects showing responsive interfaces, clear presentation and product-focused web development.</p></div>
      {projects.length ? <div className="projectGrid">{projects.map((project) => <ProjectCard project={project} key={project.slug}/>)}</div> : <div className={styles.empty}><h3>Project proof is being prepared.</h3><p>Tell me the outcome you need and I’ll recommend the most suitable approach.</p></div>}
    </section>

    <section className={styles.cta}><div><span className="eyebrow light">HAVE A BUSINESS GOAL?</span><h2>Tell me the goal. I’ll tell you what I’d build.</h2><p>Share what your business should be doing better digitally, and we’ll define the right website or supporting system.</p></div><a href={requestHref}>Request Web Design & Development ↗</a></section>
  </main>;
}
