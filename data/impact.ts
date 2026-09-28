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
  projectSlug?: string;
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
  projectSlug: 'greenlane-logistics-proof',
  slug: 'greenlane-structured-delivery-requests',
  title: 'From open-ended delivery messages to structured requests',
  summary: 'A logistics website concept showing how a guided quote flow can collect the details a delivery business needs before follow-up.',
  businessContext: 'Logistics businesses that receive enquiries through Instagram or WhatsApp may need to collect the same delivery details repeatedly before they can review a request.',
  originalRequest: 'Create a small, polished independent case study that proves how web design and development can solve a recognisable logistics enquiry problem without attempting to build a full dispatch platform.',
  discoveredProblem: 'An open chat starts with little structure. Pickup, destination, timing, package and customer details can arrive across several messages, making the handoff harder to review.',
  recommendation: 'Replace the first round of explanation with a guided request flow while keeping human follow-up for pricing and delivery confirmation.',
  solution: 'Greenlane combines a service website with a four-step delivery request, review screen, confirmation reference and structured business request view.',
  systemFlow: ['Customer understands the service', 'Customer submits delivery details', 'Information becomes one structured request', 'Business reviews the request', 'Human follow-up continues'],
  decisions: ['Keep quoting human-led instead of inventing instant pricing', 'Ask only for information needed to review the request', 'Show a review step before submission', 'Use an explicit confirmation instead of pretending to contact a real business', 'Include a structured business view to prove the handoff'],
  capabilityEnabled: 'Business website, service request flow and structured lead capture',
  outcome: 'The working concept completes the demonstrated customer-to-business flow. It proves the interaction and information structure; it does not claim measured conversion, revenue or time-saving results.',
  outcomeEvidence: 'enabled',
  workType: 'independent_case_study',
  visibility: 'public',
  status: 'completed',
  technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
  evidence: [{ type: 'live', label: 'Open the working Greenlane demo', href: 'https://greenlane-logistics-proof.usajames017.chatgpt.site', approvedForPublic: true }],
  lessons: ['Showing the business-side handoff makes the value clearer than stopping at a success message.', 'The proof is stronger when it avoids unverified metrics and demonstrates only what has actually been built.'],
  nextImprovements: ['Connect submissions to a real CRM or notification workflow when a business requires it.', 'Test the form with logistics operators and customers before making usability or performance claims.'],
  published: true,
},{
  slug: 'openlink-own-your-digital-identity',
  projectSlug: 'open-link-hub',
  title: 'Giving creators ownership of their link-in-bio presence',
  summary: 'An open-source, self-hostable link hub that combines a public profile with secure content management and portable deployment.',
  businessContext: 'Creators and professionals often depend on hosted link-in-bio platforms to organise their public destinations. Those services can limit control over branding, hosting and future product changes.',
  originalRequest: 'Build a credible open-source alternative that demonstrates the complete public-profile and management workflow without copying a commercial platform feature for feature.',
  discoveredProblem: 'A simple list of links is easy to publish, but ownership also requires a safe way to manage content, a dependable public profile and deployment architecture the owner can control.',
  recommendation: 'Create a focused self-hostable product with public profiles, authenticated management and portable deployment rather than expanding into analytics, payments or social-network features.',
  solution: 'OpenLink Hub provides a public link page, secure administration, image uploads and a Cloudflare-based deployment path in one open-source application.',
  systemFlow: ['Owner signs in', 'Owner manages profile and links', 'Media and content are stored', 'Public profile renders the current content', 'Visitors open the relevant destination'],
  decisions: ['Keep the public experience fast and focused', 'Separate public reading from authenticated content management', 'Make the repository public so the implementation can be inspected and self-hosted', 'Use portable infrastructure instead of tying the product to a closed website builder'],
  capabilityEnabled: 'An inspectable, self-hostable public identity page with controlled content management',
  outcome: 'The deployed application and public repository verify the public-profile, management and deployment architecture. They do not establish adoption, revenue or conversion improvements.',
  outcomeEvidence: 'enabled',
  workType: 'public_build',
  visibility: 'public',
  status: 'completed',
  technologies: ['Next.js', 'TypeScript', 'Cloudflare Workers', 'Drizzle'],
  evidence: [
    {type:'live',label:'Use the deployed OpenLink Hub',href:'https://open-link-hub.usajames017.workers.dev',approvedForPublic:true},
    {type:'repository',label:'Inspect the open-source repository',href:'https://github.com/Mrbarnx/Open-Link-Hub',approvedForPublic:true},
  ],
  lessons: ['Open source is stronger proof when the deployed product and implementation can both be inspected.', 'A narrow ownership promise creates a clearer product than adding unrelated creator-tool features.'],
  nextImprovements: ['Add documented deployment templates for more hosting providers.', 'Validate onboarding and management usability with independent users before making usability claims.'],
  published: true,
},{
  slug: 'neatflow-request-to-follow-up',
  projectSlug: 'neatflow-cleaning-automation',
  title: 'Turning one service request into visible follow-up steps',
  summary: 'A cleaning-service website and workflow proof showing how submitted information can move into acknowledgement and internal follow-up without manual re-entry.',
  businessContext: 'Service businesses may receive booking details through calls or messages, then copy the same information into replies, notes and task lists before work can be scheduled.',
  originalRequest: 'Create the minimum website and workflow needed to demonstrate a request moving into the next operational steps, without pretending that external business systems are connected.',
  discoveredProblem: 'A form alone only improves collection. The operational value appears when the validated information becomes a usable record, a customer acknowledgement and a visible follow-up responsibility.',
  recommendation: 'Keep the customer request focused, make every downstream step observable and state clearly which integrations remain simulated.',
  solution: 'NeatFlow combines a cleaning-service website, structured request form and four-stage workflow view: validation, record creation, acknowledgement preparation and follow-up task assignment.',
  systemFlow: ['Customer submits service details', 'Request is validated', 'Structured record is created', 'Acknowledgement is prepared', 'Follow-up task becomes visible'],
  decisions: ['Demonstrate the workflow after submission instead of stopping at a success message', 'Use only details required for review and scheduling', 'Show each state transition visibly', 'Do not claim email, WhatsApp or CRM execution that is not connected', 'Keep pricing and staff assignment human-led'],
  capabilityEnabled: 'Website intake connected to an observable request-to-follow-up workflow',
  outcome: 'The deployed proof executes the four demonstrated browser-side stages and makes the business handoff visible. It does not establish external automation, customer adoption or measured time savings.',
  outcomeEvidence: 'enabled',
  workType: 'independent_case_study',
  visibility: 'public',
  status: 'completed',
  technologies: ['HTML', 'CSS', 'JavaScript', 'Workflow Design'],
  evidence: [{type:'live',label:'Run the NeatFlow request workflow',href:'https://neatflow-cleaning-automation.usajames017.chatgpt.site',approvedForPublic:true}],
  lessons: ['A visible state transition is stronger workflow evidence than a form confirmation alone.', 'Integration boundaries should be presented as clearly as completed functionality.'],
  nextImprovements: ['Connect an agreed CRM, email or task provider in a test environment.', 'Add server-side validation, retry handling, audit logs and exception states before production use.'],
  published: true,
}];

export const publicImpactStories = impactStories.filter((story) => story.published);

export const impactWorkTypeLabels: Record<ImpactWorkType, string> = {
  client_work: 'Client Work',
  company_work: 'Company Work',
  independent_case_study: 'Independent Case Study',
  open_source: 'Public Build',
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
] as const;

export type ImpactFilter = typeof impactFilters[number]['value'];

export function filterImpactStories(stories: ImpactStory[], filter: ImpactFilter) {
  if(filter==='all')return stories;
  if(filter==='public_build')return stories.filter((story)=>['public_build','open_source','free_community_tool'].includes(story.workType));
  return stories.filter((story) => story.workType === filter);
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
