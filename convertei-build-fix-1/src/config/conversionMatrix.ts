import type { ConversionMatrix, FileCategory, FormatInfo } from '../types';

/**
 * Matriz de conversões realmente suportadas.
 * Apenas conversões implementadas com motores reais devem estar aqui.
 * Não invente suporte.
 */

export const FORMAT_INFO: Record<string, FormatInfo> = {
  // Images - fully supported via Canvas
  jpg: {
    extension: 'jpg',
    category: 'image',
    mimeTypes: ['image/jpeg'],
    canRead: true,
    canWrite: true,
    label: 'JPG',
    outputs: ['png', 'webp', 'bmp', 'gif', 'ico'],
  },
  jpeg: {
    extension: 'jpeg',
    category: 'image',
    mimeTypes: ['image/jpeg'],
    canRead: true,
    canWrite: true,
    label: 'JPEG',
    outputs: ['png', 'webp', 'bmp', 'gif', 'ico', 'jpg'],
  },
  png: {
    extension: 'png',
    category: 'image',
    mimeTypes: ['image/png'],
    canRead: true,
    canWrite: true,
    label: 'PNG',
    outputs: ['jpg', 'webp', 'bmp', 'gif', 'ico'],
  },
  webp: {
    extension: 'webp',
    category: 'image',
    mimeTypes: ['image/webp'],
    canRead: true,
    canWrite: true,
    label: 'WEBP',
    outputs: ['jpg', 'png', 'bmp', 'gif'],
  },
  gif: {
    extension: 'gif',
    category: 'image',
    mimeTypes: ['image/gif'],
    canRead: true,
    canWrite: true,
    label: 'GIF',
    outputs: ['jpg', 'png', 'webp', 'bmp'],
  },
  bmp: {
    extension: 'bmp',
    category: 'image',
    mimeTypes: ['image/bmp'],
    canRead: true,
    canWrite: true,
    label: 'BMP',
    outputs: ['jpg', 'png', 'webp', 'gif'],
  },
  ico: {
    extension: 'ico',
    category: 'image',
    mimeTypes: ['image/x-icon', 'image/vnd.microsoft.icon'],
    canRead: true,
    canWrite: true,
    label: 'ICO',
    outputs: ['png', 'jpg'],
  },
  // SVG - limited
  svg: {
    extension: 'svg',
    category: 'image',
    mimeTypes: ['image/svg+xml'],
    canRead: true,
    canWrite: false,
    label: 'SVG',
    outputs: ['png', 'jpg', 'webp'],
  },

  // HEIC / HEIF - via heic2any (loaded on demand)
  heic: {
    extension: 'heic',
    category: 'image',
    mimeTypes: ['image/heic', 'image/heif'],
    canRead: true,
    canWrite: false,
    label: 'HEIC',
    outputs: ['jpg', 'png', 'webp'],
  },
  heif: {
    extension: 'heif',
    category: 'image',
    mimeTypes: ['image/heif', 'image/heic'],
    canRead: true,
    canWrite: false,
    label: 'HEIF',
    outputs: ['jpg', 'png', 'webp'],
  },


  // Audio - via FFmpeg WASM (loaded on demand)
  mp3: {
    extension: 'mp3',
    category: 'audio',
    mimeTypes: ['audio/mpeg', 'audio/mp3'],
    canRead: true,
    canWrite: true,
    label: 'MP3',
    outputs: ['wav', 'ogg', 'aac', 'flac', 'm4a'],
  },
  wav: {
    extension: 'wav',
    category: 'audio',
    mimeTypes: ['audio/wav', 'audio/wave', 'audio/x-wav'],
    canRead: true,
    canWrite: true,
    label: 'WAV',
    outputs: ['mp3', 'ogg', 'aac', 'flac', 'm4a'],
  },
  ogg: {
    extension: 'ogg',
    category: 'audio',
    mimeTypes: ['audio/ogg'],
    canRead: true,
    canWrite: true,
    label: 'OGG',
    outputs: ['mp3', 'wav', 'aac', 'flac'],
  },
  aac: {
    extension: 'aac',
    category: 'audio',
    mimeTypes: ['audio/aac'],
    canRead: true,
    canWrite: true,
    label: 'AAC',
    outputs: ['mp3', 'wav', 'ogg', 'flac'],
  },
  flac: {
    extension: 'flac',
    category: 'audio',
    mimeTypes: ['audio/flac'],
    canRead: true,
    canWrite: true,
    label: 'FLAC',
    outputs: ['mp3', 'wav', 'ogg', 'aac'],
  },
  m4a: {
    extension: 'm4a',
    category: 'audio',
    mimeTypes: ['audio/mp4', 'audio/x-m4a'],
    canRead: true,
    canWrite: true,
    label: 'M4A',
    outputs: ['mp3', 'wav', 'ogg', 'aac'],
  },
  opus: {
    extension: 'opus',
    category: 'audio',
    mimeTypes: ['audio/opus'],
    canRead: true,
    canWrite: true,
    label: 'OPUS',
    outputs: ['mp3', 'wav', 'ogg'],
  },

  // Video - via FFmpeg WASM
  mp4: {
    extension: 'mp4',
    category: 'video',
    mimeTypes: ['video/mp4'],
    canRead: true,
    canWrite: true,
    label: 'MP4',
    outputs: ['webm', 'mkv', 'avi', 'mov', 'mp3', 'wav', 'gif'],
  },
  webm: {
    extension: 'webm',
    category: 'video',
    mimeTypes: ['video/webm'],
    canRead: true,
    canWrite: true,
    label: 'WEBM',
    outputs: ['mp4', 'mkv', 'avi', 'mp3', 'wav'],
  },
  mkv: {
    extension: 'mkv',
    category: 'video',
    mimeTypes: ['video/x-matroska'],
    canRead: true,
    canWrite: true,
    label: 'MKV',
    outputs: ['mp4', 'webm', 'avi', 'mov', 'mp3'],
  },
  avi: {
    extension: 'avi',
    category: 'video',
    mimeTypes: ['video/x-msvideo', 'video/avi'],
    canRead: true,
    canWrite: true,
    label: 'AVI',
    outputs: ['mp4', 'webm', 'mkv', 'mov'],
  },
  mov: {
    extension: 'mov',
    category: 'video',
    mimeTypes: ['video/quicktime'],
    canRead: true,
    canWrite: true,
    label: 'MOV',
    outputs: ['mp4', 'webm', 'mkv', 'avi'],
  },
  mpeg: {
    extension: 'mpeg',
    category: 'video',
    mimeTypes: ['video/mpeg'],
    canRead: true,
    canWrite: true,
    label: 'MPEG',
    outputs: ['mp4', 'webm', 'mkv'],
  },
  mpg: {
    extension: 'mpg',
    category: 'video',
    mimeTypes: ['video/mpeg'],
    canRead: true,
    canWrite: true,
    label: 'MPG',
    outputs: ['mp4', 'webm', 'mkv'],
  },
  flv: {
    extension: 'flv',
    category: 'video',
    mimeTypes: ['video/x-flv'],
    canRead: true,
    canWrite: true,
    label: 'FLV',
    outputs: ['mp4', 'webm'],
  },
  wmv: {
    extension: 'wmv',
    category: 'video',
    mimeTypes: ['video/x-ms-wmv'],
    canRead: true,
    canWrite: false, // limited write support
    label: 'WMV',
    outputs: ['mp4', 'webm'],
  },
  m4v: {
    extension: 'm4v',
    category: 'video',
    mimeTypes: ['video/x-m4v'],
    canRead: true,
    canWrite: true,
    label: 'M4V',
    outputs: ['mp4', 'webm'],
  },
  '3gp': {
    extension: '3gp',
    category: 'video',
    mimeTypes: ['video/3gpp'],
    canRead: true,
    canWrite: true,
    label: '3GP',
    outputs: ['mp4', 'webm'],
  },
  ts: {
    extension: 'ts',
    category: 'video',
    mimeTypes: ['video/mp2t'],
    canRead: true,
    canWrite: true,
    label: 'TS',
    outputs: ['mp4', 'webm', 'mkv'],
  },
  vob: {
    extension: 'vob',
    category: 'video',
    mimeTypes: ['video/dvd'],
    canRead: true,
    canWrite: false,
    label: 'VOB',
    outputs: ['mp4', 'webm', 'mkv'],
  },
  ogv: {
    extension: 'ogv',
    category: 'video',
    mimeTypes: ['video/ogg'],
    canRead: true,
    canWrite: true,
    label: 'OGV',
    outputs: ['mp4', 'webm'],
  },

  // Archives
  zip: {
    extension: 'zip',
    category: 'archive',
    mimeTypes: ['application/zip'],
    canRead: true,
    canWrite: true,
    label: 'ZIP',
    outputs: [], // special handling
  },

  // Documents - limited real support
  pdf: {
    extension: 'pdf',
    category: 'document',
    mimeTypes: ['application/pdf'],
    canRead: true,
    canWrite: true,
    label: 'PDF',
    outputs: ['jpg', 'png'], // via canvas/pdf.js later
  },
  txt: {
    extension: 'txt',
    category: 'document',
    mimeTypes: ['text/plain'],
    canRead: true,
    canWrite: true,
    label: 'TXT',
    outputs: ['pdf'],
  },
  html: {
    extension: 'html',
    category: 'document',
    mimeTypes: ['text/html'],
    canRead: true,
    canWrite: true,
    label: 'HTML',
    outputs: ['txt', 'pdf'],
  },
  csv: {
    extension: 'csv',
    category: 'document',
    mimeTypes: ['text/csv'],
    canRead: true,
    canWrite: true,
    label: 'CSV',
    outputs: ['txt'],
  },
};

