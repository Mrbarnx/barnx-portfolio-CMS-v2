'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import type {PublicPrompt,PublicPromptCategory} from '@/lib/cms/publicStudio';
import styles from './PromptLibraryBrowser.module.css';

export function PromptLibraryBrowser({categories,prompts}:{categories:PublicPromptCategory[];prompts:PublicPrompt[]}){
  const [category,setCategory]=useState('all');const [query,setQuery]=useState('');
  const visible=useMemo(()=>prompts.filter(prompt=>(category==='all'||prompt.categorySlug===category)&&`${prompt.title} ${prompt.short} ${prompt.tools.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())),[category,prompts,query]);
  const active=categories.find(item=>item.slug===category);
  return <><div className={styles.controls}><label className={styles.search}><span>Search prompts</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search by goal, tool or topic"/></label><div className={styles.filters} aria-label="Prompt categories"><button className={category==='all'?styles.active:''} onClick={()=>setCategory('all')}>All <span>{prompts.length}</span></button>{categories.map(item=><button key={item.slug} className={category===item.slug?styles.active:''} onClick={()=>setCategory(item.slug)}>{item.name} <span>{prompts.filter(prompt=>prompt.categorySlug===item.slug).length}</span></button>)}</div></div>
  {active?<div className={styles.categoryIntro}><span>{active.icon}</span><div><h3>{active.name}</h3><p>{active.description}</p></div></div>:null}
  {visible.length?<div className="resourceGrid">{visible.map(prompt=><Link href={`/barnx-studio/prompts/${prompt.slug}`} className="resourceCard" key={prompt.slug}><div className="resourceIcon">{prompt.number}</div><div><span>{prompt.category} · PROMPT</span><h3>{prompt.title}</h3><p>{prompt.short}</p><em>Open prompt →</em></div></Link>)}</div>:<div className={styles.empty}><span>✦</span><h3>{query?'No prompts match that search.':'Coming soon.'}</h3><p>{query?'Try another word or category.':`${active?.name??'More'} prompts are being prepared and will appear here when ready.`}</p></div>}</>;
}
