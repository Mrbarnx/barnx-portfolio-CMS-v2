const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { Script } = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Test the actual TypeScript modules without adding a test-runner dependency.
function load(path, mocks = {}) {
  const filename = resolve(__dirname, '..', path);
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  new Script(`(function(require,module,exports){${source}\n})`, { filename }).runInThisContext()(
    (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name), module, module.exports,
  );
  return module.exports;
}

async function main() {
  const impact = load('data/impact.ts');
  assert.deepEqual(impact.impactFilters.map((x) => x.label), ['All', 'Client Work', 'Company Work', 'Public Builds']);
  const records = [{ workType: 'public_build' }, { workType: 'open_source' }, { workType: 'client_work' }, { workType: 'independent_case_study' }];
  assert.equal(impact.filterImpactStories(records, 'all').length, 4, 'Legacy stories remain visible in All');
  assert.deepEqual(impact.filterImpactStories(records, 'public_build'), [records[0], records[1]], 'Open-source work is grouped under Public Builds');
  const { impactLines } = load('lib/cms/impactText.ts');
  assert.deepEqual(impactLines('Keep route, weight and date together.\r\n\n No payments. '), ['Keep route, weight and date together.', 'No payments.']);
  assert.deepEqual(impactLines(null), []);
  assert.equal(load('data/web-capabilities.ts').webCapabilities.length, 8);
  const permanent = load('data/permanent-projects.ts').permanentProjects;
  const exclusiveTypes = new Set(['public_build', 'client_work', 'private_project', 'template']);
  assert.ok(permanent.every((project) => exclusiveTypes.has(project.projectType)), 'Every permanent project has one exclusive classification');
  assert.ok(permanent.filter((project) => project.projectType === 'public_build').every((project) => project.github), 'Every Public Build exposes source code');
  assert.ok(['greenlane-logistics-proof','dispatch-now-lagos','carepath-clinic-booking','formhaus-furniture-catalogue','northstar-digital-storefront','adaeze-okoro-architect-portfolio','havenly-property-lead-flow','neatflow-cleaning-automation'].every((slug) => permanent.find((project) => project.slug === slug)?.projectType === 'private_project'), 'Independent web proofs remain Case Studies');
  const evidence = [
    { label: 'Live demo', type: 'live', href: 'https://example.com/demo', approvedForPublic: true },
    { label: 'Screenshot', type: 'image', asset: 'https://example.com/proof.png', alt: 'A structured enquiry', approvedForPublic: true },
    { label: 'Private demo', type: 'video', href: 'https://example.com/private', approvedForPublic: false },
    { label: 'Missing asset', type: 'image', approvedForPublic: true },
    { label: 'Unsafe', type: 'live', href: 'javascript:alert(1)', approvedForPublic: true },
    { label: 'Embedded credentials', type: 'live', href: 'https://user:secret@example.com/', approvedForPublic: true },
  ];
  assert.equal(impact.getPublicImpactEvidence({ evidence }).length, 2);
  assert.equal(impact.publicEvidenceUrl('//example.com/'), undefined);
  assert.equal(impact.publicEvidenceUrl('data:text/html,test'), undefined);
  const queries = [];
  const tables = {
    impact_stories: [{ id: 'story-1', slug: 'media-test', published: true, visibility: 'public', status: 'completed' }],
    impact_evidence: [
      { impact_story_id: 'story-1', evidence_type: 'image', label: 'Public image', media_id: 'public-image', approved_for_public: true },
      { impact_story_id: 'story-1', evidence_type: 'image', label: 'Private image', media_id: 'private-image', approved_for_public: true },
      { impact_story_id: 'story-1', evidence_type: 'image', label: 'Unapproved image', media_id: 'public-image', approved_for_public: false },
    ],
    media_assets: [
      { id: 'public-image', storage_path: 'proof/public.png', alt_text: 'Public proof', mime_type: 'image/png', is_public: true },
      { id: 'private-image', storage_path: 'private/hidden.png', alt_text: 'Hidden', mime_type: 'image/png', is_public: false },
    ],
  };
  const db = { from(table) {
    let rows = [...tables[table]];
    const query = {
      select(fields) { queries.push([table, 'select', fields]); return query; },
      eq(key, value) { queries.push([table, key, value]); rows = rows.filter((row) => row[key] === value); return query; },
      neq(key, value) { rows = rows.filter((row) => row[key] !== value); return query; },
      in(key, values) { rows = rows.filter((row) => values.includes(row[key])); return query; },
      order() { return query; },
      then(resolve) { return Promise.resolve({ data: rows, error: null }).then(resolve); },
    };
    return query;
  } };
  const loader = load('lib/cms/publicImpact.ts', {
    'server-only': {}, react: { cache: (fn) => fn },
    '@supabase/supabase-js': { createClient: () => db },
    '@/data/impact': impact,
    '@/lib/supabase/config': { hasSupabaseConfig: () => true, getSupabaseConfig: () => ({ url: 'https://example.com', anonKey: 'test' }) },
    '@/lib/admin/media': { mediaPublicUrl: (url, path) => `${url}/${path}` },
  });
  const loaded = await loader.getPublishedImpactStories();
  assert.equal(loaded.length, 4);
  assert.ok(loaded.some((story) => story.slug === 'greenlane-structured-delivery-requests'));
  assert.ok(loaded.some((story) => story.slug === 'openlink-own-your-digital-identity'));
  assert.ok(queries.some(([table, key, value]) => table === 'media_assets' && key === 'is_public' && value === true));
  assert.deepEqual(impact.getPublicImpactEvidence(loaded[0]).map((item) => item.asset), ['https://example.com/proof/public.png']);
  assert.doesNotMatch(JSON.stringify(loaded), /private\/hidden/);
  const story = { slug: 'test-story', title: 'Test story', summary: 'Structured request proof', workType: 'public_build', visibility: 'public', status: 'in_development', businessContext: 'A logistics concept', discoveredProblem: 'Incomplete requests', originalRequest: 'A concept brief', recommendation: 'Collect required details', solution: 'A guided form', capabilityEnabled: 'One structured request', systemFlow: ['Request', 'Review', 'Follow-up'], decisions: ['No dispatch engine'], evidence, outcomeEvidence: 'proposed', technologies: ['TypeScript'], lessons: [], nextImprovements: [] };
  const page = load('app/impact/[slug]/page.tsx', {
    'next/navigation': { notFound() { throw new Error('NOT_FOUND'); } },
    'next/link': { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) },
    '@/data/impact': impact,
    '@/lib/cms/publicImpact': { getPublishedImpactStory: async (slug) => slug === story.slug ? story : null },
    '@/lib/quote': { quoteHref: () => '/quote' },
    '../impact.module.css': { __esModule: true, default: {} },
  });
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: story.slug }) }));
  assert.ok(html.indexOf('Working proof') < html.indexOf('Technical approach'));
  assert.match(html, /From|Independently created work/);
  assert.match(html, /A structured enquiry/);
  assert.match(html, /href="\/quote"/);
  assert.doesNotMatch(html, /Private demo|javascript:|Embedded credentials/);
  assert.match(html, /Proposed benefit, not a measured result/);
  await assert.rejects(page.default({ params: Promise.resolve({ slug: 'missing' }) }), /NOT_FOUND/);
  assert.deepEqual(await page.generateMetadata({ params: Promise.resolve({ slug: story.slug }) }), { title: story.title, description: story.summary, alternates: { canonical: '/impact/test-story' } });
  console.log('Proof foundation checks passed: taxonomy, legacy preservation, narrative parsing, safe evidence, public-media loader isolation, server-rendered story, CTA and metadata.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