// Build conversion matrix from FORMAT_INFO
export const conversionMatrix: ConversionMatrix = Object.fromEntries(
  Object.entries(FORMAT_INFO).map(([ext, info]) => [
    ext,
    {
      category: info.category,
      outputs: info.outputs,
      label: info.label,
    },
  ])
);

export function getCategoryFromExtension(ext: string): FileCategory {
  const info = FORMAT_INFO[ext.toLowerCase()];
  return info?.category ?? 'unknown';
}

export function getAvailableOutputs(inputFormat: string): string[] {
  const info = FORMAT_INFO[inputFormat.toLowerCase()];
  return info?.outputs ?? [];
}

export function isConversionSupported(input: string, output: string): boolean {
  const outputs = getAvailableOutputs(input);
  return outputs.includes(output.toLowerCase());
}

export function getFormatLabel(ext: string): string {
  return FORMAT_INFO[ext.toLowerCase()]?.label ?? ext.toUpperCase();
}

export const CATEGORY_LABELS: Record<FileCategory, string> = {
  audio: 'Áudio',
  video: 'Vídeo',
  image: 'Imagem',
  document: 'Documento',
  ebook: 'E-book',
  archive: 'Arquivo',
  font: 'Fonte',
  cad: 'CAD',
  unknown: 'Desconhecido',
};

export const MAX_FILE_SIZE_FREE = 500 * 1024 * 1024; // 500 MB
export const MAX_BATCH_FILES = 20;
