import { useState, useCallback, useRef } from 'react';
import type { FileInfo, ConversionResult, ConversionOptions } from '../types';
import { conversionEngine } from '../services/ConversionEngine';
import { downloadBlob, createObjectURL, revokeObjectURL } from '../utils/fileUtils';
import { MAX_FILE_SIZE_FREE, MAX_BATCH_FILES } from '../config/conversionMatrix';

export function useConverter() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const objectUrls = useRef<string[]>([]);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const list = Array.from(newFiles);
    if (files.length + list.length > MAX_BATCH_FILES) {
      alert(`Máximo de ${MAX_BATCH_FILES} arquivos por vez.`);
      return;
    }

    const valid: FileInfo[] = [];
    for (const file of list) {
      if (file.size > MAX_FILE_SIZE_FREE) {
        alert(`Arquivo "${file.name}" excede o limite de 500 MB.`);
        continue;
      }
      valid.push(conversionEngine.createFileInfo(file));
    }

    setFiles((prev) => [...prev, ...valid]);
  }, [files.length]);

  const removeFile = useCallback((id: string) => {
    conversionEngine.cancel(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    conversionEngine.cancelAll();
    objectUrls.current.forEach(revokeObjectURL);
    objectUrls.current = [];
    setFiles([]);
    setIsConverting(false);
  }, []);

  const setOutputFormat = useCallback((id: string, format: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, outputFormat: format, status: 'idle', progress: 0, error: undefined, resultBlob: undefined } : f
      )
    );
  }, []);

  const setOptions = useCallback((id: string, options: ConversionOptions) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, options: { ...f.options, ...options } } : f))
    );
  }, []);

  const convertOne = useCallback(async (id: string) => {
    setIsConverting(true);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'preparing', progress: 0, error: undefined } : f
      )
    );

    const fileInfo = files.find((f) => f.id === id);
    if (!fileInfo) {
      setIsConverting(false);
      return;
    }

    const result = await conversionEngine.convert(fileInfo, (fid, progress, status, message) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fid ? { ...f, progress, status, error: status === 'error' ? message : undefined } : f
        )
      );
    });

    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        if (result.success && result.blob) {
          return {
            ...f,
            status: 'completed',
            progress: 100,
            resultBlob: result.blob,
            resultName: result.filename,
          };
        }
        return {
          ...f,
          status: 'error',
          progress: 0,
          error: result.error || 'Falha na conversão',
        };
      })
    );

    setIsConverting(false);
  }, [files]);

  const convertAll = useCallback(async () => {
    setIsConverting(true);
    const pending = files.filter((f) => f.status !== 'completed' && f.outputFormat);

    for (const fileInfo of pending) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileInfo.id ? { ...f, status: 'queued', progress: 0 } : f
        )
      );
    }

    for (const fileInfo of pending) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileInfo.id ? { ...f, status: 'preparing', progress: 0 } : f
        )
      );

      const current = files.find((f) => f.id === fileInfo.id) || fileInfo;
      const result = await conversionEngine.convert(
        { ...current, options: current.options },
        (fid, progress, status) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === fid ? { ...f, progress, status } : f))
          );
        }
      );

      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== fileInfo.id) return f;
          if (result.success && result.blob) {
            return {
              ...f,
              status: 'completed',
              progress: 100,
              resultBlob: result.blob,
              resultName: result.filename,
            };
          }
          return {
            ...f,
            status: 'error',
            progress: 0,
            error: result.error || 'Falha na conversão',
          };
        })
      );
    }

    setIsConverting(false);
  }, [files]);

  const downloadFile = useCallback((id: string) => {
    const f = files.find((x) => x.id === id);
    if (f?.resultBlob && f.resultName) {
      downloadBlob(f.resultBlob, f.resultName);
    }
  }, [files]);

  const downloadAllAsZip = useCallback(async () => {
    const completed = files.filter((f) => f.status === 'completed' && f.resultBlob && f.resultName);
    if (completed.length === 0) return;

    const items = completed.map((f) => ({
      blob: f.resultBlob!,
      filename: f.resultName!,
    }));

    const result = await conversionEngine.createZipFromResults(items);
    if (result.success && result.blob) {
      downloadBlob(result.blob, result.filename || 'convertei_arquivos.zip');
    }
  }, [files]);

  const cancel = useCallback((id: string) => {
    conversionEngine.cancel(id);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'cancelled', progress: 0 } : f
      )
    );
  }, []);

  return {
    files,
    isConverting,
    addFiles,
    removeFile,
    clearAll,
    setOutputFormat,
    setOptions,
    convertOne,
    convertAll,
    downloadFile,
    downloadAllAsZip,
    cancel,
  };
}
