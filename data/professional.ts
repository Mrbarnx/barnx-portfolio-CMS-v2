export type PublishedItem = { published: boolean; sortOrder: number };
export type AboutStory = { title: string; body: string };
export type ProfessionalProfile = {
  title: string;
  positioningStatement: string;
  aboutHeading: string;
  aboutStories: AboutStory[];
  capabilitiesIntro: string;
  experienceIntro: string;
};
export type Capability = PublishedItem & { label: string; title: string; summary: string };
export type SkillGroup = PublishedItem & { title: string; skills: string[] };
export type Service = PublishedItem & { number: string; title: string; summary: string };
export type ProofLink = PublishedItem & { label: string; title: string; summary: string; href: string };
export type ExperienceEntry = PublishedItem & {
  slug: string;
  date: string;
  role: string;
  company: string;
  lead: string;
  contributions: string[];
  practices: string[];
  evidence: string;
  boundary: string;
};
export type ProfessionalContent = {
  profile: ProfessionalProfile;
  capabilities: Capability[];
  skillGroups: SkillGroup[];
  services: Service[];
  proofLinks: ProofLink[];
  experience: ExperienceEntry[];
};

export const defaultProfessionalContent: ProfessionalContent = {
  profile: {
    title: 'Software Engineer | AI Engineering & Automation',
    positioningStatement: 'I build full-stack software, AI-powered applications, API integrations, internal business tools, and automated workflows that solve practical product and operational problems.',
    aboutHeading: 'Building one layer deeper with every project.',
    aboutStories: [
      { title: 'The beginning', body: 'I started with frontend engineering—learning how strong interfaces turn ideas into experiences people can actually use.' },
      { title: 'From screens to systems', body: 'I moved from isolated pages into reusable systems, complete product flows and production-ready applications.' },
      { title: 'Professional product delivery', body: 'At Imisi Health, I build responsive interfaces, reusable components, API-driven workflows and product improvements within an engineering team.' },
      { title: 'Software, AI and automation', body: 'I now combine a strong frontend foundation with backend systems, AI integrations and workflow automation to build more complete software.' },
    ],
    capabilitiesIntro: 'Software engineering combined with practical AI, automation and systems integration.',
    experienceIntro: 'A closer look at the responsibilities, contribution areas and engineering decisions behind each role.',
  },
  capabilities: [
    { published: true, sortOrder: 0, label: '01 · SOFTWARE ENGINEERING', title: 'Full-stack software systems', summary: 'Maintainable applications connecting product interfaces, backend services, databases, APIs and operational workflows.' },
    { published: true, sortOrder: 1, label: '02 · PRODUCT ENGINEERING', title: 'Useful digital products', summary: 'Responsive product experiences shaped around real user flows, clear state and dependable delivery.' },
    { published: true, sortOrder: 2, label: '03 · AI ENGINEERING', title: 'AI-powered applications', summary: 'Focused AI capabilities designed around clear workflows, observable behavior and appropriate human handoff.' },
    { published: true, sortOrder: 3, label: '04 · AUTOMATION', title: 'Workflow systems', summary: 'Lead, support and internal-operation workflows that reduce repetitive work and keep information moving.' },
  ],
  skillGroups: [
    { published: true, sortOrder: 0, title: 'Frontend foundation', skills: ['React', 'Vue 3', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'SCSS', 'Responsive UI', 'Accessibility'] },
    { published: true, sortOrder: 1, title: 'Backend & data', skills: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'Supabase', 'Prisma', 'Authentication', 'Storage'] },
    { published: true, sortOrder: 2, title: 'Delivery & operations', skills: ['Git', 'GitHub', 'Vercel', 'Docker', 'API integration', 'Component architecture', 'Testing workflows', 'DevOps foundations'] },
    { published: true, sortOrder: 3, title: 'AI & automation', skills: ['AI API integration', 'Prompt engineering', 'n8n', 'Webhooks', 'Workflow design', 'Human handoff patterns'] },
  ],
  services: [
    { published: true, sortOrder: 0, number: '01', title: 'Custom Business Software', summary: 'Dashboards, internal tools, admin systems, customer and employee portals, SaaS applications and workflow-management systems.' },
    { published: true, sortOrder: 1, number: '02', title: 'Business Workflow Automation', summary: 'Lead processing, follow-ups, notifications, reporting, approvals, data entry and repetitive operational workflows.' },
    { published: true, sortOrder: 2, number: '03', title: 'AI-Powered Applications and Workflows', summary: 'AI assistants, customer-support systems, lead qualification, document processing, knowledge assistants and AI-powered operational workflows.' },
    { published: true, sortOrder: 3, number: '04', title: 'API and Systems Integration', summary: 'Websites, databases, CRMs, payments, communication platforms, AI services, automation platforms and internal software connected into dependable systems.' },
  ],
  proofLinks: [
    { published: true, sortOrder: 0, label: 'SOFTWARE SYSTEMS', title: 'Subly', summary: 'Commerce, product discovery, authentication and dashboard workflows.', href: '/projects/subly' },
    { published: true, sortOrder: 1, label: 'FULL-STACK + AI', title: 'Omni-Channel AI Chatbot', summary: 'Backend, shared lead context, AI conversations and handoff logic.', href: '/projects/omni-channel-ai-chatbot' },
    { published: true, sortOrder: 2, label: 'AUTOMATION', title: 'BANX Automation Studio', summary: 'Product-led presentation of intelligent workflow systems.', href: '/projects/banx-automation-studio' },
    { published: true, sortOrder: 3, label: 'VUE APPLICATION', title: 'FinanceFlow', summary: 'State-driven finance dashboard with filtering and persistence.', href: '/projects/financeflow' },
  ],
  experience: [
    { published: true, sortOrder: 0, slug: 'imisi-health', date: 'APR 2026 — PRESENT', role: 'Frontend Engineer', company: 'Imisi Health', lead: 'Building dependable product interfaces and API-driven workflows for digital healthcare products in a professional engineering team.', contributions: ['Built responsive interfaces across healthcare product flows', 'Created and improved reusable frontend components', 'Integrated application interfaces with backend APIs', 'Contributed code-quality and product-experience improvements'], practices: ['Responsive UI engineering', 'Component architecture', 'API-driven state', 'Team-based product delivery'], evidence: '42 healthcare screens represented in the portfolio summary', boundary: 'Company work presented without exposing private product information' },
    { published: true, sortOrder: 1, slug: 'synlo', date: 'NOV 2025 — FEB 2026', role: 'Lead Frontend Developer & UI/UX Designer', company: 'Synlo', lead: 'Led frontend implementation and interface design for a SocialFi product spanning discovery, matchmaking and AI-assisted interactions.', contributions: ['Translated product ideas into structured interface flows', 'Designed and implemented responsive application screens', 'Maintained consistency across a multi-screen product experience', 'Connected product thinking, UI design and frontend delivery'], practices: ['Frontend leadership', 'UI/UX design', 'Design-to-code execution', 'Responsive product systems'], evidence: '21 SocialFi screens designed and coded', boundary: 'Role scope and verified output stated without fabricated performance metrics' },
    { published: true, sortOrder: 2, slug: 'vin-startup-project', date: 'NOV 2024 — JAN 2025', role: 'Full-Stack Engineer', company: 'VIN Startup Project', lead: 'Built multimodal AI interfaces and the supporting application layer for an early-stage product initiative.', contributions: ['Developed interfaces for multimodal AI interactions', 'Built Node.js and Express REST API workflows', 'Connected frontend behavior to server-side services', 'Worked with serverless product architecture'], practices: ['Full-stack development', 'REST API design', 'AI interface integration', 'Serverless workflows'], evidence: 'Technical scope documented through portfolio experience', boundary: 'No unverified adoption or business-impact claims' },
  ],
};
