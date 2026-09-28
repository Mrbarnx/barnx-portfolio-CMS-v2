import type { Metadata } from 'next';
import { getServiceShowroom } from '@/data/service-showrooms';
import { getPublicSiteSettings } from '@/lib/cms/publicSettings';
import { QuoteForm } from './QuoteForm';
import styles from './quote.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Request a Quote', description: 'Tell Barnx about your business, project scope and desired outcome.' };

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ service?: string; solution?: string; project?: string }> }) {
  const [{ service, solution, project }, settings] = await Promise.all([searchParams, getPublicSiteSettings()]);
  const selected = getServiceShowroom(service ?? '');
  const context = [
    project ? 'I viewed the ' + project + ' case study.' : '',
    solution ? 'I am interested in a similar solution: ' + solution + '.' : '',
    'I would like to discuss how this could be adapted to my business.',
  ].filter(Boolean).join('\\n\\n');

  return <main className={styles.page}>
    <section className={styles.hero}><span className="eyebrow">START YOUR PROJECT</span><h1>Request a Quote.</h1><p>Tell me about your business and what you want to improve. I’ll review the request and respond with the clearest next step.</p></section>
    <QuoteForm email={settings.email} initialService={selected?.slug ?? ''} initialDetails={context}/>
    <p className={styles.note}>Your details are used only to understand and respond to this project request.</p>
  </main>;
}
