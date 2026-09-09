import { z } from 'zod';
import { defaultProfessionalContent, type ProfessionalContent } from '@/data/professional';

const shortText = z.string().trim().min(2).max(120);
const paragraph = z.string().trim().min(10).max(700);
const publishedItem = z.object({ published: z.boolean(), sortOrder: z.number().int().min(0).max(1000) });
const internalOrExternalUrl = z.string().trim().max(500).refine(
  (value) => value.startsWith('/') || z.string().url().safeParse(value).success,
  'Use a site path beginning with / or a complete URL.',
);

export const professionalContentSchema = z.object({
  profile: z.object({
    title: shortText,
    positioningStatement: paragraph,
    aboutHeading: shortText,
    aboutStories: z.array(z.object({ title: shortText, body: paragraph })).min(1).max(8),
    capabilitiesIntro: paragraph,
    experienceIntro: paragraph,
  }),
  capabilities: z.array(publishedItem.extend({ label: shortText, title: shortText, summary: paragraph })).min(1).max(12),
  skillGroups: z.array(publishedItem.extend({ title: shortText, skills: z.array(shortText).min(1).max(30) })).min(1).max(12),
  services: z.array(publishedItem.extend({ number: shortText, title: shortText, summary: paragraph })).length(4),
  proofLinks: z.array(publishedItem.extend({ label: shortText, title: shortText, summary: paragraph, href: internalOrExternalUrl })).max(20),
  experience: z.array(publishedItem.extend({
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
    date: shortText,
    role: shortText,
    company: shortText,
    lead: paragraph,
    contributions: z.array(shortText).min(1).max(20),
    practices: z.array(shortText).min(1).max(20),
    evidence: shortText,
    boundary: shortText,
  })).min(1).max(20),
}).superRefine((content, context) => {
  const slugs = new Set<string>();
  content.experience.forEach((entry, index) => {
    if (slugs.has(entry.slug)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['experience', index, 'slug'], message: 'Experience slugs must be unique.' });
    slugs.add(entry.slug);
  });
});

export function normalizeProfessionalContent(value: unknown): ProfessionalContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultProfessionalContent;
  const partial = value as Partial<ProfessionalContent>;
  const candidate = {
    profile: { ...defaultProfessionalContent.profile, ...(partial.profile ?? {}) },
    capabilities: partial.capabilities ?? defaultProfessionalContent.capabilities,
    skillGroups: partial.skillGroups ?? defaultProfessionalContent.skillGroups,
    services: partial.services ?? defaultProfessionalContent.services,
    proofLinks: partial.proofLinks ?? defaultProfessionalContent.proofLinks,
    experience: partial.experience ?? defaultProfessionalContent.experience,
  };
  const parsed = professionalContentSchema.safeParse(candidate);
  return parsed.success ? parsed.data : defaultProfessionalContent;
}

export function parseProfessionalContent(value: string): ProfessionalContent {
  return professionalContentSchema.parse(JSON.parse(value) as unknown);
}
