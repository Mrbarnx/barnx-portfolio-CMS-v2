import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './case-study.module.css';

export const metadata: Metadata = {
  title: 'Barnx Portfolio CMS',
  description: 'A production Next.js and Supabase portfolio CMS with authenticated content management, media storage, publishing workflows, analytics and privacy controls.',
  alternates: { canonical: '/projects/barnx-portfolio-cms' },
  openGraph: {
    title: 'Barnx Portfolio CMS — Case Study',
    description: 'Architecture and implementation of a production portfolio CMS built with Next.js, Supabase and Vercel.',
    url: '/projects/barnx-portfolio-cms',
    type: 'article',
  },
};

const capabilities = [
  ['Content management', 'Projects, professional positioning, media, impact stories, resources, prompts, learning paths and public settings.'],
  ['Publishing workflow', 'Private drafts, explicit publishing, ordering controls and server-side validation before content reaches public pages.'],
  ['Media system', 'Protected Supabase Storage uploads, reusable assets, ordered galleries and reference-safe deletion.'],
  ['Analytics', 'First-party visitor, session and page-view reporting with throttling, duplicate suppression and retention controls.'],
  ['Resilient delivery', 'Published Supabase content is served when available, with verified file-backed fallbacks for public pages.'],
  ['Production operations', 'Preview-first pull requests, automated Vercel builds and a documented deployment, backup and rollback process.'],
];

const proof = [
  'Authenticated admin workspace',
  'PostgreSQL content models',
  'Row-Level Security policies',
  'Supabase Storage controls',
  'Draft and publish states',
  'Structured validation',
  'First-party analytics',
  'Responsive public and admin UI',
];

export default function BarnxPortfolioCmsCaseStudy() {
  return <main className={`page ${styles.page}`}>
    <Link className="back" href="/projects">← All projects</Link>

    <section className={styles.hero}>
      <span className="eyebrow">FULL-STACK CMS · PRODUCTION</span>
      <h1>Barnx Portfolio CMS</h1>
      <p>Built a production portfolio CMS using Next.js and Supabase, with authenticated content management, media storage, draft/publish workflows, first-party analytics, privacy controls and automated deployments.</p>
      <div className={styles.actions}>
        <a href="https://github.com/Mrbarnx/barnx-portfolio-CMS-v2" target="_blank" rel="noreferrer">View repository ↗</a>
        <a href="mailto:mrbarnx@gmail.com?subject=Barnx%20Portfolio%20CMS%20Walkthrough">Request private walkthrough ↗</a>
      </div>
    </section>

    <section className={styles.summary}>
      <article><span>ROLE</span><strong>Software Engineer</strong></article>
      <article><span>STACK</span><strong>Next.js · Supabase · PostgreSQL</strong></article>
      <article><span>DELIVERY</span><strong>GitHub · Vercel</strong></article>
      <article><span>STATUS</span><strong>Live production system</strong></article>
    </section>

    <section className={styles.problemSolution}>
      <div><span className="eyebrow">THE PROBLEM</span><h2>A professional portfolio becomes difficult to maintain when every update requires editing and redeploying code.</h2></div>
      <div><span className="eyebrow">THE SOLUTION</span><p>I evolved the portfolio into a protected publishing system. The public site and custom admin now work together across content, media, analytics and professional positioning while preserving safe public fallbacks.</p></div>
    </section>

    <section className={styles.architecture}>
      <span className="eyebrow">SYSTEM ARCHITECTURE</span>
      <h2>One controlled path from private editing to public delivery.</h2>
      <div className={styles.flow} aria-label="Barnx Portfolio CMS architecture">
        <article><small>01</small><strong>Admin CMS</strong><span>Authenticated editing</span></article>
        <i aria-hidden="true">→</i>
        <article><small>02</small><strong>Supabase</strong><span>Auth · Database · Storage</span></article>
        <i aria-hidden="true">→</i>
        <article><small>03</small><strong>Next.js</strong><span>Validated public loaders</span></article>
        <i aria-hidden="true">→</i>
        <article><small>04</small><strong>Vercel</strong><span>Portfolio delivery</span></article>
      </div>
      <p className={styles.fallback}>If Supabase is temporarily unavailable, selected public pages use verified file-backed content instead of exposing drafts or failing without useful content.</p>
    </section>

    <section className={styles.capabilities}>
      <span className="eyebrow">WHAT I ENGINEERED</span>
      <div className={styles.grid}>{capabilities.map(([title, body], index) => <article key={title}><small>{String(index + 1).padStart(2, '0')}</small><h2>{title}</h2><p>{body}</p></article>)}</div>
    </section>

    <section className={styles.proof}>
      <div><span className="eyebrow light">ENGINEERING PROOF</span><h2>The system demonstrates full-stack delivery beyond the public interface.</h2></div>
      <ul>{proof.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className={styles.security}>
      <div><span className="eyebrow">SECURITY FOUNDATIONS</span><h2>Public access and admin authority are kept separate.</h2></div>
      <div><p>Public queries are limited to published content. Drafts remain admin-only. Content mutations require authentication and server-side validation, while storage policies constrain uploads and protected routes use no-store behavior.</p><p>This is evidence of applied security foundations—not a claim that the project is a general-purpose security platform.</p></div>
    </section>

    <section className={styles.privateProof}>
      <span>PRIVATE ADMIN PROOF</span>
      <h2>Admin screenshots and a private walkthrough are shared directly.</h2>
      <p>The admin contains private operational controls, so access is not exposed publicly. Verified screenshots can be added here after sensitive data is removed.</p>
      <a href="mailto:mrbarnx@gmail.com?subject=Barnx%20Portfolio%20CMS%20Walkthrough">Request a walkthrough →</a>
    </section>

    <section className="nextCase"><p>Explore more work</p><Link href="/projects">View all projects →</Link></section>
  </main>;
}
