import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import styles from '../profile-pages.module.css';

export const metadata:Metadata={title:'Capabilities',description:'Barnabas Mikel’s software engineering, AI, automation and systems-integration capabilities with supporting project evidence.'};

const builds=[
  ['01 · SOFTWARE ENGINEERING','Full-stack software systems','Maintainable applications connecting product interfaces, backend services, databases, APIs and operational workflows.'],
  ['02 · PRODUCT ENGINEERING','Useful digital products','Responsive product experiences shaped around real user flows, clear state and dependable delivery.'],
  ['03 · AI INTEGRATION','Useful AI features','Focused AI capabilities designed around a clear workflow, observable behavior and appropriate human handoff.'],
  ['04 · AUTOMATION','Workflow systems','Lead, support and internal-operation workflows that reduce repetitive work and keep information moving.'],
];
const skills=[
  ['Frontend',['React','Vue 3','Next.js','TypeScript','JavaScript','Tailwind CSS','SCSS','Responsive UI','Accessibility']],
  ['Backend & data',['Node.js','Express','REST APIs','PostgreSQL','Supabase','Prisma','Authentication','Storage']],
  ['Product delivery',['Git','GitHub','Vercel','Docker fundamentals','API integration','Component architecture','Testing workflows']],
  ['AI & automation',['AI API integration','Prompt engineering','n8n','Webhooks','Workflow design','Human handoff patterns']],
];
const services=[
  ['01','Custom business software','Build dashboards, portals, admin systems, internal tools and SaaS applications around real operational needs.'],
  ['02','Business workflow automation','Automate lead processing, follow-ups, notifications, approvals, reporting and repetitive administrative work.'],
  ['03','AI-powered applications & workflows','Add focused AI assistants, qualification, support and document-processing capabilities where they create practical value.'],
  ['04','API & systems integration','Connect websites, databases, payments, communication platforms, AI services and business tools into dependable workflows.'],
];
const proof=[
  ['FRONTEND SYSTEMS','Subly','Commerce, product discovery and dashboard interfaces.','/projects/subly'],
  ['FULL-STACK + AI','Omni-Channel AI Chatbot','Shared lead context, AI-assisted conversations and handoff logic.','/projects/omni-channel-ai-chatbot'],
  ['AUTOMATION','BANX Automation Studio','Product-led presentation of intelligent workflow systems.','/projects/banx-automation-studio'],
  ['VUE APPLICATION','FinanceFlow','State-driven finance dashboard with filtering and persistence.','/projects/financeflow'],
  ['PRODUCTION CMS','This portfolio','Supabase-backed projects, Studio content, media, analytics and publishing controls.','/impact'],
];

export default function CapabilitiesPage(){return <main className={styles.page}>
  <section className={styles.hero}><span className="eyebrow">CAPABILITIES / SKILLS & SERVICES</span><h1>What I know.<br/>What I can build.</h1><p>A practical view of my engineering capabilities, the services I can provide and the work that supports each claim.</p><div className={styles.heroActions}><Link className="button black" href="/projects">See project proof <ArrowRight/></Link><a className="button" href="mailto:mrbarnx@gmail.com?subject=Project%20Enquiry">Discuss a project <ArrowRight/></a></div><div className={styles.proofStrip}><div><strong>5+</strong><span>Public project case studies</span></div><div><strong>42</strong><span>Healthcare screens built</span></div><div><strong>21</strong><span>SocialFi screens delivered</span></div><div><strong>3+</strong><span>Years building products</span></div></div></section>
  <section className={styles.section}><div className={styles.sectionHead}><div><span className="eyebrow">WHAT I BUILD</span><h2>Capability shaped around outcomes.</h2></div><p>The technology matters, but only when it helps create a product that is clear, maintainable and useful.</p></div><div className={styles.buildGrid}>{builds.map(item=><article className={styles.buildCard} key={item[0]}><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></section>
  <section className={styles.section}><div className={styles.sectionHead}><div><span className="eyebrow">TECHNICAL SKILLS</span><h2>Tools I can explain and apply.</h2></div><p>No percentage bars or inflated ratings. These are technologies and practices connected to work I have built or am actively developing deeper.</p></div>{skills.map(group=><div className={styles.skillGroup} key={group[0] as string}><h3>{group[0]}</h3><div className={styles.chips}>{(group[1] as string[]).map(skill=><span key={skill}>{skill}</span>)}</div></div>)}</section>
  <section className={styles.section}><div className={styles.sectionHead}><div><span className="eyebrow">SERVICES</span><h2>Ways I can contribute.</h2></div><p>Suitable for teams needing software engineering, practical AI capabilities, integrations or operational systems that can grow beyond a demo.</p></div><div className={styles.serviceGrid}>{services.map(item=><article className={styles.serviceCard} key={item[0]}><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></section>
  <section className={styles.section}><div className={styles.sectionHead}><div><span className="eyebrow">PROOF MAP</span><h2>Follow each claim to the work.</h2></div><p>Projects provide the deeper context: problem, decisions, implementation, challenges and lessons.</p></div><div className={styles.proofGrid}>{proof.map(item=><Link className={styles.proofCard} href={item[3]} key={item[1]}><small>{item[0]}</small><div><h3>{item[1]}</h3><p>{item[2]}</p></div><b>View evidence →</b></Link>)}</div></section>
  <section className={styles.darkCta}><div><span className="eyebrow light">HAVE A PRODUCT OR BOTTLENECK?</span><h2>Let’s identify the simplest useful system.</h2><p>Tell me what you are building or where repetitive work is slowing the team down.</p></div><a href="mailto:mrbarnx@gmail.com?subject=Capabilities%20Enquiry">Start a conversation ↗</a></section>
</main>}
