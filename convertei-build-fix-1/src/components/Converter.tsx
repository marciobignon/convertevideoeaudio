import { Dropzone } from './Dropzone';
import { FileCard } from './FileCard';
import { useConverter } from '../hooks/useConverter';

interface ConverterProps {
  title?: string;
  subtitle?: string;
  accept?: string;
  defaultCategory?: string;
}

export function Converter({
  title = 'Conversor de arquivos online',
  subtitle = 'Converta áudio, vídeo, imagens, documentos e muito mais.',
  accept,
}: ConverterProps) {
  const {
    files,
    isConverting,
    addFiles,
    removeFile,
    clearAll,
    setOutputFormat,
    convertOne,
    convertAll,
    downloadFile,
    downloadAllAsZip,
    cancel,
  } = useConverter();

  const completedCount = files.filter((f) => f.status === 'completed').length;
  const hasPending = files.some((f) => f.status === 'idle' && f.outputFormat);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Dropzone or file list */}
      {files.length === 0 ? (
        <Dropzone onFiles={addFiles} accept={accept} />
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onRemove={removeFile}
              onOutputChange={setOutputFormat}
              onConvert={convertOne}
              onDownload={downloadFile}
              onCancel={cancel}
            />
          ))}

          {/* Batch actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => document.getElementById('add-more-input')?.click()}
                className="btn-secondary text-sm"
              >
                + Adicionar mais
              </button>
              <input
                id="add-more-input"
                type="file"
                multiple
                className="hidden"
                accept={accept}
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
              <button onClick={clearAll} className="btn-secondary text-sm text-error">
                Limpar arquivos
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {completedCount > 1 && (
                <button onClick={downloadAllAsZip} className="btn-success text-sm">
                  Baixar todos (ZIP)
                </button>
              )}
              {hasPending && (
                <button
                  onClick={convertAll}
                  disabled={isConverting}
                  className="btn-primary text-sm"
                >
                  {isConverting ? 'Convertendo...' : 'Converter todos'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        🔒 Seus arquivos são processados localmente no seu navegador sempre que possível.
        Não enviamos conteúdo para servidores de terceiros.
      </p>
    </div>
  );
}
