import { saveImpactStory } from '../content-actions';
import { impactFilters, impactWorkTypeLabels, type ImpactWorkType } from '@/data/impact';
import styles from '../content.module.css';

type Row = Record<string, unknown>;
const narrativeFields = [
  ['summary', 'Summary', 3],
  ['business_context', 'Context: business or user environment', 4],
  ['discovered_problem', 'Problem: observed or possible friction', 4],
  ['original_request', 'Original request / independently defined concept brief', 4],
  ['recommendation', 'Investigation and recommendation: observations, assumptions and scope', 5],
  ['solution', 'Solution: what the system actually does', 5],
  ['capability_enabled', 'Capability: what is demonstrated (not an untested benefit)', 3],
] as const;
const listFields = [
  ['system_flow', 'System / workflow'],
  ['decisions', 'Product decisions: why, trade-offs and what was not built'],
  ['technologies', 'Technical approach: architecture, APIs and tools'],
  ['lessons', 'Lessons and testing observations'],
  ['next_improvements', 'Limitations and next improvements'],
] as const;

export function ImpactForm({ row = {} }: { row?: Row }) {
  const workType = String(row.work_type ?? 'public_build');
  const canonicalTypes = impactFilters.filter((item) => item.value !== 'all');
  const isLegacy = !canonicalTypes.some((item) => item.value === workType);
  return <form className={styles.form} action={saveImpactStory}>
    <input type="hidden" name="id" value={String(row.id ?? '')} />
    <section className={styles.section}>
      <h2>Curated story, not another project listing</h2>
      <p>Choose only work with a meaningful problem, decision and evidence story. Aim for one or two strong examples per service category, not every project.</p>
      <p>Public Builds are independent work. Describe possible business friction honestly; do not invent a client, testimonial or measured result.</p>
      <div className={styles.fields}>
        <label>Title<input required name="title" defaultValue={String(row.title ?? '')} /></label>
        <label>Slug<input required name="slug" defaultValue={String(row.slug ?? '')} /></label>
        <label>Work type<select name="work_type" defaultValue={workType}>
          {canonicalTypes.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
          {isLegacy ? <option value={workType}>{impactWorkTypeLabels[workType as ImpactWorkType] || workType} (legacy: review classification)</option> : null}
        </select></label>
        <label>Visibility<select name="visibility" defaultValue={String(row.visibility ?? 'confidential')}><option>confidential</option><option>client_approved</option><option>public</option></select></label>
        <label>Status<select name="status" defaultValue={String(row.status ?? 'draft')}><option>draft</option><option>in_development</option><option>completed</option><option>archived</option></select></label>
        <label>Evidence level<select name="outcome_evidence" defaultValue={String(row.outcome_evidence ?? 'proposed')}>
          <option value="proposed">Proposed benefit, not measured</option><option value="enabled">Capability demonstrated</option><option value="client_reported">Client-reported result</option><option value="measured">Measured result</option>
        </select></label>
        <label>Sort order<input name="sort_order" type="number" min="0" defaultValue={String(row.sort_order ?? 0)} /></label>
        <label className={styles.check}><input type="checkbox" name="featured" defaultChecked={Boolean(row.featured)} />Featured</label>
      </div>
    </section>
    <section className={styles.section}>
      <h2>Problem → thinking → solution → evidence</h2>
      <div className={styles.stack}>
        {narrativeFields.map(([name, label, rows]) => <label key={name}>{label}<textarea required name={name} rows={rows} defaultValue={String(row[name] ?? '')} /></label>)}
        <label>Outcome / what this could improve (optional)<textarea name="outcome" rows={4} defaultValue={String(row.outcome ?? '')} /></label>
      </div>
      <p>Separate the desired outcome from what testing demonstrated. Use “designed to” for unmeasured benefits. Attach approved evidence after saving the draft.</p>
    </section>
    <section className={styles.section}>
      <h2>Structured detail</h2>
      <div className={styles.fields}>
        {listFields.map(([name, label]) => <label key={name}>{label} · one item per line<textarea name={name} rows={6} defaultValue={Array.isArray(row[name]) ? (row[name] as string[]).join('\n') : ''} /></label>)}
      </div>
    </section>
    <div className={styles.formActions}><button className={styles.secondary} name="intent" value="draft">Save draft</button><button className={styles.button} name="intent" value="publish">Save & publish</button></div>
  </form>;
}
