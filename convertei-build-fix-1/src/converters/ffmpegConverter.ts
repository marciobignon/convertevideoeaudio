/**
 * FFmpeg WebAssembly converter for audio and video.
 * Loaded ON DEMAND only when needed.
 * Uses @ffmpeg/ffmpeg and @ffmpeg/util from CDN or npm.
 *
 * IMPORTANT: FFmpeg WASM has memory and size limitations.
 * Very large files may fail depending on the device.
 */

import type { ConvertParams, ConversionResult, ConversionOptions } from '../types';
import { createOutputFilename } from '../utils/fileUtils';

// Types for FFmpeg (loaded dynamically)
type FFmpegInstance = {
  load: (config?: { coreURL?: string; wasmURL?: string }) => Promise<void>;
  writeFile: (name: string, data: Uint8Array) => Promise<void>;
  readFile: (name: string) => Promise<Uint8Array>;
  exec: (args: string[]) => Promise<number>;
  deleteFile: (name: string) => Promise<void>;
  on: (event: string, cb: (data: { progress?: number; time?: number }) => void) => void;
  terminate: () => void;
};

let ffmpegInstance: FFmpegInstance | null = null;
let loadingPromise: Promise<FFmpegInstance> | null = null;

const CORE_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm';

async function loadFFmpeg(
  onProgress?: (progress: number, status: string, message?: string) => void
): Promise<FFmpegInstance> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    onProgress?.(5, 'loading_engine', 'Carregando motor FFmpeg...');

    // Dynamic import to avoid loading on homepage
    const { FFmpeg } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/+esm');
    const { toBlobURL } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/+esm');

    const ffmpeg = new FFmpeg() as FFmpegInstance;

    ffmpeg.on('progress', ({ progress }) => {
      if (typeof progress === 'number') {
        // progress is 0-1
        const pct = Math.min(90, Math.round(20 + progress * 70));
        onProgress?.(pct, 'processing', `Processando... ${Math.round(progress * 100)}%`);
      }
    });

    onProgress?.(10, 'loading_engine', 'Baixando motor de conversão...');

    await ffmpeg.load({
      coreURL: await toBlobURL(CORE_URL, 'text/javascript'),
      wasmURL: await toBlobURL(WASM_URL, 'application/wasm'),
    });

    onProgress?.(18, 'loading_engine', 'Motor pronto');
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  try {
    return await loadingPromise;
  } catch (err) {
    loadingPromise = null;
    throw err;
  }
}

