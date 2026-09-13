'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { acceptedDocumentTypes, CMS_MEDIA_BUCKET, MAX_DOCUMENT_SIZE } from '@/lib/admin/media';
import styles from './media.module.css';

const extensions = new Set(['pdf', 'md', 'txt', 'json', 'zip', 'docx']);
const fallbackMime: Record<string, string> = {
  pdf: 'application/pdf', md: 'text/markdown', txt: 'text/plain', json: 'application/json',
  zip: 'application/zip', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function DocumentUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file');
    const caption = String(formData.get('caption') ?? '').trim();

    try {
      if (!(file instanceof File) || file.size === 0) throw new Error('Choose a document to upload.');
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!extensions.has(extension) || (file.type && !acceptedDocumentTypes.includes(file.type as (typeof acceptedDocumentTypes)[number]))) {
        throw new Error('Use a PDF, Markdown, TXT, JSON, ZIP or DOCX file.');
      }
      if (file.size > MAX_DOCUMENT_SIZE) throw new Error('The document must be 15 MB or smaller.');

      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Your admin session expired. Sign in again.');
      const storagePath = `${user.id}/documents/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from(CMS_MEDIA_BUCKET).upload(storagePath, file, {
        contentType: file.type || fallbackMime[extension],
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw new Error(uploadError.message);

      const { error: metadataError } = await supabase.from('media_assets').insert({
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type || fallbackMime[extension],
        alt_text: file.name,
        caption: caption || null,
        width: null,
        height: null,
        size_bytes: file.size,
        is_public: true,
        created_by: user.id,
      });
      if (metadataError) {
        await supabase.storage.from(CMS_MEDIA_BUCKET).remove([storagePath]);
        throw new Error('The file uploaded, but its CMS record failed. The file was cleaned up safely.');
      }
      formRef.current?.reset();
      setMessage('Document uploaded. It is now available in resource and prompt forms.');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The document could not be uploaded.');
    } finally {
      setPending(false);
    }
  }

  return <form className={styles.uploadForm} onSubmit={upload} ref={formRef}>
    <div className={styles.uploadHeading}><FileUp/><div><h2>Upload document</h2><p>PDF, MD, TXT, JSON, ZIP or DOCX · maximum 15 MB</p></div></div>
    <label>Document file<input name="file" type="file" accept=".pdf,.md,.txt,.json,.zip,.docx" required/></label>
    <label>Label or note <span>optional</span><input name="caption" placeholder="What this file contains" maxLength={500}/></label>
    <div className={styles.publicNotice}><strong>Public downloadable file</strong><small>Anyone with its URL can open or download it. Never upload secrets or private client files.</small></div>
    {message?<p className={styles.uploadMessage} role="status">{message}</p>:null}
    <button className={styles.uploadButton} type="submit" disabled={pending}>{pending?'Uploading…':'Upload document'}</button>
  </form>;
}
