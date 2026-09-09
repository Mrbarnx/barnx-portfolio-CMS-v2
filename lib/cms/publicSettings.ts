import 'server-only';

import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { site, type PublicSiteSettings } from '@/data/site';
import { getSupabaseConfig, hasSupabaseConfig } from '@/lib/supabase/config';

export const defaultSiteSettings: PublicSiteSettings = {
  headline: 'Software Engineer building full-stack applications, AI-powered systems, API integrations and business automation.',
  availability: 'Available for new opportunities',
  email: site.email,
  github: site.github,
  linkedin: site.linkedin,
  x: site.x,
  tiktok: 'https://tiktok.com/@mrbarnx',
  location: 'Remote · Nigeria',
  resumeUrl: '/Barnabas-Mikel-Resume.pdf',
  seoTitle: site.title,
  seoDescription: site.description,
};

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  if (!hasSupabaseConfig()) return defaultSiteSettings;
  try {
    const { url, anonKey } = getSupabaseConfig();
    const client = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data, error } = await client.from('site_settings').select('value').eq('key', 'site.profile').eq('is_public', true).maybeSingle();
    if (error || !data?.value || typeof data.value !== 'object') return defaultSiteSettings;
    const settings = { ...defaultSiteSettings, ...(data.value as Partial<PublicSiteSettings>) };
    if (settings.headline === 'Frontend-Focused Full-Stack Engineer building modern web applications while integrating AI-powered features and intelligent automations.') settings.headline = defaultSiteSettings.headline;
    if (/Frontend-Focused Full-Stack Engineer/i.test(settings.seoDescription)) settings.seoDescription = defaultSiteSettings.seoDescription;
    return settings;
  } catch {
    return defaultSiteSettings;
  }
});
