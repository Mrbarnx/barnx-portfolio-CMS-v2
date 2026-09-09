'use client';

import { useEffect, useState } from 'react';
import type {
  Capability,
  ExperienceEntry,
  ProfessionalContent,
  ProofLink,
  Service,
  SkillGroup,
} from '@/data/professional';
import { publishProfessionalContent, saveProfessionalDraft } from './actions';
import styles from './professional.module.css';

function move<T extends { sortOrder: number }>(items: T[], index: number, direction: -1 | 1): T[] {
  const destination = index + direction;
  if (destination < 0 || destination >= items.length) return items;
  const next = [...items];
  [next[index], next[destination]] = [next[destination], next[index]];
  return next.map((item, sortOrder) => ({ ...item, sortOrder }));
}

function remove<T extends { sortOrder: number }>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index).map((item, sortOrder) => ({ ...item, sortOrder }));
}

function Controls({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  return <div className={styles.controls}>
    <button type="button" disabled={index === 0} onClick={() => onMove(-1)}>Move up</button>
    <button type="button" disabled={index === count - 1} onClick={() => onMove(1)}>Move down</button>
    <button className={styles.remove} type="button" onClick={onRemove}>Remove</button>
  </div>;
}

function Published({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return <label className={styles.check}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /> Show when published</label>;
}

export function ProfessionalEditor({ initialContent }: { initialContent: ProfessionalContent }) {
  const [content, setContent] = useState(initialContent);
  const [dirty, setDirty] = useState(false);
  const update = (recipe: (current: ProfessionalContent) => ProfessionalContent) => {
    setContent(recipe);
    setDirty(true);
  };

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const confirmRemove = (label: string, action: () => void) => {
    if (window.confirm(`Remove ${label}? This is not permanent until you save.`)) action();
  };

  return <form className={styles.form}>
    <input type="hidden" name="content_json" value={JSON.stringify(content)} />

    <section className={styles.section}>
      <div className={styles.sectionHeading}><div><h2>Professional positioning</h2><p>The primary identity and supporting copy used across the public portfolio.</p></div></div>
      <div className={styles.stack}>
        <label>Professional title<input required value={content.profile.title} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, title: event.target.value } }))} /></label>
        <label>Positioning statement<textarea required rows={4} value={content.profile.positioningStatement} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, positioningStatement: event.target.value } }))} /></label>
        <label>Capabilities introduction<textarea required rows={3} value={content.profile.capabilitiesIntro} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, capabilitiesIntro: event.target.value } }))} /></label>
        <label>Experience introduction<textarea required rows={3} value={content.profile.experienceIntro} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, experienceIntro: event.target.value } }))} /></label>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeading}><div><h2>About progression</h2><p>Edit the homepage story without changing the existing presentation.</p></div><button type="button" onClick={() => update((current) => ({ ...current, profile: { ...current.profile, aboutStories: [...current.profile.aboutStories, { title: '', body: '' }] } }))}>Add story</button></div>
      <label>Section heading<input required value={content.profile.aboutHeading} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, aboutHeading: event.target.value } }))} /></label>
      <div className={styles.cards}>{content.profile.aboutStories.map((story, index) => <fieldset className={styles.card} key={index}>
        <legend>Story {index + 1}</legend>
        <Controls index={index} count={content.profile.aboutStories.length} onMove={(direction) => update((current) => ({ ...current, profile: { ...current.profile, aboutStories: move(current.profile.aboutStories.map((item, sortOrder) => ({ ...item, sortOrder })), index, direction).map(({ title, body }) => ({ title, body })) } }))} onRemove={() => confirmRemove(`story ${index + 1}`, () => update((current) => ({ ...current, profile: { ...current.profile, aboutStories: current.profile.aboutStories.filter((_, itemIndex) => itemIndex !== index) } })))} />
        <label>Title<input required value={story.title} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, aboutStories: current.profile.aboutStories.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) } }))} /></label>
        <label>Story<textarea required rows={3} value={story.body} onChange={(event) => update((current) => ({ ...current, profile: { ...current.profile, aboutStories: current.profile.aboutStories.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) } }))} /></label>
      </fieldset>)}</div>
    </section>

    <CollectionSection title="Capabilities" description="What you build and the engineering outcome behind it." addLabel="Add capability" onAdd={() => update((current) => ({ ...current, capabilities: [...current.capabilities, { label: '', title: '', summary: '', published: true, sortOrder: current.capabilities.length }] }))}>
      {content.capabilities.map((item, index) => <CapabilityCard key={index} item={item} index={index} count={content.capabilities.length} setItem={(next) => update((current) => ({ ...current, capabilities: current.capabilities.map((value, itemIndex) => itemIndex === index ? next : value) }))} moveItem={(direction) => update((current) => ({ ...current, capabilities: move(current.capabilities, index, direction) }))} removeItem={() => confirmRemove(item.title || `capability ${index + 1}`, () => update((current) => ({ ...current, capabilities: remove(current.capabilities, index) })))} />)}
    </CollectionSection>

    <CollectionSection title="Skill groups" description="Frontend remains a strong foundation within the wider software-engineering profile." addLabel="Add skill group" onAdd={() => update((current) => ({ ...current, skillGroups: [...current.skillGroups, { title: '', skills: [], published: true, sortOrder: current.skillGroups.length }] }))}>
      {content.skillGroups.map((item, index) => <SkillCard key={index} item={item} index={index} count={content.skillGroups.length} setItem={(next) => update((current) => ({ ...current, skillGroups: current.skillGroups.map((value, itemIndex) => itemIndex === index ? next : value) }))} moveItem={(direction) => update((current) => ({ ...current, skillGroups: move(current.skillGroups, index, direction) }))} removeItem={() => confirmRemove(item.title || `skill group ${index + 1}`, () => update((current) => ({ ...current, skillGroups: remove(current.skillGroups, index) })))} />)}
    </CollectionSection>

    <CollectionSection title="Four freelance offers" description="Keep exactly the four approved offers; edit or reorder them without creating extra services." addLabel={null}>
      {content.services.map((item, index) => <ServiceCard key={index} item={item} index={index} count={content.services.length} setItem={(next) => update((current) => ({ ...current, services: current.services.map((value, itemIndex) => itemIndex === index ? next : value) }))} moveItem={(direction) => update((current) => ({ ...current, services: move(current.services, index, direction) }))} />)}
    </CollectionSection>

    <CollectionSection title="Proof links" description="Connect capability claims to projects or evidence." addLabel="Add proof link" onAdd={() => update((current) => ({ ...current, proofLinks: [...current.proofLinks, { label: '', title: '', summary: '', href: '', published: true, sortOrder: current.proofLinks.length }] }))}>
      {content.proofLinks.map((item, index) => <ProofCard key={index} item={item} index={index} count={content.proofLinks.length} setItem={(next) => update((current) => ({ ...current, proofLinks: current.proofLinks.map((value, itemIndex) => itemIndex === index ? next : value) }))} moveItem={(direction) => update((current) => ({ ...current, proofLinks: move(current.proofLinks, index, direction) }))} removeItem={() => confirmRemove(item.title || `proof link ${index + 1}`, () => update((current) => ({ ...current, proofLinks: remove(current.proofLinks, index) })))} />)}
    </CollectionSection>

    <CollectionSection title="Experience" description="Keep real job titles unchanged. Add verified contributions, practices and evidence only." addLabel="Add experience" onAdd={() => update((current) => ({ ...current, experience: [...current.experience, { slug: '', date: '', role: '', company: '', lead: '', contributions: [], practices: [], evidence: '', boundary: '', published: true, sortOrder: current.experience.length }] }))}>
      {content.experience.map((item, index) => <ExperienceCard key={index} item={item} index={index} count={content.experience.length} setItem={(next) => update((current) => ({ ...current, experience: current.experience.map((value, itemIndex) => itemIndex === index ? next : value) }))} moveItem={(direction) => update((current) => ({ ...current, experience: move(current.experience, index, direction) }))} removeItem={() => confirmRemove(item.company || `experience ${index + 1}`, () => update((current) => ({ ...current, experience: remove(current.experience, index) })))} />)}
    </CollectionSection>

    <div className={styles.actions}>
      <span>{dirty ? 'Unsaved changes' : 'All changes on this screen are saved'}</span>
      <button className={styles.secondary} formAction={saveProfessionalDraft}>Save draft</button>
      <button className={styles.primary} formAction={publishProfessionalContent}>Publish</button>
    </div>
  </form>;
}

