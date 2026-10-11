/**
 * HEIC / HEIF converter using heic2any (loaded on demand from CDN).
 * Converts HEIC/HEIF → JPG / PNG / WEBP
 */

import type { ConvertParams, ConversionResult } from '../types';
import { createOutputFilename } from '../utils/fileUtils';

let heic2anyLoaded: any = null;

async function loadHeic2Any(
  onProgress?: (progress: number, status: string, message?: string) => void
): Promise<any> {
  if (heic2anyLoaded) return heic2anyLoaded;

  onProgress?.(5, 'loading_engine', 'Carregando conversor HEIC...');

  // Load only from CDN - never try to resolve 'heic2any' as npm package at build time
  const module = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/+esm');
  heic2anyLoaded = module.default || module;
  onProgress?.(15, 'loading_engine', 'Conversor HEIC pronto');
  return heic2anyLoaded;
}

export async function convertHeic(params: ConvertParams): Promise<ConversionResult> {
  const { file, outputFormat, options = {}, onProgress, signal } = params;

  try {
    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    const heic2any = await loadHeic2Any(onProgress);

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    onProgress?.(25, 'processing', 'Convertendo HEIC...');

    const formatMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    const toType = formatMap[outputFormat.toLowerCase()] || 'image/jpeg';
    const quality = options.quality != null ? options.quality / 100 : 0.92;

    const result = await heic2any({
      blob: file,
      toType,
      quality,
    });

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    const blob = Array.isArray(result) ? result[0] : result;

    if (!blob || !(blob instanceof Blob)) {
      return { success: false, error: 'Falha ao converter arquivo HEIC' };
    }

    onProgress?.(90, 'finalizing', 'Finalizando...');

    const filename = createOutputFilename(file.name, outputFormat);

    onProgress?.(100, 'completed', 'Conversão concluída');

    return {
      success: true,
      blob,
      filename,
      mimeType: toType,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao converter HEIC. O arquivo pode estar corrompido ou o formato não é suportado.';
    return { success: false, error: message };
  }
}

export function isHeicFormat(ext: string): boolean {
  return ['heic', 'heif'].includes(ext.toLowerCase());
}
