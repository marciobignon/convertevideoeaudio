import type {
  ConvertParams,
  ConversionResult,
  FileInfo,
  ConversionStatus,
  ConversionOptions,
} from '../types';
import { isConversionSupported, getAvailableOutputs } from '../config/conversionMatrix';
import { convertImage, isImageFormat } from '../converters/imageConverter';
import { convertHeic, isHeicFormat } from '../converters/heicConverter';
import { convertWithFFmpeg, isMediaFormat, terminateFFmpeg } from '../converters/ffmpegConverter';
import { convertArchive, createZipFromFiles } from '../converters/archiveConverter';
import { generateId, getExtension, detectCategory, detectMimeType, formatFileSize } from '../utils/fileUtils';

export type ProgressHandler = (
  id: string,
  progress: number,
  status: ConversionStatus,
  message?: string
) => void;

class ConversionEngine {
  private abortControllers = new Map<string, AbortController>();

  createFileInfo(file: File, defaultOutput?: string): FileInfo {
    const ext = getExtension(file.name);
    const category = detectCategory(file);
    const outputs = getAvailableOutputs(ext);
    const outputFormat = defaultOutput && outputs.includes(defaultOutput)
      ? defaultOutput
      : outputs[0] || null;

    return {
      id: generateId(),
      file,
      name: file.name,
      extension: ext,
      mimeType: detectMimeType(file),
      size: file.size,
      category,
      inputFormat: ext,
      outputFormat,
      status: 'idle',
      progress: 0,
      options: {},
    };
  }

  getOutputsFor(inputFormat: string): string[] {
    return getAvailableOutputs(inputFormat);
  }

  isSupported(input: string, output: string): boolean {
    return isConversionSupported(input, output);
  }

  async convert(
    fileInfo: FileInfo,
    onProgress?: ProgressHandler
  ): Promise<ConversionResult> {
    const { id, file, inputFormat, outputFormat, options } = fileInfo;

    if (!outputFormat) {
      return { success: false, error: 'Formato de saída não selecionado' };
    }

    if (!this.isSupported(inputFormat, outputFormat)) {
      return {
        success: false,
        error: `Conversão de ${inputFormat.toUpperCase()} para ${outputFormat.toUpperCase()} não está disponível.`,
      };
    }

    const controller = new AbortController();
    this.abortControllers.set(id, controller);

    const report = (progress: number, status: ConversionStatus, message?: string) => {
      onProgress?.(id, progress, status, message);
    };

    try {
      report(0, 'preparing', 'Preparando...');

      const params: ConvertParams = {
        file,
        inputFormat,
        outputFormat,
        options,
        onProgress: (p, s, m) => report(p, s, m),
        signal: controller.signal,
      };

      let result: ConversionResult;

      if (isHeicFormat(inputFormat)) {
        result = await convertHeic(params);
      } else if (isImageFormat(inputFormat) || (isImageFormat(outputFormat) && inputFormat === 'svg')) {
        result = await convertImage(params);
      } else if (isMediaFormat(inputFormat) || isMediaFormat(outputFormat)) {
        result = await convertWithFFmpeg(params);
      } else if (inputFormat === 'zip' || outputFormat === 'zip') {
        result = await convertArchive(params);
      } else {
        result = {
          success: false,
          error: `Motor de conversão para ${inputFormat} → ${outputFormat} ainda não implementado neste navegador.`,
        };
      }

      if (controller.signal.aborted) {
        return { success: false, error: 'Conversão cancelada' };
      }

      return result;
    } catch (err) {
      if (controller.signal.aborted) {
        return { success: false, error: 'Conversão cancelada' };
      }
      const message = err instanceof Error ? err.message : 'Erro inesperado na conversão';
      return { success: false, error: message };
    } finally {
      this.abortControllers.delete(id);
    }
  }

  cancel(id: string): void {
    const controller = this.abortControllers.get(id);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(id);
    }
  }

  cancelAll(): void {
    for (const [id, controller] of this.abortControllers) {
      controller.abort();
      this.abortControllers.delete(id);
    }
    terminateFFmpeg();
  }

  async convertBatch(
    files: FileInfo[],
    onProgress?: ProgressHandler,
    onFileComplete?: (id: string, result: ConversionResult) => void
  ): Promise<Map<string, ConversionResult>> {
    const results = new Map<string, ConversionResult>();

    for (const fileInfo of files) {
      if (fileInfo.status === 'cancelled') continue;

      const result = await this.convert(fileInfo, onProgress);
      results.set(fileInfo.id, result);
      onFileComplete?.(fileInfo.id, result);
    }

    return results;
  }

  async createZipFromResults(
    items: { blob: Blob; filename: string }[],
    onProgress?: (p: number, msg?: string) => void
  ): Promise<ConversionResult> {
    // Convert blobs back to File-like for JSZip
    const files = items.map(
      (item) => new File([item.blob], item.filename, { type: item.blob.type })
    );
    return createZipFromFiles(files, onProgress);
  }

  cleanup(): void {
    this.cancelAll();
  }
}

export const conversionEngine = new ConversionEngine();
export default conversionEngine;
