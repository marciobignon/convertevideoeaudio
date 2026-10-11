import JSZip from 'jszip';
import type { ConvertParams, ConversionResult } from '../types';
import { createOutputFilename, sanitizeFilename } from '../utils/fileUtils';

/**
 * Archive conversion using JSZip.
 * Supports creating ZIP from multiple files and extracting ZIP.
 */

export async function createZipFromFiles(
  files: File[],
  onProgress?: (progress: number, message?: string) => void
): Promise<ConversionResult> {
  try {
    onProgress?.(5, 'Preparando arquivos...');
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = sanitizeFilename(file.name) || `file_${i}`;
      zip.file(name, file);
      onProgress?.(10 + Math.round((i / files.length) * 60), `Adicionando ${name}...`);
    }

    onProgress?.(75, 'Gerando ZIP...');

    const blob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (meta) => {
        onProgress?.(75 + Math.round(meta.percent * 0.2), 'Compactando...');
      }
    );

    onProgress?.(100, 'ZIP criado');

    return {
      success: true,
      blob,
      filename: `arquivos_${Date.now()}.zip`,
      mimeType: 'application/zip',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar ZIP';
    return { success: false, error: message };
  }
}

export async function extractZip(
  file: File,
  onProgress?: (progress: number, message?: string) => void
): Promise<{ success: boolean; files?: { name: string; blob: Blob }[]; error?: string }> {
  try {
    onProgress?.(10, 'Lendo ZIP...');
    const zip = await JSZip.loadAsync(file);
    const entries = Object.keys(zip.files).filter((k) => !zip.files[k].dir);

    if (entries.length === 0) {
      return { success: false, error: 'O arquivo ZIP está vazio' };
    }

    // Protection against zip bombs - limit entries and total size
    if (entries.length > 500) {
      return { success: false, error: 'ZIP contém muitos arquivos (limite: 500)' };
    }

    const result: { name: string; blob: Blob }[] = [];
    let totalSize = 0;
    const MAX_TOTAL = 500 * 1024 * 1024; // 500MB extracted

    for (let i = 0; i < entries.length; i++) {
      const name = entries[i];
      const entry = zip.files[name];
      const blob = await entry.async('blob');
      totalSize += blob.size;

      if (totalSize > MAX_TOTAL) {
        return { success: false, error: 'Conteúdo extraído excede o limite de segurança' };
      }

      result.push({ name: sanitizeFilename(name) || `file_${i}`, blob });
      onProgress?.(20 + Math.round((i / entries.length) * 70), `Extraindo ${name}...`);
    }

    onProgress?.(100, 'Extração concluída');
    return { success: true, files: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao extrair ZIP';
    return { success: false, error: message };
  }
}

export async function convertArchive(params: ConvertParams): Promise<ConversionResult> {
  const { file, outputFormat, onProgress } = params;

  if (outputFormat === 'zip') {
    // Single file to ZIP
    return createZipFromFiles([file], (p, m) => onProgress?.(p, 'processing', m));
  }

  return {
    success: false,
    error: `Conversão de arquivo para ${outputFormat} não suportada neste momento.`,
  };
}
