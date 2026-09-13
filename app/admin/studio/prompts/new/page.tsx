import Link from 'next/link';
import {requireCmsAdmin} from '@/lib/admin/requireCmsAdmin';
import {getSupabaseConfig} from '@/lib/supabase/config';
import {documentOptions} from '@/lib/admin/documents';
import {PromptResourceForm} from '../../PromptResourceForm';
import styles from '../../../content.module.css';

export default async function NewPrompt(){
  const {supabase}=await requireCmsAdmin();const {data:media}=await supabase.from('media_assets').select('storage_path,file_name,mime_type').order('created_at',{ascending:false});
  return <main className={styles.page}><div className={styles.wrap}><Link className={styles.back} href="/admin/studio">← Studio CMS</Link><header className={styles.header}><div><p className={styles.eyebrow}>New prompt</p><h1>Add prompt</h1><p>The public prompt page builds automatically from the content saved here.</p></div></header><PromptResourceForm documents={documentOptions(getSupabaseConfig().url,media??[])}/></div></main>;
}
