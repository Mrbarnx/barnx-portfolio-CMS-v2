import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, ExternalLink } from 'lucide-react';
import { getPublicSiteSettings } from '@/lib/cms/publicSettings';
import styles from './resume.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'View or download the current résumé of Barnabas Mikel, Software Engineer.',
  alternates: { canonical: '/resume' },
  openGraph: { title: 'Barnabas Mikel — Résumé', description: 'Software engineering, full-stack development, AI integration and automation experience.', url: '/resume' },
};

export default async function ResumePage() {
  const settings = await getPublicSiteSettings();
  return <main className={styles.page}>
    <section className={styles.hero}>
      <div><span className="eyebrow">RÉSUMÉ / BARNABAS MIKEL</span><h1>Experience, skills<br/>and selected work.</h1><p>Software Engineer working across full-stack applications, AI-powered systems, API integrations and practical business automation.</p></div>
      <div className={styles.actions}><a className="button black" href="/resume/download"><Download/> Download résumé</a><a className="button" href={settings.resumeUrl} target="_blank" rel="noreferrer"><ExternalLink/> Open PDF</a><Link className="button" href="/projects">View portfolio</Link></div>
    </section>
    <section className={styles.viewer} aria-label="Résumé preview">
      <iframe src={`${settings.resumeUrl}#view=FitH&toolbar=1`} title="Barnabas Mikel résumé preview"/>
      <div className={styles.fallback}><p>If the résumé preview does not appear on your device, open or download the PDF directly.</p><a href={settings.resumeUrl} target="_blank" rel="noreferrer">Open PDF ↗</a></div>
    </section>
  </main>;
}
