import { Link } from 'react-router-dom';
import { Converter } from '../components/Converter';

const categories = [
  { path: '/video', label: 'Vídeo', icon: '🎬', desc: 'MP4, WEBM, MOV, AVI...' },
  { path: '/audio', label: 'Áudio', icon: '🎵', desc: 'MP3, WAV, FLAC, OGG...' },
  { path: '/imagem', label: 'Imagem', icon: '🖼️', desc: 'JPG, PNG, WEBP, GIF...' },
  { path: '/pdf', label: 'PDF', icon: '📄', desc: 'PDF ↔ Imagens, texto...' },
  { path: '/ocr', label: 'OCR', icon: '🔍', desc: 'Imagem → Texto' },
  { path: '/arquivos', label: 'Arquivos', icon: '📦', desc: 'ZIP, compactar...' },
];

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-10 sm:pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white tracking-tight leading-tight">
            Converta seus arquivos para o formato que você precisa
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Vídeos, áudios, imagens, documentos e muito mais. Rápido, simples e direto no navegador.
          </p>
        </div>

        <Converter />
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 text-foreground dark:text-white">
            Mais de dezenas de formatos disponíveis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="card p-4 text-center hover:shadow-soft hover:-translate-y-0.5 transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <p className="font-semibold text-sm text-foreground dark:text-white">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-foreground dark:text-white">
            Por que usar o Convertei?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Processamento local',
                desc: 'Seus arquivos ficam no seu dispositivo. Conversões de imagem e muitas outras rodam direto no navegador.',
                icon: '🔒',
              },
              {
                title: 'Rápido e simples',
                desc: 'Arraste, escolha o formato e baixe. Sem cadastro obrigatório para conversões básicas.',
                icon: '⚡',
              },
              {
                title: 'Sem instalação',
                desc: 'Funciona no computador, tablet e celular. Também pode ser instalado como aplicativo (PWA).',
                icon: '📱',
              },
              {
                title: 'Múltiplos arquivos',
                desc: 'Converta vários arquivos de uma vez e baixe tudo em um ZIP.',
                icon: '📦',
              },
              {
                title: 'Código aberto',
                desc: 'Utilizamos bibliotecas open-source. Sem APIs comerciais de conversão.',
                icon: '🧩',
              },
              {
                title: 'Privacidade primeiro',
                desc: 'Não armazenamos seus arquivos. Não coletamos o conteúdo dos documentos.',
                icon: '🛡️',
              },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-foreground dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
