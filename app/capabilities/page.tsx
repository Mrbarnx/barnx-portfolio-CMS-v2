import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight,BriefcaseBusiness,Code2} from 'lucide-react';
import {getProfessionalContent} from '@/lib/cms/publicProfessional';
import styles from './capabilities.module.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Capabilities',description:'Choose between Barnabas Mikel’s client services and technical skills.'};
export default async function CapabilitiesPage(){const content=await getProfessionalContent();return <main className={styles.page}>
 <section className={styles.hero}><span className="eyebrow">CAPABILITIES</span><h1>What do you<br/>want to explore?</h1><p>{content.profile.capabilitiesIntro}</p></section>
 <section className={styles.choices} aria-label="Choose services or skills"><Link href="/services"><span className={styles.icon}><BriefcaseBusiness/></span><small>FOR BUSINESSES & FOUNDERS</small><h2>View Services</h2><p>Explore the products, websites, automation and software systems you can hire me to build.</p><b>Explore services <ArrowRight/></b></Link><Link href="/skills"><span className={styles.icon}><Code2/></span><small>FOR RECRUITERS & TEAMS</small><h2>View Skills</h2><p>See the technologies, engineering capabilities and practical experience behind the work.</p><b>Explore technical skills <ArrowRight/></b></Link></section>
 <section className={styles.proof}><div><span className="eyebrow light">LOOKING FOR PROOF?</span><h2>Follow the capability to the work.</h2><p>Projects show the problem, engineering decisions, implementation and result behind each claim.</p></div><Link href="/projects">View project archive <ArrowRight/></Link></section>
 </main>}
