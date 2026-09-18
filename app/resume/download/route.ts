import { getPublicSiteSettings } from '@/lib/cms/publicSettings';
import { site } from '@/data/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { resumeUrl } = await getPublicSiteSettings();
  try {
    const source = new URL(resumeUrl, site.url);
    if (!['http:', 'https:'].includes(source.protocol)) throw new Error('Unsupported résumé URL');
    const pdf = await fetch(source, { cache: 'no-store' });
    if (!pdf.ok || !pdf.body) return new Response('Résumé unavailable', { status: 502 });
    return new Response(pdf.body, { headers: { 'Content-Type': pdf.headers.get('content-type') || 'application/pdf', 'Content-Disposition': 'attachment; filename="Barnabas-Mikel-Resume.pdf"', 'Cache-Control': 'private, no-store' } });
  } catch {
    return new Response('Résumé unavailable', { status: 502 });
  }
}
