import Link from 'next/link';
import {requireCmsAdmin} from '@/lib/admin/requireCmsAdmin';
import {getSupabaseConfig} from '@/lib/supabase/config';
import {documentOptions} from '@/lib/admin/documents';
import {PromptResourceForm} from '../../PromptResourceForm';
import styles from '../../../content.module.css';

export default async function NewPrompt(){
  const {supabase}=await requireCmsAdmin();const [{data:media},{data:categories}]=await Promise.all([supabase.from('media_assets').select('id,storage_path,file_name,mime_type').order('created_at',{ascending:false}),supabase.from('prompt_categories').select('id,name').order('sort_order')]);
  return <main className={styles.page}><div className={styles.wrap}><Link className={styles.back} href="/admin/studio">← Studio CMS</Link><header className={styles.header}><div><p className={styles.eyebrow}>New prompt</p><h1>Add prompt</h1><p>The public prompt page builds automatically from the content saved here.</p></div></header><PromptResourceForm categories={categories??[]} images={(media??[]).filter(item=>item.mime_type.startsWith('image/')).map(item=>({id:item.id,name:item.file_name}))} documents={documentOptions(getSupabaseConfig().url,media??[])}/></div></main>;
}
