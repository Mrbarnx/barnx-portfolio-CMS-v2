import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requireCmsAdmin} from '@/lib/admin/requireCmsAdmin';
import {getSupabaseConfig} from '@/lib/supabase/config';
import {documentOptions} from '@/lib/admin/documents';
import {PromptResourceForm} from '../../PromptResourceForm';
import styles from '../../../content.module.css';

export default async function EditPrompt({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string}>}){
  const {id}=await params;const {supabase}=await requireCmsAdmin();
  const [{data},{data:media},{data:categories}]=await Promise.all([supabase.from('prompt_resources').select('*').eq('id',id).maybeSingle(),supabase.from('media_assets').select('id,storage_path,file_name,mime_type').order('created_at',{ascending:false}),supabase.from('prompt_categories').select('id,name').order('sort_order')]);
  if(!data)notFound();const {saved}=await searchParams;
  return <main className={styles.page}><div className={styles.wrap}><Link className={styles.back} href="/admin/studio">← Studio CMS</Link><header className={styles.header}><div><p className={styles.eyebrow}>Edit prompt</p><h1>{data.title}</h1></div></header>{saved?<p className={styles.notice}>Saved successfully as {saved}.</p>:null}<PromptResourceForm row={data} categories={categories??[]} images={(media??[]).filter(item=>item.mime_type.startsWith('image/')).map(item=>({id:item.id,name:item.file_name}))} documents={documentOptions(getSupabaseConfig().url,media??[])}/></div></main>;
}
