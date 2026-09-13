import Link from 'next/link';
import { requireCmsAdmin } from '@/lib/admin/requireCmsAdmin';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { documentOptions } from '@/lib/admin/documents';
import { StudioResourceForm } from '../../StudioResourceForm';
import styles from '../../../content.module.css';

export default async function NewStudioResource(){
  const {supabase}=await requireCmsAdmin();
  const [{data:categories},{data:media}]=await Promise.all([
    supabase.from('studio_categories').select('id,title').order('sort_order'),
    supabase.from('media_assets').select('storage_path,file_name,mime_type').order('created_at',{ascending:false}),
  ]);
  const documents=documentOptions(getSupabaseConfig().url,media??[]);
  return <main className={styles.page}><div className={styles.wrap}><Link className={styles.back} href="/admin/studio">← Studio CMS</Link><header className={styles.header}><div><p className={styles.eyebrow}>New resource</p><h1>Add Studio resource</h1><p>Choose its category and delivery file, then publish when it is ready.</p></div></header><StudioResourceForm categories={categories??[]} documents={documents}/></div></main>;
}