function CollectionSection({ title, description, addLabel, onAdd, children }: { title: string; description: string; addLabel: string | null; onAdd?: () => void; children: React.ReactNode }) {
  return <section className={styles.section}><div className={styles.sectionHeading}><div><h2>{title}</h2><p>{description}</p></div>{addLabel && onAdd ? <button type="button" onClick={onAdd}>{addLabel}</button> : null}</div><div className={styles.cards}>{children}</div></section>;
}

type CardProps<T> = { item: T; index: number; count: number; setItem: (item: T) => void; moveItem: (direction: -1 | 1) => void; removeItem?: () => void };

function CapabilityCard({ item, index, count, setItem, moveItem, removeItem }: CardProps<Capability>) {
  return <fieldset className={styles.card}><legend>Capability {index + 1}</legend><Controls index={index} count={count} onMove={moveItem} onRemove={removeItem!} /><div className={styles.fields}><label>Label<input required value={item.label} onChange={(event) => setItem({ ...item, label: event.target.value })} /></label><label>Title<input required value={item.title} onChange={(event) => setItem({ ...item, title: event.target.value })} /></label></div><label>Summary<textarea required rows={3} value={item.summary} onChange={(event) => setItem({ ...item, summary: event.target.value })} /></label><Published checked={item.published} onChange={(published) => setItem({ ...item, published })} /></fieldset>;
}

