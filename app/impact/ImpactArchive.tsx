'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  impactVisibilityLabels,
  impactWorkTypeLabels,
  impactFilters,
  filterImpactStories,
  getPublicImpactEvidence,
  type ImpactStory,
  type ImpactFilter,
} from '@/data/impact';
import styles from './impact.module.css';

export function ImpactArchive({ initialStories }: { initialStories: ImpactStory[] }) {
  const [filter, setFilter] = useState<ImpactFilter>('all');
  const stories = useMemo(
    () => filterImpactStories(initialStories, filter),
    [filter, initialStories],
  );

  return (
    <>
      <div className={styles.filters} aria-label="Filter impact stories">
        {impactFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={filter === item.value ? styles.activeFilter : ''}
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {stories.length ? (
        <div className={styles.storyGrid}>
          {stories.map((story) => (
            <article className={styles.storyCard} key={story.slug}>
              <div className={styles.storyMeta}>
                <span>{impactWorkTypeLabels[story.workType]}</span>
                <span>{impactVisibilityLabels[story.visibility]}</span>
                <span>{story.status.replace('_', ' ')}</span>
              </div>
              <p className={styles.context}>{story.businessContext}</p>
              <h2>{story.title}</h2>
              <div className={styles.problemBlock}>
                <span>Problem investigated</span>
                <p>{story.discoveredProblem}</p>
              </div>
              <div className={styles.evidenceLine}>
                <span>Evidence</span>
                <strong>{getPublicImpactEvidence(story).length} public item(s)</strong>
              </div>
              <Link href={`/impact/${story.slug}`}>
                Read impact story <ArrowRight aria-hidden="true" />
              </Link>
              {story.projectSlug ? <Link href={`/projects/${story.projectSlug}`}>View related project <ArrowRight aria-hidden="true" /></Link> : null}
            </article>
          ))}
        </div>
      ) : (
        <section className={styles.emptyState} aria-live="polite">
          <span>{filter === 'all' ? 'SELECTED IMPACT STORIES' : 'NO STORIES IN THIS FILTER'}</span>
          <h2>From problem to evidence.</h2>
          <p>
            {filter === 'all'
              ? 'A curated selection of work, with the context, decisions, system and evidence behind each solution. Explore the complete work library in Projects while these deeper stories are prepared.'
              : 'No published story matches this work type yet. Choose All to see the current selection, or explore the complete work library in Projects.'}
          </p>
          <Link href="/projects">
            Explore current projects <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      )}
    </>
  );
}
