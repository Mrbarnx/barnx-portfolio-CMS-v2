import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { impactVisibilityLabels, impactWorkTypeLabels, impactEvidenceLabels, getPublicImpactEvidence } from '@/data/impact';
import { getPublishedImpactStory } from '@/lib/cms/publicImpact';
import { quoteHref } from '@/lib/quote';
import styles from '../impact.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getPublishedImpactStory(slug);
  return story ? { title: story.title, description: story.summary, alternates: { canonical: `/impact/${story.slug}` } } : { title: 'Impact story' };
}

export default async function ImpactStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getPublishedImpactStory(slug);
  if (!story) notFound();
  const publicEvidence = getPublicImpactEvidence(story);
  const isConcept = ['public_build', 'independent_case_study', 'free_community_tool'].includes(story.workType);

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/impact">← All impact stories</Link>
      <section className={styles.detailHero}>
        <div className={styles.storyMeta}>
          <span>{impactWorkTypeLabels[story.workType]}</span>
          <span>{impactVisibilityLabels[story.visibility]}</span>
          <span>{story.status.replaceAll('_', ' ')}</span>
        </div>
        <h1>{story.title}</h1>
        <p>{story.summary}</p>
        {isConcept ? <p className={styles.disclosure}>Independently created work, not a client commission. Demonstrated functionality is separate from measured business impact.</p> : null}
      </section>

      <section className={styles.detailGrid} aria-label="Context and problem">
        <article><span>01 · CONTEXT</span><h2>The business environment</h2><p>{story.businessContext}</p></article>
        <article><span>02 · PROBLEM</span><h2>The friction investigated</h2><p>{story.discoveredProblem}</p></article>
        <article><span>03 · BRIEF</span><h2>{isConcept ? 'The concept brief' : 'The original request'}</h2><p>{story.originalRequest}</p></article>
        <article><span>04 · THINKING</span><h2>Reasoning and recommendation</h2><p>{story.recommendation}</p></article>
      </section>

      <section className={styles.detailGrid} aria-label="Solution">
        <article><span>05 · SOLUTION</span><h2>The system</h2><p>{story.solution}</p></article>
        <article><span>06 · CAPABILITY</span><h2>What this makes possible</h2><p>{story.capabilityEnabled}</p></article>
      </section>

      {story.systemFlow?.length ? <section className={styles.detailSection}><h2>System / workflow</h2><ol className={styles.workflow}>{story.systemFlow.map((item, index) => <li key={`${index}-${item}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol></section> : null}
      {story.decisions?.length ? <section className={styles.detailSection}><h2>Product decisions</h2><ul>{story.decisions.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section> : null}

      <section className={styles.detailSection}>
        <h2>Working proof</h2>
        {publicEvidence.length ? <div className={styles.evidenceGrid}>
          {publicEvidence.map((item, index) => <article className={styles.evidenceCard} key={`${index}-${item.label}`}>
            {item.asset ? <img src={item.asset} alt={item.alt || item.label} loading="lazy" /> : null}
            <span>{item.type.replaceAll('_', ' ')}</span>
            <a href={item.href || item.asset} target="_blank" rel="noreferrer">{item.label} ↗</a>
          </article>)}
        </div> : <p>No publicly accessible evidence is attached to this story yet.</p>}
      </section>

      <section className={styles.detailSection}>
        <span>EVIDENCE LEVEL</span>
        <h2>{impactEvidenceLabels[story.outcomeEvidence]}</h2>
        <p>{story.outcome || 'No additional outcome claim has been documented.'}</p>
        {story.outcomeEvidence === 'proposed' || story.outcomeEvidence === 'enabled' ? <p>Revenue, conversion improvements and time savings have not been established by this evidence level.</p> : null}
      </section>

      {story.technologies.length ? <section className={styles.detailSection}><h2>Technical approach</h2><p>{story.technologies.join(' · ')}</p></section> : null}
      {story.lessons?.length ? <section className={styles.detailSection}><h2>What I learned</h2><ul>{story.lessons.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section> : null}
      {story.nextImprovements?.length ? <section className={styles.detailSection}><h2>What I would improve next</h2><ul>{story.nextImprovements.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section> : null}

      <section className={styles.cta}>
        <h2>Does your business handle a similar process manually?</h2>
        <p>Tell me how it works today and what should become easier. We can define the right next step.</p>
        <Link className="button black" href={quoteHref()}>Request a solution →</Link>
        {story.projectSlug ? <Link href={`/projects/${story.projectSlug}`}>View the related project →</Link> : null}
        <Link href="/projects">Explore the complete work library →</Link>
      </section>
    </main>
  );
}
