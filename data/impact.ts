export type ImpactEvidenceType =
  | 'live'
  | 'repository'
  | 'image'
  | 'video'
  | 'diagram'
  | 'pull_request'
  | 'report'
  | 'testimonial'
  | 'analytics'
  | 'document';

export type ImpactWorkType =
  | 'client_work'
  | 'company_work'
  | 'independent_case_study'
  | 'open_source'
  | 'public_build'
  | 'free_community_tool';

export type ImpactVisibility = 'confidential' | 'client_approved' | 'public';
export type ImpactEvidenceLevel = 'measured' | 'client_reported' | 'enabled' | 'proposed';
export type ImpactStatus = 'draft' | 'in_development' | 'completed' | 'archived';

export type ImpactStory = {
  slug: string;
  title: string;
  summary: string;
  businessContext: string;
  originalRequest: string;
  discoveredProblem: string;
  recommendation: string;
  solution: string;
  systemFlow?: string[];
  decisions?: string[];
  capabilityEnabled: string;
  outcome?: string;
  outcomeEvidence: ImpactEvidenceLevel;
  workType: ImpactWorkType;
  visibility: ImpactVisibility;
  status: ImpactStatus;
  technologies: string[];
  evidence: Array<{
    type: ImpactEvidenceType;
    label: string;
    href?: string;
    asset?: string;
    alt?: string;
    approvedForPublic: boolean;
  }>;
  lessons?: string[];
  nextImprovements?: string[];
  published: boolean;
};

// Add a story only when the facts and public evidence are ready.
// The public listing and detail route intentionally ignore unpublished entries.
export const impactStories: ImpactStory[] = [];

export const publicImpactStories = impactStories.filter((story) => story.published);

export const impactWorkTypeLabels: Record<ImpactWorkType, string> = {
  client_work: 'Client Work',
  company_work: 'Company Work',
  independent_case_study: 'Independent Case Study',
  open_source: 'Open Source',
  public_build: 'Public Build',
  free_community_tool: 'Free Community Tool',
};

export const impactVisibilityLabels: Record<ImpactVisibility, string> = {
  confidential: 'Confidential',
  client_approved: 'Client-approved',
  public: 'Public',
};

// Keep legacy work-type values readable until their stories are reviewed in the
// CMS. Do not silently relabel an independent study as a working public build.
export const impactFilters = [
  { label: 'All', value: 'all' },
  { label: 'Client Work', value: 'client_work' },
  { label: 'Company Work', value: 'company_work' },
  { label: 'Public Builds', value: 'public_build' },
  { label: 'Open Source', value: 'open_source' },
] as const;

export type ImpactFilter = typeof impactFilters[number]['value'];

export function filterImpactStories(stories: ImpactStory[], filter: ImpactFilter) {
  return filter === 'all' ? stories : stories.filter((story) => story.workType === filter);
}

export function publicEvidenceUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

export function getPublicImpactEvidence(story: Pick<ImpactStory, 'evidence'>) {
  return story.evidence.filter((item) => item.approvedForPublic).map((item) => ({
    ...item,
    href: publicEvidenceUrl(item.href),
    asset: publicEvidenceUrl(item.asset),
  })).filter((item) => item.href || item.asset);
}

export const impactEvidenceLabels: Record<ImpactEvidenceLevel, string> = {
  measured: 'Measured result',
  client_reported: 'Client-reported result',
  enabled: 'Capability demonstrated',
  proposed: 'Proposed benefit, not a measured result',
};
