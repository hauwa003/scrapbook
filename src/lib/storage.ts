import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(
  file: File,
  bucket: string = 'scrapbook-images'
): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) {
    // Return a local object URL as fallback when Supabase isn't configured
    return URL.createObjectURL(file);
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${uuidv4()}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteImage(
  url: string,
  bucket: string = 'scrapbook-images'
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  const path = url.split(`${bucket}/`).pop();
  if (!path) return false;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}
