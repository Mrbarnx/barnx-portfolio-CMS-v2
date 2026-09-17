import type { Project } from '@/data/content';

export type ArchiveProject = Project & { href?: string };

export const permanentProjects: ArchiveProject[] = [
  { slug: 'barnx-portfolio-cms', title: 'Barnx Portfolio CMS', display: 'BARNX CMS', category: 'Full-Stack CMS', status: 'Production', short: 'Authenticated content management, media storage, publishing workflows, analytics, privacy controls and automated deployments.', overview: '', visualSubtitle: 'Portfolio content and publishing system', tone: 'black', problem: '', solution: '', role: 'Software Engineer', features: [], tech: ['Next.js', 'Supabase', 'PostgreSQL', 'Vercel'], challenges: '', lessons: '', github: 'https://github.com/Mrbarnx/barnx-portfolio-CMS-v2', projectType: 'public_build', caseStudyEnabled: true, href: '/projects/barnx-portfolio-cms' },
  { slug: 'open-link-hub', title: 'OpenLink Hub', display: 'OPENLINK', category: 'Full-Stack Product', status: 'Production', short: 'A self-hosted link-in-bio platform with public profiles, secure content management and deployment on Cloudflare Workers.', overview: '', visualSubtitle: 'Own your links and digital identity', tone: 'black', problem: '', solution: '', role: 'Full-Stack Engineer', features: [], tech: ['Next.js', 'TypeScript', 'Cloudflare Workers', 'Drizzle'], challenges: '', lessons: '', live: 'https://open-link-hub.usajames017.workers.dev', github: 'https://github.com/Mrbarnx/Open-Link-Hub', projectType: 'public_build', caseStudyEnabled: false },
  { slug: 'automation-systems', title: 'AI Automation & Software Systems', display: 'AUTOMATION', category: 'Software Systems', status: 'In development', short: 'Business systems and demos designed around lead response, support, CRM and repetitive operational work.', overview: '', visualSubtitle: 'Lead response · Support · CRM · Operations', tone: 'black', problem: '', solution: '', role: 'Software Engineer', features: [], tech: ['Automation', 'AI', 'APIs', 'Workflows'], challenges: '', lessons: '', projectType: 'public_build', caseStudyEnabled: true, href: '/barnx-studio/automation-systems' },
];

export function mergePermanentProjects(projects: Project[]): ArchiveProject[] {
  return [...permanentProjects, ...projects.filter((project) => !permanentProjects.some((item) => item.slug === project.slug))];
}
