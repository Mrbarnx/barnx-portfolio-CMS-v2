import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublishedStudioResource } from '@/lib/cms/publicStudio';

export const dynamic = 'force-dynamic';

export default async function ResourceDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const r=await getPublishedStudioResource(slug);
  if(!r)notFound();
  return <main className="page resourceDetail">
    <Link className="back" href="/barnx-studio">← Barnx Studio</Link>
    <section className="resourceHero"><div className="resourceIcon huge">{r.icon}</div><span className="eyebrow">{r.type} · {r.free?'FREE':'PREMIUM'}</span><h1>{r.title}</h1><p>{r.description}</p>
      <div className="promptActions">
        {r.download?<a className="button black" href={r.download} target="_blank" rel="noreferrer">Preview file ↗</a>:null}
        {r.download?<a className="button" href={r.download} download>Download resource ↓</a>:null}
        {r.externalUrl?<a className="button black" href={r.externalUrl} target="_blank" rel="noreferrer">Open project ↗</a>:null}
        {!r.download&&!r.externalUrl?<a className="button black" href="mailto:mrbarnx@gmail.com?subject=Barnx%20Studio%20Resource">Request access ↗</a>:null}
      </div>
    </section>
    <section className="caseColumns"><div><span className="eyebrow">WHAT&apos;S INCLUDED</span><ul>{r.includes.map(x=><li key={x}>{x}</li>)}</ul></div><div><span className="eyebrow">BEST FOR</span><p>{r.bestFor}</p><div className="tags large">{r.tech.map(t=><b key={t}>{t}</b>)}</div></div></section>
    <section className="nextCase"><p>Keep exploring</p><Link href="/barnx-studio">Browse all resources →</Link></section>
  </main>;
}
