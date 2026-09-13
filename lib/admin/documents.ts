import { mediaPublicUrl, type MediaAsset } from './media';

export const CMS_DOCUMENTS_BUCKET = 'cms-documents';
export const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export function documentOptions(supabaseUrl:string, rows:Array<Pick<MediaAsset,'storage_path'|'file_name'|'mime_type'>> = []) {
  return rows.filter((row)=>!row.mime_type.startsWith('image/')).map((row)=>({
    name: row.file_name,
    type: row.file_name.split('.').pop()?.toUpperCase() || 'FILE',
    url: mediaPublicUrl(supabaseUrl,row.storage_path),
  }));
}
