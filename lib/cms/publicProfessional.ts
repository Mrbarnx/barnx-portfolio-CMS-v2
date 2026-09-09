import 'server-only';
import {cache} from 'react';
import {createClient} from '@supabase/supabase-js';
import {defaultProfessionalContent,type ProfessionalContent} from '@/data/professional';
import {getSupabaseConfig,hasSupabaseConfig} from '@/lib/supabase/config';

const normalize=(value:unknown):ProfessionalContent=>{
 if(!value||typeof value!=='object')return defaultProfessionalContent;
 const partial=value as Partial<ProfessionalContent>;
 return {capabilities:partial.capabilities??defaultProfessionalContent.capabilities,skillGroups:partial.skillGroups??defaultProfessionalContent.skillGroups,services:partial.services??defaultProfessionalContent.services,experience:partial.experience??defaultProfessionalContent.experience};
};
export const getProfessionalContent=cache(async():Promise<ProfessionalContent>=>{
 if(!hasSupabaseConfig())return defaultProfessionalContent;
 try{const{url,anonKey}=getSupabaseConfig();const client=createClient(url,anonKey,{auth:{persistSession:false}});const{data,error}=await client.from('site_settings').select('value').eq('key','site.professional-content').eq('is_public',true).maybeSingle();if(error)return defaultProfessionalContent;return normalize(data?.value);}
 catch{return defaultProfessionalContent;}
});
export const publishedByOrder=<T extends {published:boolean;sortOrder:number}>(items:T[])=>items.filter(item=>item.published).sort((a,b)=>a.sortOrder-b.sortOrder);