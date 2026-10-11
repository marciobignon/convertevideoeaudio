import type { ConvertParams, ConversionResult, ConversionOptions } from '../types';
import { createOutputFilename } from '../utils/fileUtils';

/**
 * Image conversion using native Canvas API.
 * Fully client-side, no external dependencies.
 */

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  bmp: 'image/bmp',
  gif: 'image/gif',
  ico: 'image/x-icon',
};

function getMime(format: string): string {
  return MIME_MAP[format.toLowerCase()] || 'image/png';
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível carregar a imagem. Arquivo pode estar corrompido.'));
    };
    img.src = url;
  });
}

function applyOptions(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  options: ConversionOptions = {}
): void {
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  // Resize
  if (options.resize) {
    if (typeof options.resize === 'string') {
      const pct = parseInt(options.resize, 10);
      if (!isNaN(pct) && pct > 0 && pct !== 100) {
        width = Math.round((width * pct) / 100);
        height = Math.round((height * pct) / 100);
      }
    } else if (typeof options.resize === 'object') {
      if (options.resize.width) width = options.resize.width;
      if (options.resize.height) height = options.resize.height;
    }
  }

  // Rotation
  const rotate = options.rotate || 0;
  const flip = options.flip;

  canvas.width = rotate === 90 || rotate === 270 ? height : width;
  canvas.height = rotate === 90 || rotate === 270 ? width : height;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (rotate) {
    ctx.rotate((rotate * Math.PI) / 180);
  }

  if (flip === 'horizontal') {
    ctx.scale(-1, 1);
  } else if (flip === 'vertical') {
    ctx.scale(1, -1);
  }

  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.restore();
}

export async function convertImage(params: ConvertParams): Promise<ConversionResult> {
  const { file, outputFormat, options = {}, onProgress, signal } = params;

  try {
    onProgress?.(5, 'preparing', 'Preparando imagem...');

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    onProgress?.(15, 'processing', 'Carregando imagem...');
    const img = await loadImage(file);

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    onProgress?.(40, 'processing', 'Processando...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { success: false, error: 'Canvas não suportado neste navegador' };
    }

    applyOptions(canvas, ctx, img, options);

    onProgress?.(70, 'processing', 'Gerando arquivo...');

    const mime = getMime(outputFormat);
    const quality = options.quality != null ? options.quality / 100 : 0.92;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        mime,
        mime === 'image/jpeg' || mime === 'image/webp' ? quality : undefined
      );
    });

    if (!blob) {
      return { success: false, error: 'Falha ao gerar a imagem convertida' };
    }

    if (signal?.aborted) {
      return { success: false, error: 'Conversão cancelada' };
    }

    onProgress?.(95, 'finalizing', 'Finalizando...');

    const filename = createOutputFilename(file.name, outputFormat);

    onProgress?.(100, 'completed', 'Conversão concluída');

    return {
      success: true,
      blob,
      filename,
      mimeType: mime,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido na conversão de imagem';
    return { success: false, error: message };
  }
}

export function isImageFormat(ext: string): boolean {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'ico', 'svg'].includes(ext.toLowerCase());
}

/** Returns true for regular images (not HEIC) */
export function isRegularImageFormat(ext: string): boolean {
  return isImageFormat(ext);
}
