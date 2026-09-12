import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import './layout-repair.css';
import './motion-system.css';
import { SiteShell } from '@/components/SiteShell';
import { TechMarqueeEnhancer } from '@/components/TechMarqueeEnhancer';
import { site } from '@/data/site';
import { FirstPartyAnalytics } from '@/components/FirstPartyAnalytics';
import { getPublicSiteSettings } from '@/lib/cms/publicSettings';
import { getProfessionalContent } from '@/lib/cms/publicProfessional';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    metadataBase: new URL(site.url), title: { default: settings.seoTitle, template: '%s | Barnx' },
    description: settings.seoDescription, applicationName: site.name,
    authors: [{ name: site.person, url: site.url }], creator: site.person, publisher: site.name,
    alternates: { canonical: '/' }, icons: { icon: '/favicon.svg' },
    openGraph: { title: settings.seoTitle, description: settings.seoDescription, url: '/', siteName: site.name, locale: 'en_US', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Barnx — Barnabas Mikel' }] },
    twitter: { card: 'summary_large_image', title: settings.seoTitle, description: settings.seoDescription, creator: '@MRBARNX', images: ['/opengraph-image'] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  };
}

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  const [settings, professional] = await Promise.all([getPublicSiteSettings(), getProfessionalContent()]);
  const personSchema = { '@context': 'https://schema.org', '@type': 'Person', name: site.person, url: site.url, email: `mailto:${settings.email}`, jobTitle: professional.profile.title, description: professional.profile.positioningStatement, sameAs: [settings.github, settings.linkedin, settings.x], knowsAbout: ['Software Engineering', 'Full-Stack Development', 'React', 'Vue.js', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AI Engineering', 'API Integration', 'Business Automation'] };
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <SiteShell settings={settings}>{children}</SiteShell>
        <TechMarqueeEnhancer/>
        <FirstPartyAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
