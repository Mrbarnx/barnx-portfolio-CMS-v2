'use client';

import { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CMS_DOCUMENTS_BUCKET, MAX_RESUME_SIZE } from '@/lib/admin/documents';
import styles from './resume-upload.module.css';

export function ResumeUploadField({ defaultValue }: { defaultValue: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeUrl, setResumeUrl] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function uploadResume() {
    const file = fileRef.current?.files?.[0];
    setMessage(null);

    try {
      if (!file) throw new Error('Choose a PDF résumé first.');
      if (file.type !== 'application/pdf') throw new Error('The résumé must be a PDF file.');
      if (file.size > MAX_RESUME_SIZE) throw new Error('The résumé must be 5 MB or smaller.');

      setPending(true);
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Your admin session expired. Sign in again.');

      const storagePath = `${user.id}/resume-${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from(CMS_DOCUMENTS_BUCKET)
        .upload(storagePath, file, { contentType: 'application/pdf', cacheControl: '3600', upsert: false });

      if (uploadError) {
        if (uploadError.message.toLowerCase().includes('bucket')) {
          throw new Error('Résumé Storage is not ready. Apply the CMS documents migration first.');
        }
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from(CMS_DOCUMENTS_BUCKET).getPublicUrl(storagePath);
      if (!data.publicUrl) throw new Error('The résumé uploaded, but its public URL could not be created.');

      setResumeUrl(data.publicUrl);
      setMessage('Résumé uploaded. Save settings to publish this version.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The résumé could not be uploaded.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.resumeField}>
      <label>Résumé path<input name="resumeUrl" required value={resumeUrl} onChange={(event) => setResumeUrl(event.target.value)} /></label>
      <div className={styles.resumeUploadRow}>
        <label className={styles.filePicker}>Choose PDF<input ref={fileRef} type="file" accept="application/pdf,.pdf" /></label>
        <button className={styles.uploadButton} type="button" disabled={pending} onClick={uploadResume}>
          <FileUp aria-hidden="true" /> {pending ? 'Uploading…' : 'Upload résumé'}
        </button>
      </div>
      <p className={styles.fieldHelp}>PDF only · maximum 5 MB. Uploading does not publish until you save settings.</p>
      {message ? <p className={styles.uploadStatus} role="status">{message}</p> : null}
    </div>
  );
}
