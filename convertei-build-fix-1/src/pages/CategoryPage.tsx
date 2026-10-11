import { useEffect } from 'react';
import { Converter } from '../components/Converter';
import type { FileCategory } from '../types';
import { CATEGORY_LABELS } from '../config/conversionMatrix';

interface CategoryPageProps {
  category: FileCategory;
  title?: string;
  defaultOutput?: string;
}

const CATEGORY_META: Record<string, { title: string; subtitle: string; accept?: string }> = {
  video: {
    title: 'Conversor de Vídeo Online',
    subtitle: 'Converta MP4, WEBM, MOV, AVI, MKV e mais formatos de vídeo.',
    accept: 'video/*,.mp4,.webm,.mov,.avi,.mkv,.flv,.wmv,.mpeg,.mpg,.m4v,.3gp,.ts,.vob,.ogv',
  },
  audio: {
    title: 'Conversor de Áudio Online',
    subtitle: 'Converta MP3, WAV, FLAC, OGG, AAC e outros formatos de áudio.',
    accept: 'audio/*,.mp3,.wav,.flac,.ogg,.aac,.m4a,.opus,.aiff,.wma',
  },
  image: {
    title: 'Conversor de Imagens Online',
    subtitle: 'Converta JPG, PNG, WEBP, GIF, BMP e mais. Redimensione e ajuste qualidade.',
    accept: 'image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.ico,.svg,.heic,.heif',
  },
  document: {
    title: 'Conversor de Documentos Online',
    subtitle: 'Converta PDF, TXT, HTML e formatos de documento suportados.',
    accept: '.pdf,.txt,.html,.csv,.rtf',
  },
  archive: {
    title: 'Compactar e Extrair Arquivos',
    subtitle: 'Crie arquivos ZIP ou extraia o conteúdo de ZIPs.',
    accept: '.zip,application/zip',
  },
  ebook: {
    title: 'Conversor de E-books',
    subtitle: 'Conversões de e-books (suporte limitado no momento).',
  },
  font: {
    title: 'Conversor de Fontes',
    subtitle: 'Conversões de fontes TTF, OTF, WOFF (em desenvolvimento).',
  },
  cad: {
    title: 'Conversor CAD',
    subtitle: 'Conversões CAD (em desenvolvimento).',
  },
};

export function CategoryPage({ category, title, defaultOutput }: CategoryPageProps) {
  const meta = CATEGORY_META[category] || {
    title: `Conversor de ${CATEGORY_LABELS[category]}`,
    subtitle: 'Converta seus arquivos online.',
  };

  useEffect(() => {
    document.title = `${title || meta.title} | Convertei`;
  }, [title, meta.title]);

  return (
    <section className="py-10 sm:py-14 px-4">
      <Converter
        title={title || meta.title}
        subtitle={meta.subtitle}
        accept={meta.accept}
      />

      {/* SEO content */}
      <div className="max-w-3xl mx-auto mt-16 prose prose-sm dark:prose-invert text-gray-500 dark:text-gray-400">
        <h2 className="text-lg font-semibold text-foreground dark:text-white">
          Como converter {CATEGORY_LABELS[category].toLowerCase()} online
        </h2>
        <ol className="list-decimal list-inside space-y-1 mt-3">
          <li>Arraste ou selecione o arquivo</li>
          <li>Escolha o formato de saída</li>
          <li>Clique em Converter</li>
          <li>Baixe o resultado</li>
        </ol>
        <p className="mt-4">
          O Convertei processa seus arquivos localmente no navegador sempre que possível,
          garantindo privacidade e velocidade.
        </p>
      </div>
    </section>
  );
}