function SkillCard({ item, index, count, setItem, moveItem, removeItem }: CardProps<SkillGroup>) {
  return <fieldset className={styles.card}><legend>Skill group {index + 1}</legend><Controls index={index} count={count} onMove={moveItem} onRemove={removeItem!} /><label>Group title<input required value={item.title} onChange={(event) => setItem({ ...item, title: event.target.value })} /></label><label>Skills — one per line<textarea required rows={6} value={item.skills.join('\n')} onChange={(event) => setItem({ ...item, skills: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} /></label><Published checked={item.published} onChange={(published) => setItem({ ...item, published })} /></fieldset>;
}

function ServiceCard({ item, index, count, setItem, moveItem }: CardProps<Service>) {
  return <fieldset className={styles.card}><legend>Offer {index + 1}</legend><div className={styles.controls}><button type="button" disabled={index === 0} onClick={() => moveItem(-1)}>Move up</button><button type="button" disabled={index === count - 1} onClick={() => moveItem(1)}>Move down</button></div><div className={styles.fields}><label>Number<input required value={item.number} onChange={(event) => setItem({ ...item, number: event.target.value })} /></label><label>Offer title<input required value={item.title} onChange={(event) => setItem({ ...item, title: event.target.value })} /></label></div><label>Included work<textarea required rows={4} value={item.summary} onChange={(event) => setItem({ ...item, summary: event.target.value })} /></label><Published checked={item.published} onChange={(published) => setItem({ ...item, published })} /></fieldset>;
}

function ProofCard({ item, index, count, setItem, moveItem, removeItem }: CardProps<ProofLink>) {
  return <fieldset className={styles.card}><legend>Proof link {index + 1}</legend><Controls index={index} count={count} onMove={moveItem} onRemove={removeItem!} /><div className={styles.fields}><label>Label<input required value={item.label} onChange={(event) => setItem({ ...item, label: event.target.value })} /></label><label>Title<input required value={item.title} onChange={(event) => setItem({ ...item, title: event.target.value })} /></label></div><label>Summary<textarea required rows={3} value={item.summary} onChange={(event) => setItem({ ...item, summary: event.target.value })} /></label><label>Project path or URL<input required value={item.href} placeholder="/projects/example" onChange={(event) => setItem({ ...item, href: event.target.value })} /></label><Published checked={item.published} onChange={(published) => setItem({ ...item, published })} /></fieldset>;
}

function ExperienceCard({ item, index, count, setItem, moveItem, removeItem }: CardProps<ExperienceEntry>) {
  return <fieldset className={styles.card}><legend>Experience {index + 1}</legend><Controls index={index} count={count} onMove={moveItem} onRemove={removeItem!} /><div className={styles.fields}><label>Slug<input required value={item.slug} placeholder="company-name" onChange={(event) => setItem({ ...item, slug: event.target.value })} /></label><label>Date<input required value={item.date} onChange={(event) => setItem({ ...item, date: event.target.value })} /></label><label>Real job title<input required value={item.role} onChange={(event) => setItem({ ...item, role: event.target.value })} /></label><label>Company<input required value={item.company} onChange={(event) => setItem({ ...item, company: event.target.value })} /></label></div><label>Role summary<textarea required rows={3} value={item.lead} onChange={(event) => setItem({ ...item, lead: event.target.value })} /></label><div className={styles.fields}><label>Contributions — one per line<textarea required rows={6} value={item.contributions.join('\n')} onChange={(event) => setItem({ ...item, contributions: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} /></label><label>Engineering practices — one per line<textarea required rows={6} value={item.practices.join('\n')} onChange={(event) => setItem({ ...item, practices: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} /></label></div><label>Evidence statement<input required value={item.evidence} onChange={(event) => setItem({ ...item, evidence: event.target.value })} /></label><label>Public boundary note<input required value={item.boundary} onChange={(event) => setItem({ ...item, boundary: event.target.value })} /></label><Published checked={item.published} onChange={(published) => setItem({ ...item, published })} /></fieldset>;
}
