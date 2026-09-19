import Link from 'next/link';
import { PromptLibraryBrowser } from '@/components/PromptLibraryBrowser';
import { getPublishedPromptCategories, getPublishedPrompts } from '@/lib/cms/publicStudio';
import styles from './prompts.module.css';

export const metadata={title:'AI Prompt Library | Barnx Studio'};

export const dynamic = 'force-dynamic';

export default async function PromptLibraryPage(){const [categories,promptLibrary]=await Promise.all([getPublishedPromptCategories(),getPublishedPrompts()]);return <main className="page resourceDetail">
  <Link className="back" href="/barnx-studio">← Barnx Studio</Link>
  <section className={`resourceHero ${styles.hero}`}>
    <div className="resourceIcon huge">✦</div>
    <span className="eyebrow">AI PROMPT LIBRARY · FREE</span>
    <h1>Prompts that help you build with AI more deliberately.</h1>
    <p>Practical prompts and engineering frameworks for developers and vibe coders. Pick a prompt, understand what it does, copy it, and use the short guide to get better results.</p>
  </section>
  <section className={`studioLibrary ${styles.library}`}>
    <div className="sectionHead"><div><span className="eyebrow">PROMPTS</span><h2>Choose what you need.</h2><p className={styles.intro}>Each prompt includes a clear purpose, the full prompt, a copy action, a downloadable Markdown file and a brief usage guide.</p></div></div>
    <PromptLibraryBrowser categories={categories} prompts={promptLibrary}/>
  </section>
  <section className="nextCase"><p>More resources coming as the library grows.</p><Link href="/barnx-studio">Browse Barnx Studio →</Link></section>
</main>}
