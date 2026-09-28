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
export const impactStories: ImpactStory[] = [{
  slug: 'greenlane-structured-delivery-requests',
  title: 'From open-ended delivery messages to structured requests',
  summary: 'A logistics website concept showing how a guided quote flow can collect the details a delivery business needs before follow-up.',
  businessContext: 'Logistics businesses that receive enquiries through Instagram or WhatsApp may need to collect the same delivery details repeatedly before they can review a request.',
  originalRequest: 'Create a small, polished public build that proves how web design and development can solve a recognisable logistics enquiry problem without attempting to build a full dispatch platform.',
  discoveredProblem: 'An open chat starts with little structure. Pickup, destination, timing, package and customer details can arrive across several messages, making the handoff harder to review.',
  recommendation: 'Replace the first round of explanation with a guided request flow while keeping human follow-up for pricing and delivery confirmation.',
  solution: 'Greenlane combines a service website with a four-step delivery request, review screen, confirmation reference and simulated business request view.',
  systemFlow: ['Customer understands the service', 'Customer submits delivery details', 'Information becomes one structured request', 'Business reviews the request', 'Human follow-up continues'],
  decisions: ['Keep quoting human-led instead of inventing instant pricing', 'Ask only for information needed to review the request', 'Show a review step before submission', 'Use an explicit demo confirmation instead of pretending to contact a real business', 'Include a simulated business view to prove the handoff'],
  capabilityEnabled: 'Business website, service request flow and structured lead capture',
  outcome: 'The working concept completes the demonstrated customer-to-business flow. It proves the interaction and information structure; it does not claim measured conversion, revenue or time-saving results.',
  outcomeEvidence: 'enabled',
  workType: 'public_build',
  visibility: 'public',
  status: 'completed',
  technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
  evidence: [{ type: 'live', label: 'Open the working Greenlane demo', href: 'https://greenlane-logistics-proof.usajames017.chatgpt.site', approvedForPublic: true }],
  lessons: ['Showing the business-side handoff makes the value clearer than stopping at a success message.', 'The proof is stronger when it avoids unverified metrics and demonstrates only what has actually been built.'],
  nextImprovements: ['Connect submissions to a real CRM or notification workflow when a business requires it.', 'Test the form with logistics operators and customers before making usability or performance claims.'],
  published: true,
}];

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
