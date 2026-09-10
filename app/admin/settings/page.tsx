import Link from 'next/link';
import { requireCmsAdmin } from '@/lib/admin/requireCmsAdmin';
import { defaultSiteSettings } from '@/lib/cms/publicSettings';
import { saveSiteSettings } from '../content-actions';
import styles from '../content.module.css';

export const dynamic = 'force-dynamic';

export default async function SettingsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { supabase } = await requireCmsAdmin();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'site.profile').maybeSingle();
  const value = { ...defaultSiteSettings, ...((data?.value && typeof data.value === 'object') ? data.value : {}) };
  const query = await searchParams;
  return <main className={styles.page}><div className={styles.wrap}>
    <Link className={styles.back} href="/admin">← Admin home</Link>
    <header className={styles.header}><div><p className={styles.eyebrow}>Site settings</p><h1>Public settings</h1><p>Manage availability, contact links and SEO defaults. Professional positioning is managed separately.</p></div></header>
    {query.saved === 'true' ? <p className={styles.notice}>Public settings saved and relevant pages refreshed.</p> : null}
    {query.saved === 'failed' || query.error ? <p className={styles.error}>Settings were not saved. Check every URL and required field.</p> : null}
    <p className={styles.guard}>Never place API keys, passwords or private tokens here. This record is intentionally public. <Link href="/admin/professional">Edit professional positioning →</Link></p>
    <form className={styles.form} action={saveSiteSettings}>
      <input type="hidden" name="headline" value={value.headline} />
      <section className={styles.section}><h2>Availability & résumé</h2><div className={styles.stack}>
        <label>Availability label<input name="availability" required defaultValue={value.availability} /></label>
        <label>Location<input name="location" required defaultValue={value.location} /></label>
        <label>Résumé path<input name="resumeUrl" required defaultValue={value.resumeUrl} /></label>
      </div></section>
      <section className={styles.section}><h2>Contact & social links</h2><div className={styles.fields}>
        <label>Email<input name="email" type="email" required defaultValue={value.email} /></label>
        <label>GitHub URL<input name="github" type="url" required defaultValue={value.github} /></label>
        <label>LinkedIn URL<input name="linkedin" type="url" required defaultValue={value.linkedin} /></label>
        <label>X URL<input name="x" type="url" required defaultValue={value.x} /></label>
        <label>TikTok URL<input name="tiktok" type="url" required defaultValue={value.tiktok} /></label>
      </div></section>
      <section className={styles.section}><h2>SEO defaults</h2><div className={styles.stack}>
        <label>Default title<input name="seoTitle" required defaultValue={value.seoTitle} /></label>
        <label>Default description<textarea name="seoDescription" required rows={4} defaultValue={value.seoDescription} /></label>
      </div></section>
      <div className={styles.formActions}><button className={styles.button}>Save settings</button></div>
    </form>
  </div></main>;
}
