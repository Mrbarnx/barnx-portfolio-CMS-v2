import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { requireCmsAdmin } from '@/lib/admin/requireCmsAdmin';
import { mediaPublicUrl, type MediaAsset } from '@/lib/admin/media';
import { MediaDeleteButton } from './MediaDeleteButton';
import { MediaUploadForm } from './MediaUploadForm';
import { DocumentUploadForm } from './DocumentUploadForm';
import { isImageAsset } from '@/lib/admin/media';
import styles from './media.module.css';

export const metadata: Metadata = { title: 'Media Library | Barnx Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ deleted?: string }>;

function formatBytes(bytes: number | null) {
  if (bytes === null) return 'Unknown size';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await requireCmsAdmin();
  const { url } = getSupabaseConfig();
  const { deleted } = await searchParams;
  const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
  const assets = (data ?? []) as MediaAsset[];
  const images = assets.filter(isImageAsset);
  const documents = assets.filter((asset) => !isImageAsset(asset));

  return (
    <main className={styles.mediaPage}>
      <header className={styles.pageHeader}>
        <Link className={styles.backLink} href="/admin"><ArrowLeft /> Admin home</Link>
        <p className={styles.eyebrow}>Content management</p>
        <h1>Media Library</h1>
        <p>Upload reusable images and public documents, then attach them to projects, prompts and Studio resources.</p>
      </header>

      {deleted === 'true' ? <p className={styles.notice} role="status">Media asset deleted.</p> : null}
      {deleted === 'failed' ? <p className={styles.errorNotice} role="alert">The media asset could not be deleted.</p> : null}
      {deleted === 'in-use' ? <p className={styles.errorNotice} role="alert">This image is attached to content and cannot be deleted until it is removed there.</p> : null}

      <div className={styles.mediaLayout}>
        <div className={styles.uploadStack}><MediaUploadForm/><DocumentUploadForm/></div>
        <section className={styles.libraryPanel}>
          <div className={styles.libraryHeading}><div><h2>Your media</h2><p>{images.length} image{images.length === 1 ? '' : 's'} · {documents.length} document{documents.length === 1 ? '' : 's'}</p></div></div>
          {error ? <p className={styles.errorNotice} role="alert">The Media Library could not be loaded.</p> : null}
          {!error && assets.length === 0 ? <div className={styles.emptyState}><ImageIcon /><h3>No images yet</h3><p>Run the Storage migration, then upload your first project image.</p></div> : null}
          <div className={styles.assetGrid}>
            {images.map((asset) => {
              const assetUrl = mediaPublicUrl(url, asset.storage_path);
              return (
                <article className={styles.assetCard} key={asset.id}>
                  <a href={assetUrl} target="_blank" rel="noreferrer"><img src={assetUrl} alt={asset.alt_text} /></a>
                  <div className={styles.assetBody}>
                    <div className={styles.assetStatus}><span>{asset.is_public ? 'Public' : 'Private'}</span><span>{formatBytes(asset.size_bytes)}</span></div>
                    <h3 title={asset.file_name}>{asset.file_name}</h3>
                    <p>{asset.alt_text}</p>
                    <small>{asset.width && asset.height ? `${asset.width} × ${asset.height}` : 'Dimensions unavailable'}</small>
                    <div className={styles.assetActions}><a href={assetUrl} target="_blank" rel="noreferrer">Open image ↗</a><MediaDeleteButton id={asset.id} name={asset.file_name} /></div>
                  </div>
                </article>
              );
            })}
          </div>
          {documents.length?<><div className={styles.libraryHeading}><div><h2>Documents & downloads</h2><p>Select these inside prompt and resource forms.</p></div></div><div className={styles.documentList}>{documents.map((asset)=>{const assetUrl=mediaPublicUrl(url,asset.storage_path);return <article className={styles.documentCard} key={asset.id}><div><span>{asset.mime_type.split('/').pop()?.toUpperCase()}</span><h3>{asset.file_name}</h3><p>{asset.caption||'Public downloadable file'}</p></div><div className={styles.assetActions}><a href={assetUrl} target="_blank" rel="noreferrer">Preview ↗</a><MediaDeleteButton id={asset.id} name={asset.file_name}/></div></article>})}</div></>:null}
        </section>
      </div>
    </main>
  );
}
