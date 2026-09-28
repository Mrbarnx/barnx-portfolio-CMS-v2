import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublishedProject } from '@/lib/cms/publicProjects';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=await getPublishedProject(slug);if(!p)return{title:'Demo story'};return{title:`${p.title} — Demo Story`,description:`See the business problem, working product and intended value behind ${p.title}.`,alternates:{canonical:`/projects/${p.slug}/demo`},openGraph:{title:`${p.title} — Demo Story`,description:p.short,url:`/projects/${p.slug}/demo`,type:'article'}}}

export default async function DemoStory({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const p=await getPublishedProject(slug);if(!p||p.caseStudyEnabled===false)notFound();
  return <main className="marketingDemoPage">
    <nav><Link href={`/projects/${p.slug}`}>← Full case study</Link><span>BARNX · DEMO STORY</span></nav>
    <section className="demoStoryHero"><span className="eyebrow">{p.category}</span><h1>{p.title}</h1><p>{p.short}</p>{p.video?.url?<a className="button black" href={p.video.url} target="_blank" rel="noreferrer">Watch the marketing video ▶</a>:<a className="button black" href="#story">View the story ↓</a>}</section>
    <section className="demoStorySequence" id="story">
      <article><span>01 · PROBLEM</span><h2>{p.problem}</h2></article>
      <article><span>02 · SOLUTION</span><h2>{p.solution}</h2></article>
      <article><span>03 · WORKING PROOF</span><h2>{p.features.slice(0,3).join(' · ')}</h2></article>
      <article><span>04 · BUSINESS VALUE</span><h2>{p.lessons}</h2></article>
    </section>
    {p.interactivePreview&&p.live?<section className="demoStoryProduct"><header><span className="eyebrow">TRY THE EXPERIENCE</span><h2>The product is the proof.</h2></header><iframe src={p.live} title={`${p.title} interactive experience`} sandbox="allow-forms allow-scripts allow-same-origin" referrerPolicy="no-referrer"/></section>:null}
    <section className="demoStoryCta"><span className="eyebrow light">A SIMILAR PROCESS IN YOUR BUSINESS?</span><h2>Let’s turn the friction into a focused system.</h2><Link href="/quote">Request a solution →</Link></section>
  </main>;
}