function buildFFmpegArgs(
  inputName: string,
  outputName: string,
  inputFormat: string,
  outputFormat: string,
  options: ConversionOptions = {}
): string[] {
  const args: string[] = ['-i', inputName];

  const isVideoOut = ['mp4', 'webm', 'mkv', 'avi', 'mov', 'gif'].includes(outputFormat);
  const isAudioOut = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'opus'].includes(outputFormat);

  // Video options
  if (isVideoOut) {
    // Resolution
    if (options.resolution && options.resolution !== 'original') {
      const resMap: Record<string, string> = {
        '2160p': '3840:2160',
        '1440p': '2560:1440',
        '1080p': '1920:1080',
        '720p': '1280:720',
        '480p': '854:480',
        '360p': '640:360',
      };
      const size = resMap[options.resolution];
      if (size) {
        args.push('-vf', `scale=${size}:force_original_aspect_ratio=decrease`);
      }
    }

    // Video codec
    if (options.videoCodec) {
      const codecMap: Record<string, string> = {
        'h264': 'libx264',
        'h265': 'libx265',
        'vp8': 'libvpx',
        'vp9': 'libvpx-vp9',
        'av1': 'libaom-av1',
      };
      const codec = codecMap[options.videoCodec.toLowerCase()];
      if (codec) args.push('-c:v', codec);
    } else {
      // Defaults by format
      if (outputFormat === 'webm') args.push('-c:v', 'libvpx-vp9');
      else if (outputFormat === 'gif') {
        // special gif handling later
      } else {
        args.push('-c:v', 'libx264');
      }
    }

    // FPS
    if (options.fps && options.fps !== 'original') {
      args.push('-r', options.fps);
    }

    // Bitrate
    if (options.bitrate && options.bitrate !== 'auto') {
      const brMap: Record<string, string> = {
        low: '1000k',
        medium: '2500k',
        high: '5000k',
      };
      const br = brMap[options.bitrate] || options.bitrate;
      args.push('-b:v', br);
    }

    // Audio
    if (options.audioAction === 'remove') {
      args.push('-an');
    } else {
      if (options.audioCodec) {
        const acMap: Record<string, string> = {
          aac: 'aac',
          mp3: 'libmp3lame',
          opus: 'libopus',
          wav: 'pcm_s16le',
        };
        const ac = acMap[options.audioCodec.toLowerCase()];
        if (ac) args.push('-c:a', ac);
      }
      if (options.audioBitrate) {
        args.push('-b:a', options.audioBitrate);
      }
    }
  }

  // Audio-only output
  if (isAudioOut) {
    args.push('-vn'); // no video

    if (outputFormat === 'mp3') {
      args.push('-c:a', 'libmp3lame');
    } else if (outputFormat === 'wav') {
      args.push('-c:a', 'pcm_s16le');
    } else if (outputFormat === 'ogg' || outputFormat === 'opus') {
      args.push('-c:a', 'libopus');
    } else if (outputFormat === 'aac' || outputFormat === 'm4a') {
      args.push('-c:a', 'aac');
    } else if (outputFormat === 'flac') {
      args.push('-c:a', 'flac');
    }

    if (options.audioBitrate || options.bitrate) {
      const br = options.audioBitrate || options.bitrate || '192k';
      args.push('-b:a', typeof br === 'string' && br.includes('k') ? br : `${br}k`);
    }

    if (options.sampleRate) {
      args.push('-ar', options.sampleRate.replace(' Hz', '').replace('Hz', ''));
    }

    if (options.channels === 'mono') {
      args.push('-ac', '1');
    } else if (options.channels === 'stereo') {
      args.push('-ac', '2');
    }
  }

  // GIF special
  if (outputFormat === 'gif') {
    args.push('-vf', 'fps=10,scale=480:-1:flags=lanczos');
  }

  // Overwrite
  args.push('-y', outputName);

  return args;
}

export async function convertWithFFmpeg(params: ConvertParams): Promise<ConversionResult> {
  const { file, inputFormat, outputFormat, options = {}, onProgress, signal } = params;

  try {
    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    const ffmpeg = await loadFFmpeg(onProgress);

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    onProgress?.(20, 'preparing', 'Preparando arquivo...');

    const inputName = `input.${inputFormat}`;
    const outputName = `output.${outputFormat}`;

    const data = new Uint8Array(await file.arrayBuffer());

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    await ffmpeg.writeFile(inputName, data);

    onProgress?.(25, 'processing', 'Iniciando conversão...');

    const args = buildFFmpegArgs(inputName, outputName, inputFormat, outputFormat, options);

    // Listen for abort
    const abortHandler = () => {
      try {
        ffmpeg.terminate();
      } catch {
        // ignore
      }
    };
    signal?.addEventListener('abort', abortHandler);

    try {
      await ffmpeg.exec(args);
    } finally {
      signal?.removeEventListener('abort', abortHandler);
    }

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    onProgress?.(92, 'finalizing', 'Finalizando...');

    const outputData = await ffmpeg.readFile(outputName);
    const mimeMap: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      mkv: 'video/x-matroska',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      gif: 'image/gif',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      aac: 'audio/aac',
      flac: 'audio/flac',
      m4a: 'audio/mp4',
      opus: 'audio/opus',
    };

    const blob = new Blob([outputData], {
      type: mimeMap[outputFormat] || 'application/octet-stream',
    });

    // Cleanup
    try {
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch {
      // ignore cleanup errors
    }

    onProgress?.(100, 'completed', 'Conversão concluída');

    return {
      success: true,
      blob,
      filename: createOutputFilename(file.name, outputFormat),
      mimeType: mimeMap[outputFormat],
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro na conversão com FFmpeg. O arquivo pode ser muito grande ou o formato incompatível.';
    return { success: false, error: message };
  }
}

export function terminateFFmpeg(): void {
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
    } catch {
      // ignore
    }
    ffmpegInstance = null;
    loadingPromise = null;
  }
}

export function isMediaFormat(ext: string): boolean {
  const media = [
    'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'opus',
    'mp4', 'webm', 'mkv', 'avi', 'mov', 'mpeg', 'mpg', 'flv', 'wmv', 'm4v', '3gp', 'ts', 'vob', 'ogv', 'gif',
  ];
  return media.includes(ext.toLowerCase());
}
