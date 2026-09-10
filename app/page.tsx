import { HomeClient } from '@/components/HomeClient';
import { getPublishedProjects } from '@/lib/cms/publicProjects';
import { getPublicSiteSettings } from '@/lib/cms/publicSettings';
import { getProfessionalContent } from '@/lib/cms/publicProfessional';

export const dynamic = 'force-dynamic';

export default async function HomePage(){
  const [projects, settings, professional] = await Promise.all([getPublishedProjects(), getPublicSiteSettings(), getProfessionalContent()]);
  return <HomeClient projects={projects.slice(0, 3)} settings={settings} professional={professional}/>;
}
