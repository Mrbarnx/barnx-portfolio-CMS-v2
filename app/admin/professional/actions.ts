'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireCmsAdmin } from '@/lib/admin/requireCmsAdmin';
import { parseProfessionalContent } from '@/lib/cms/professionalSchema';
import { PROFESSIONAL_DRAFT_KEY, PROFESSIONAL_PUBLISHED_KEY } from '@/lib/cms/publicProfessional';

function readContent(data: FormData) {
  const raw = data.get('content_json');
  if (typeof raw !== 'string') redirect('/admin/professional?error=validation');
  try {
    return parseProfessionalContent(raw);
  } catch {
    redirect('/admin/professional?error=validation');
  }
}

export async function saveProfessionalDraft(data: FormData) {
  const content = readContent(data);
  const { supabase, user } = await requireCmsAdmin();
  const { error } = await supabase.from('site_settings').upsert({
    key: PROFESSIONAL_DRAFT_KEY,
    value: content,
    description: 'Admin-only draft of professional positioning, capabilities, offers and experience.',
    is_public: false,
    updated_by: user.id,
  });
  if (error) redirect('/admin/professional?error=draft-save');
  revalidatePath('/admin/professional');
  redirect('/admin/professional?saved=draft');
}

export async function publishProfessionalContent(data: FormData) {
  const content = readContent(data);
  const { supabase, user } = await requireCmsAdmin();
  const { error } = await supabase.from('site_settings').upsert([
    {
      key: PROFESSIONAL_DRAFT_KEY,
      value: content,
      description: 'Admin-only draft of professional positioning, capabilities, offers and experience.',
      is_public: false,
      updated_by: user.id,
    },
    {
      key: PROFESSIONAL_PUBLISHED_KEY,
      value: content,
      description: 'Published professional positioning, capabilities, offers and experience.',
      is_public: true,
      updated_by: user.id,
    },
  ]);
  if (error) redirect('/admin/professional?error=publish');
  revalidatePath('/');
  revalidatePath('/capabilities');
  revalidatePath('/experience');
  revalidatePath('/admin/professional');
  redirect('/admin/professional?saved=published');
}
