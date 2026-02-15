import { ExternalBlob } from '@/backend';

/**
 * Convert a File object to ExternalBlob
 */
export async function fileToExternalBlob(file: File): Promise<ExternalBlob> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return ExternalBlob.fromBytes(uint8Array);
}

/**
 * Create ExternalBlob from URL
 */
export function urlToExternalBlob(url: string): ExternalBlob {
  return ExternalBlob.fromURL(url);
}

/**
 * Get a preview URL from ExternalBlob for display
 */
export function getBlobPreviewUrl(blob: ExternalBlob): string {
  return blob.getDirectURL();
}

/**
 * Handle file input change and convert to ExternalBlob
 */
export async function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>,
  onProgress?: (percentage: number) => void
): Promise<ExternalBlob | null> {
  const file = event.target.files?.[0];
  if (!file) return null;

  const blob = await fileToExternalBlob(file);
  
  if (onProgress) {
    return blob.withUploadProgress(onProgress);
  }
  
  return blob;
}
