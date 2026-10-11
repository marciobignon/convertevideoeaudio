export type FileCategory = 
  | 'audio' 
  | 'video' 
  | 'image' 
  | 'document' 
  | 'ebook' 
  | 'archive' 
  | 'font' 
  | 'cad' 
  | 'unknown';

export type ConversionStatus = 
  | 'idle' 
  | 'queued' 
  | 'preparing' 
  | 'loading_engine' 
  | 'processing' 
  | 'finalizing' 
  | 'completed' 
  | 'error' 
  | 'cancelled';

export interface FileInfo {
  id: string;
  file: File;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  inputFormat: string;
  outputFormat: string | null;
  status: ConversionStatus;
  progress: number;
  error?: string;
  resultBlob?: Blob;
  resultName?: string;
  options: ConversionOptions;
}

export interface ConversionOptions {
  // Video
  resolution?: string;
  videoCodec?: string;
  fps?: string;
  bitrate?: string;
  audioAction?: 'keep' | 'remove';
  audioCodec?: string;
  audioBitrate?: string;
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | null;
  
  // Audio
  sampleRate?: string;
  channels?: 'mono' | 'stereo';
  volume?: number;
  
  // Image
  quality?: number;
  resize?: string | { width?: number; height?: number };
  dpi?: number;
  
  // Common
  [key: string]: unknown;
}

export interface ConversionResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
  mimeType?: string;
}

export interface ProgressCallback {
  (progress: number, status: ConversionStatus, message?: string): void;
}

export interface ConvertParams {
  file: File;
  inputFormat: string;
  outputFormat: string;
  options?: ConversionOptions;
  onProgress?: ProgressCallback;
  signal?: AbortSignal;
}

export interface FormatInfo {
  extension: string;
  category: FileCategory;
  mimeTypes: string[];
  canRead: boolean;
  canWrite: boolean;
  label: string;
  outputs: string[];
}

export interface ConversionMatrix {
  [inputFormat: string]: {
    category: FileCategory;
    outputs: string[];
    label: string;
  };
}
