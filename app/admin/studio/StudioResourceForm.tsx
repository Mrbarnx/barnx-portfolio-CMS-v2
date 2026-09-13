import { deleteStudioResource, publishStudioResource, saveStudioResourceDraft } from '../content-actions';
import { ConfirmDeleteButton } from './ConfirmDeleteButton';
import styles from '../content.module.css';

type Row=Record<string,unknown>;
type Category={id:string;title:string};
export type DownloadDocument={name:string;url:string;type:string};

export function StudioResourceForm({row={},categories=[],documents=[]}:{row?:Row;categories?:Category[];documents?:DownloadDocument[]}){
  const currentDownload=String(row.download_path??'');
  return <form className={styles.form} action={saveStudioResourceDraft}>
    <input type="hidden" name="id" value={String(row.id??'')}/>
    <section className={styles.section}><h2>Resource identity</h2><div className={styles.fields}>
      <label>Title<input required name="title" defaultValue={String(row.title??'')}/></label><label>Slug<input required name="slug" defaultValue={String(row.slug??'')}/></label>
      <label>Studio category<select name="category_id" defaultValue={String(row.category_id??'')}><option value="">Unassigned</option>{categories.map(category=><option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
      <label>Resource type<select name="resource_type" defaultValue={String(row.resource_type??'guide')}>{['guide','component','workflow','open_source_project','template','blueprint','visual_asset','other'].map(x=><option value={x} key={x}>{x.replaceAll('_',' ')}</option>)}</select></label>
      <label>Icon<input name="icon" defaultValue={String(row.icon??'✦')}/></label><label>Sort order<input name="sort_order" type="number" min="0" defaultValue={String(row.sort_order??0)}/></label>
      <label className={styles.check}><input type="checkbox" name="is_free" defaultChecked={row.is_free!==false}/>Free resource</label><label className={styles.check}><input type="checkbox" name="featured" defaultChecked={Boolean(row.featured)}/>Featured</label>
    </div></section>
    <section className={styles.section}><h2>Content</h2><div className={styles.stack}>
      <label>Short summary<textarea required name="short_summary" rows={2} defaultValue={String(row.short_summary??'')}/></label><label>Description<textarea required name="description" rows={5} defaultValue={String(row.description??'')}/></label>
      <label>What is included — one per line<textarea name="includes" rows={5} defaultValue={Array.isArray(row.includes)?row.includes.join('\n'):''}/></label><label>Best for<textarea name="best_for" rows={3} defaultValue={String(row.best_for??'')}/></label><label>Technologies — one per line<textarea name="technologies" rows={4} defaultValue={Array.isArray(row.technologies)?row.technologies.join('\n'):''}/></label>
    </div></section>
    <section className={styles.section}><h2>Delivery</h2><div className={styles.stack}>
      <label>Select uploaded document<select name="document_url" defaultValue={documents.some(x=>x.url===currentDownload)?currentDownload:''}><option value="">No uploaded document selected</option>{documents.map(document=><option value={document.url} key={document.url}>{document.name} · {document.type}</option>)}</select><small>Upload files in Media Library. Selecting one replaces the manual path below.</small></label>
      <div className={styles.fields}><label>Manual download URL or path<input name="download_path" placeholder="/downloads/file.pdf" defaultValue={currentDownload}/></label><label>External/live URL<input name="external_url" placeholder="https://..." defaultValue={String(row.external_url??'')}/></label></div>
    </div></section>
    <div className={styles.formActions}>{row.id?<ConfirmDeleteButton action={deleteStudioResource} label="resource" className={styles.secondary}/>:null}<button type="submit" className={styles.secondary}>Save draft</button><button type="submit" className={styles.button} formAction={publishStudioResource}>Save & publish</button></div>
  </form>;
}
