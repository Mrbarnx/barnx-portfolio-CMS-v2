'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {requireCmsAdmin} from '@/lib/admin/requireCmsAdmin';
const text=z.string().trim().min(2);
const lines=(v:FormDataEntryValue|null)=>String(v??'').split(/\n/).map(x=>x.trim()).filter(Boolean);
const bool=(d:FormData,k:string)=>d.get(k)==='on';
const order=(d:FormData,k:string)=>Number(d.get(k)??0);
export async function saveProfessionalContent(data:FormData){
 const capabilities=Array.from({length:6},(_,i)=>({label:String(data.get(`cap_label_${i}`)??'').trim(),title:String(data.get(`cap_title_${i}`)??'').trim(),summary:String(data.get(`cap_summary_${i}`)??'').trim(),published:bool(data,`cap_published_${i}`),sortOrder:order(data,`cap_order_${i}`)})).filter(x=>x.title);
 const skillGroups=Array.from({length:6},(_,i)=>({title:String(data.get(`skill_title_${i}`)??'').trim(),skills:lines(data.get(`skill_items_${i}`)),published:bool(data,`skill_published_${i}`),sortOrder:order(data,`skill_order_${i}`)})).filter(x=>x.title);
 const services=Array.from({length:6},(_,i)=>({number:String(data.get(`service_number_${i}`)??'').trim(),title:String(data.get(`service_title_${i}`)??'').trim(),summary:String(data.get(`service_summary_${i}`)??'').trim(),published:bool(data,`service_published_${i}`),sortOrder:order(data,`service_order_${i}`)})).filter(x=>x.title);
 const experience=Array.from({length:8},(_,i)=>({slug:String(data.get(`exp_slug_${i}`)??'').trim(),date:String(data.get(`exp_date_${i}`)??'').trim(),role:String(data.get(`exp_role_${i}`)??'').trim(),company:String(data.get(`exp_company_${i}`)??'').trim(),lead:String(data.get(`exp_lead_${i}`)??'').trim(),contributions:lines(data.get(`exp_contributions_${i}`)),practices:lines(data.get(`exp_practices_${i}`)),evidence:String(data.get(`exp_evidence_${i}`)??'').trim(),boundary:String(data.get(`exp_boundary_${i}`)??'').trim(),published:bool(data,`exp_published_${i}`),sortOrder:order(data,`exp_order_${i}`)})).filter(x=>x.role||x.company);
 const item=z.object({title:text,summary:text}); if(!capabilities.every(x=>item.safeParse(x).success)||!services.every(x=>item.safeParse(x).success)||experience.some(x=>!x.slug||!x.role||!x.company))redirect('/admin/professional?error=validation');
 const{supabase,user}=await requireCmsAdmin();const{error}=await supabase.from('site_settings').upsert({key:'site.professional-content',value:{capabilities,skillGroups,services,experience},description:'Editable capabilities, skills, services and professional experience.',is_public:true,updated_by:user.id});
 ['/','/capabilities','/experience','/admin/professional'].forEach(path=>revalidatePath(path));
 redirect(`/admin/professional?saved=${error?'failed':'true'}`);
}