import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectMediaViewer } from '@/components/ProjectMediaViewer';
import { getPublishedProject } from '@/lib/cms/publicProjects';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const project=await getPublishedProject(slug);
  if(!project)return {title:'Project'};
  return {title:project.title,description:project.short,alternates:{canonical:`/projects/${project.slug}`},openGraph:{title:`${project.title} — Barnx`,description:project.short,url:`/projects/${project.slug}`,type:'article'},twitter:{card:'summary_large_image',title:`${project.title} — Barnx`,description:project.short}};
}

export default async function ProjectDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=await getPublishedProject(slug);
  if(!p||p.caseStudyEnabled===false)notFound();
  const images=p.galleryImages?.length?p.galleryImages:p.coverImage?[p.coverImage]:[];
  return <main className="page caseStudy">
    <Link className="back" href="/projects">← All projects</Link>
    <section className="caseHero">
      <span className="eyebrow">{p.category} · {p.openSource?'Public Build':'Case Study'}</span>
      <h1>{p.title}</h1><p>{p.overview}</p>
      <div className="caseLinks">
        {p.interactivePreview&&p.live?<a href="#interactive-preview">Try the experience ↓</a>:null}
        <Link href={`/projects/${p.slug}/demo`}>View demo story →</Link>
        {p.impactSlug?<Link href={`/impact/${p.impactSlug}`}>Read Impact story →</Link>:null}
        {p.github?<a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>:null}
      </div>
      {p.openSource
        ? <p className="caseDisclosure">Open-source public build · The working product and source repository are publicly available.</p>
        : <p className="caseDisclosure">Independent case study · Designed and built by Barnx · No client or measured outcome is implied.</p>}
    </section>

    {p.interactivePreview&&p.live?<section className="caseInteractive" id="interactive-preview"><div className="caseInteractiveHead"><div><span className="eyebrow">INTERACTIVE EXPERIENCE</span><h2>Use the product without leaving the case study.</h2></div><p>Complete the core customer journey directly inside this page.</p></div><div className="caseInteractiveFrame"><iframe src={p.live} title={`${p.title} interactive experience`} sandbox="allow-forms allow-scripts allow-same-origin" referrerPolicy="no-referrer"/></div></section>:<ProjectMediaViewer images={images} video={p.video} projectTitle={p.title} fallbackTitle={p.display} fallbackSubtitle={p.visualSubtitle} tone={p.tone}/>}

    <section className="caseColumns"><div><span className="eyebrow">BUSINESS PROBLEM</span><h2>{p.problem}</h2></div><div><span className="eyebrow">DESIRED OUTCOME</span><p>{p.solution}</p></div></section>
    <section className="caseSection"><span className="eyebrow">THE SYSTEM</span><div className="featureGrid">{p.features.map((f,index)=><article key={f}><span>{String(index+1).padStart(2,'0')}</span><p>{f}</p></article>)}</div></section>
    <section className="caseColumns"><div><span className="eyebrow">PRODUCT DECISION</span><h2>{p.challenges}</h2></div><div><span className="eyebrow">WHAT THE BUILD DEMONSTRATES</span><p>{p.lessons}</p></div></section>
    <section className="caseColumns"><div><span className="eyebrow">MY ROLE</span><h2>{p.role}</h2></div><div><span className="eyebrow">TECHNICAL APPROACH</span><div className="tags large">{p.tech.map(t=><b key={t}>{t}</b>)}</div></div></section>
    <section className="caseDemoCta"><div><span className="eyebrow light">SHAREABLE DEMO STORY</span><h2>See the problem, product and business value in one short presentation.</h2></div><Link href={`/projects/${p.slug}/demo`}>Open demo story →</Link></section>
    <section className="nextCase"><p>Explore more work</p><Link href="/projects">View all projects →</Link></section>
  </main>;
}
