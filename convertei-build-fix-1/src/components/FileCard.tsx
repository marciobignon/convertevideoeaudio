import type { FileInfo } from '../types';
import { formatFileSize } from '../utils/fileUtils';
import { getAvailableOutputs, getFormatLabel, CATEGORY_LABELS } from '../config/conversionMatrix';

interface FileCardProps {
  file: FileInfo;
  onRemove: (id: string) => void;
  onOutputChange: (id: string, format: string) => void;
  onConvert: (id: string) => void;
  onDownload: (id: string) => void;
  onCancel: (id: string) => void;
  onOptionsChange?: (id: string, options: Record<string, unknown>) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  video: '🎬',
  audio: '🎵',
  image: '🖼️',
  document: '📄',
  archive: '📦',
  ebook: '📚',
  font: '🔤',
  cad: '📐',
  unknown: '📎',
};

const STATUS_LABELS: Record<string, string> = {
  idle: '',
  queued: 'Na fila',
  preparing: 'Preparando arquivo...',
  loading_engine: 'Carregando motor de conversão...',
  processing: 'Processando...',
  finalizing: 'Finalizando...',
  completed: 'Conversão concluída',
  error: 'Erro',
  cancelled: 'Cancelado',
};

export function FileCard({
  file,
  onRemove,
  onOutputChange,
  onConvert,
  onDownload,
  onCancel,
}: FileCardProps) {
  const outputs = getAvailableOutputs(file.inputFormat);
  const isBusy = ['preparing', 'loading_engine', 'processing', 'finalizing', 'queued'].includes(file.status);
  const isDone = file.status === 'completed';
  const isError = file.status === 'error';

  return (
    <div className="card p-4 sm:p-5 transition-all hover:shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="text-3xl flex-shrink-0" aria-hidden="true">
            {CATEGORY_ICONS[file.category] || '📎'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground dark:text-white truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {formatFileSize(file.size)} · {CATEGORY_LABELS[file.category]}
            </p>

            {/* Format selector */}
            {!isDone && !isBusy && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200">
                  {getFormatLabel(file.inputFormat)}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <select
                  value={file.outputFormat || ''}
                  onChange={(e) => onOutputChange(file.id, e.target.value)}
                  className="input py-1.5 text-sm w-auto min-w-[100px]"
                  aria-label="Formato de saída"
                >
                  {outputs.length === 0 ? (
                    <option value="">Indisponível</option>
                  ) : (
                    outputs.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {getFormatLabel(fmt)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            {/* Progress */}
            {isBusy && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {STATUS_LABELS[file.status] || 'Convertendo...'}
                  </span>
                  <span className="font-medium text-primary">{file.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300 progress-animate"
                    style={{ width: `${file.progress}%` }}
                    role="progressbar"
                    aria-valuenow={file.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}

            {/* Success */}
            {isDone && (
              <div className="mt-3 flex items-center gap-2 text-success">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">
                  {file.resultName} {file.resultBlob && `(${formatFileSize(file.resultBlob.size)})`}
                </span>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-error text-sm">
                <p className="font-medium">Não foi possível converter este arquivo.</p>
                <p className="mt-1 text-red-600/80 dark:text-red-300/80">{file.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
          {isBusy && (
            <button
              onClick={() => onCancel(file.id)}
              className="btn-secondary text-sm py-2 px-3"
              aria-label="Cancelar conversão"
            >
              Cancelar
            </button>
          )}

          {isDone && (
            <button
              onClick={() => onDownload(file.id)}
              className="btn-success text-sm py-2 px-4"
            >
              Baixar
            </button>
          )}

          {!isBusy && !isDone && file.outputFormat && (
            <button
              onClick={() => onConvert(file.id)}
              className="btn-primary text-sm py-2 px-4"
              disabled={!file.outputFormat}
            >
              Converter
            </button>
          )}

          {!isBusy && (
            <button
              onClick={() => onRemove(file.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              aria-label="Remover arquivo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
