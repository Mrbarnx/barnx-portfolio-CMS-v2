import Link from 'next/link';
import { defaultProfessionalContent } from '@/data/professional';
import { requireCmsAdmin } from '@/lib/admin/requireCmsAdmin';
import { normalizeProfessionalContent } from '@/lib/cms/professionalSchema';
import { PROFESSIONAL_DRAFT_KEY, PROFESSIONAL_PUBLISHED_KEY } from '@/lib/cms/publicProfessional';
import { ProfessionalEditor } from './ProfessionalEditor';
import styles from '../content.module.css';

export const dynamic = 'force-dynamic';

export default async function ProfessionalAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { supabase } = await requireCmsAdmin();
  const { data, error: readError } = await supabase
    .from('site_settings')
    .select('key,value,updated_at')
    .in('key', [PROFESSIONAL_DRAFT_KEY, PROFESSIONAL_PUBLISHED_KEY]);
  const draft = data?.find((row) => row.key === PROFESSIONAL_DRAFT_KEY);
  const published = data?.find((row) => row.key === PROFESSIONAL_PUBLISHED_KEY);
  const initialContent = normalizeProfessionalContent(draft?.value ?? published?.value ?? defaultProfessionalContent);
  const query = await searchParams;

  return <main className={styles.page}><div className={styles.wrap}>
    <Link className={styles.back} href="/admin">← Admin home</Link>
    <header className={styles.header}><div><p className={styles.eyebrow}>Professional content</p><h1>Positioning & proof</h1><p>Manage the professional identity, capabilities, four offers, proof and experience shown across the portfolio.</p></div></header>
    {query.saved === 'draft' ? <p className={styles.notice}>Draft saved privately. The public portfolio was not changed.</p> : null}
    {query.saved === 'published' ? <p className={styles.notice}>Professional content published and public pages refreshed.</p> : null}
    {query.error || readError ? <p className={styles.error}>Nothing was changed. Check every required field and try again.</p> : null}
    <p className={styles.guard}>Drafts are admin-only. Publish updates the public copy. Never enter passwords, private client information or secrets.</p>
    <ProfessionalEditor initialContent={initialContent} />
  </div></main>;
}
