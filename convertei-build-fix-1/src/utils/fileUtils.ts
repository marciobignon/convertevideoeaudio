import { getCategoryFromExtension, FORMAT_INFO } from '../config/conversionMatrix';
import type { FileCategory } from '../types';

export function getExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts.pop()!.toLowerCase();
}

export function getBaseName(filename: string): string {
  const ext = getExtension(filename);
  if (!ext) return filename;
  return filename.slice(0, -(ext.length + 1));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(i > 1 ? 1 : 0))} ${sizes[i]}`;
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

export function detectMimeType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }
  // Fallback based on extension
  const ext = getExtension(file.name);
  const info = FORMAT_INFO[ext];
  return info?.mimeTypes[0] ?? 'application/octet-stream';
}

export function detectCategory(file: File): FileCategory {
  const ext = getExtension(file.name);
  return getCategoryFromExtension(ext);
}

export function createOutputFilename(
  originalName: string,
  outputFormat: string
): string {
  const base = getBaseName(originalName);
  const safeBase = sanitizeFilename(base) || 'converted';
  return `${safeBase}.${outputFormat.toLowerCase()}`;
}

export async function readFileSignature(file: File, bytes = 16): Promise<string> {
  const buffer = await file.slice(0, bytes).arrayBuffer();
  const arr = new Uint8Array(buffer);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
    .toUpperCase();
}

/**
 * Basic magic number checks for common formats.
 * Returns suspected real format or null if unknown/match.
 */
export async function verifyFileSignature(
  file: File,
  claimedExt: string
): Promise<{ valid: boolean; detected?: string }> {
  try {
    const sig = await readFileSignature(file, 12);
    const claimed = claimedExt.toLowerCase();

    // Common signatures
    const signatures: Record<string, string[]> = {
      jpg: ['FF D8 FF'],
      jpeg: ['FF D8 FF'],
      png: ['89 50 4E 47'],
      gif: ['47 49 46 38'],
      webp: ['52 49 46 46'], // RIFF....WEBP
      bmp: ['42 4D'],
      pdf: ['25 50 44 46'],
      zip: ['50 4B 03 04', '50 4B 05 06', '50 4B 07 08'],
      mp3: ['49 44 33', 'FF FB', 'FF F3', 'FF F2'],
      wav: ['52 49 46 46'], // RIFF....WAVE
      mp4: ['00 00 00'], // ftyp later
      webm: ['1A 45 DF A3'],
      ogg: ['4F 67 67 53'],
      flac: ['66 4C 61 43'],
    };

    const expected = signatures[claimed];
    if (!expected) {
      return { valid: true }; // unknown, allow
    }

    const matches = expected.some((s) => sig.startsWith(s));
    if (matches) return { valid: true };

    // Try to detect real type
    for (const [ext, sigs] of Object.entries(signatures)) {
      if (sigs.some((s) => sig.startsWith(s))) {
        return { valid: false, detected: ext };
      }
    }

    return { valid: true }; // allow unknown
  } catch {
    return { valid: true };
  }
}

export function createObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeObjectURL(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sanitizeFilename(filename);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revoke to ensure download starts
  setTimeout(() => revokeObjectURL(url), 5000);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
