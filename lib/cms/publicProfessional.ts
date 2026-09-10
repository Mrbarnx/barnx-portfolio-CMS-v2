import 'server-only';

import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { defaultProfessionalContent, type ProfessionalContent } from '@/data/professional';
import { normalizeProfessionalContent } from '@/lib/cms/professionalSchema';
import { getSupabaseConfig, hasSupabaseConfig } from '@/lib/supabase/config';

export const PROFESSIONAL_DRAFT_KEY = 'professional.draft';
export const PROFESSIONAL_PUBLISHED_KEY = 'professional.published';

export const getProfessionalContent = cache(async (): Promise<ProfessionalContent> => {
  if (!hasSupabaseConfig()) return defaultProfessionalContent;
  try {
    const { url, anonKey } = getSupabaseConfig();
    const client = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data, error } = await client
      .from('site_settings')
      .select('value')
      .eq('key', PROFESSIONAL_PUBLISHED_KEY)
      .eq('is_public', true)
      .maybeSingle();
    if (error || !data) return defaultProfessionalContent;
    return normalizeProfessionalContent(data.value);
  } catch {
    return defaultProfessionalContent;
  }
});

export const publishedByOrder = <T extends { published: boolean; sortOrder: number }>(items: T[]) =>
  items.filter((item) => item.published).sort((a, b) => a.sortOrder - b.sortOrder);
