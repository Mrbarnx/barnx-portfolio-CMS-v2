import Link from 'next/link';
import {requireCmsAdmin} from '@/lib/admin/requireCmsAdmin';
import styles from '../content.module.css';
import chartStyles from './analytics.module.css';

export const dynamic='force-dynamic';

type Event={visitor_id:string;session_id:string;event_name:string;pathname:string;target:string|null;referrer_host:string|null;country_code:string|null;device_type:string;created_at:string};
type Day={key:string;label:string;views:number;actions:number};
const count=(items:string[])=>Object.entries(items.reduce<Record<string,number>>((all,item)=>({...all,[item]:(all[item]||0)+1}),{})).sort((a,b)=>b[1]-a[1]);
const dayKey=(date:Date)=>date.toISOString().slice(0,10);

function buildTrend(events:Event[]):Day[]{
  const totals=new Map<string,{views:number;actions:number}>();
  for(const event of events){
    const key=dayKey(new Date(event.created_at));
    const value=totals.get(key)??{views:0,actions:0};
    if(['page_view','project_open','resource_open'].includes(event.event_name)) value.views+=1;
    if(['download','external_click'].includes(event.event_name)) value.actions+=1;
    totals.set(key,value);
  }
  return Array.from({length:14},(_,index)=>{
    const date=new Date();
    date.setUTCHours(0,0,0,0);
    date.setUTCDate(date.getUTCDate()-(13-index));
    const key=dayKey(date);
    return {key,label:date.toLocaleDateString('en-NG',{day:'numeric',month:'short',timeZone:'UTC'}),...(totals.get(key)??{views:0,actions:0})};
  });
}

export default async function AnalyticsAdmin(){
  const {supabase}=await requireCmsAdmin();
  const since=new Date(Date.now()-30*86400000).toISOString();
  const {data,error}=await supabase.from('analytics_events').select('visitor_id,session_id,event_name,pathname,target,referrer_host,country_code,device_type,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(5000);
  const events=(data??[]) as Event[];
  const visitors=new Set(events.map(e=>e.visitor_id)).size;
  const sessions=new Set(events.map(e=>e.session_id)).size;
  const pages=events.filter(e=>['page_view','project_open','resource_open'].includes(e.event_name));
  const topPages=count(pages.map(e=>e.pathname)).slice(0,8);
  const countries=count(events.map(e=>e.country_code||'Unknown')).slice(0,8);
  const devices=count(events.map(e=>e.device_type));
  const referrals=count(events.map(e=>e.referrer_host||'Direct')).slice(0,8);
  const actions=events.filter(e=>['download','external_click'].includes(e.event_name));
  const trend=buildTrend(events);
  return <main className={styles.page}><div className={styles.wrap}>
    <Link className={styles.back} href="/admin">← Admin home</Link>
    <header className={styles.header}><div><p className={styles.eyebrow}>Last 30 days</p><h1>Analytics</h1><p>Anonymous traffic and useful actions. No names, emails or IP addresses are stored.</p></div></header>
    {error?<p className={styles.error}>Analytics could not be loaded. Check the Supabase migration and try again.</p>:null}
    <div className={chartStyles.statGrid}><div className={styles.stat}><strong>{visitors}</strong><span>Unique visitors</span></div><div className={styles.stat}><strong>{sessions}</strong><span>Sessions</span></div><div className={styles.stat}><strong>{pages.length}</strong><span>Page views</span></div><div className={styles.stat}><strong>{actions.filter(e=>e.event_name==='download').length}</strong><span>Downloads</span></div><div className={styles.stat}><strong>{actions.filter(e=>e.event_name==='external_click').length}</strong><span>External clicks</span></div></div>
    <TrafficChart days={trend}/>
    <div className={chartStyles.analyticsGrid}><AnalyticsTable title="Top pages" rows={topPages}/><AnalyticsTable title="Countries" rows={countries}/><AnalyticsTable title="Devices" rows={devices}/><AnalyticsTable title="Referrers" rows={referrals}/></div>
    <section className={styles.section} style={{marginTop:20}}><h2>Recent useful actions</h2><table className={styles.table}><thead><tr><th>Action</th><th>From</th><th>Target</th><th>Time</th></tr></thead><tbody>{actions.slice(0,20).map((e,i)=><tr key={`${e.created_at}-${i}`}><td>{e.event_name.replace('_',' ')}</td><td>{e.pathname}</td><td>{e.target||'—'}</td><td>{new Date(e.created_at).toLocaleString('en-NG')}</td></tr>)}</tbody></table>{!actions.length?<p className={chartStyles.muted}>No tracked downloads or external clicks yet.</p>:null}</section>
    <p className={styles.guard} style={{marginTop:20}}>Unique visitors use a random browser ID; sessions renew after 30 minutes of inactivity. Rapid duplicate views are ignored, each session is rate-limited, and events older than 90 days are deleted automatically. Dashboard counts use the newest 5,000 events.</p>
  </div></main>;
}

function TrafficChart({days}:{days:Day[]}){
  const maximum=Math.max(1,...days.flatMap(day=>[day.views,day.actions]));
  return <section className={`${styles.section} ${chartStyles.chartSection}`}><div className={chartStyles.chartHeader}><div><h2>Traffic trend</h2><p>Daily activity for the last 14 days</p></div><div className={chartStyles.legend}><span><i className={chartStyles.viewsKey}/>Views</span><span><i className={chartStyles.actionsKey}/>Useful actions</span></div></div><div className={chartStyles.chart} role="img" aria-label="Bar chart of daily page views and useful actions for the last 14 days">{days.map(day=><div className={chartStyles.chartDay} key={day.key}><div className={chartStyles.bars}><span className={chartStyles.viewBar} style={{height:`${Math.max(day.views?6:0,(day.views/maximum)*100)}%`}} title={`${day.views} views`}/><span className={chartStyles.actionBar} style={{height:`${Math.max(day.actions?6:0,(day.actions/maximum)*100)}%`}} title={`${day.actions} useful actions`}/></div><span className={chartStyles.dayLabel}>{day.label}</span></div>)}</div></section>;
}

function AnalyticsTable({title,rows}:{title:string;rows:[string,number][]}){return <section className={styles.section}><h2>{title}</h2><table className={styles.table}><thead><tr><th>Item</th><th>Count</th></tr></thead><tbody>{rows.map(([label,total])=><tr key={label}><td>{label}</td><td>{total}</td></tr>)}</tbody></table>{!rows.length?<p className={chartStyles.muted}>No data yet.</p>:null}</section>}
