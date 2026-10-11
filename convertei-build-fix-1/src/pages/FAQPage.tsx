const faqs = [
  {
    q: 'Como converter um arquivo?',
    a: 'Arraste o arquivo para a área de upload ou clique em "Selecionar arquivos". Escolha o formato de saída e clique em Converter. Quando terminar, baixe o resultado.',
  },
  {
    q: 'É gratuito?',
    a: 'Sim. O plano gratuito permite conversões básicas com limite de tamanho. Planos pagos com mais recursos estão previstos para o futuro.',
  },
  {
    q: 'Preciso instalar algum programa?',
    a: 'Não. Tudo funciona no navegador. Você também pode instalar o Convertei como aplicativo (PWA) na tela inicial do celular ou computador.',
  },
  {
    q: 'Meus arquivos são enviados para algum servidor?',
    a: 'Sempre que possível, o processamento ocorre localmente no seu navegador. Não utilizamos APIs comerciais que enviam seus arquivos para terceiros.',
  },
  {
    q: 'Posso converter no celular?',
    a: 'Sim. O Convertei é responsivo e funciona em smartphones e tablets. Em dispositivos com pouca memória, arquivos muito grandes podem falhar.',
  },
  {
    q: 'Posso converter vários arquivos?',
    a: 'Sim. Selecione múltiplos arquivos, escolha o formato de saída e converta todos. Depois você pode baixar tudo em um único ZIP.',
  },
  {
    q: 'Quais formatos são suportados?',
    a: 'Imagens (JPG, PNG, WEBP, GIF, BMP...), áudio e vídeo via FFmpeg WASM (MP4, WEBM, MP3, WAV...), ZIP e mais. Veja a página Formatos para a lista completa e atualizada.',
  },
  {
    q: 'Quanto tempo demora?',
    a: 'Depende do tamanho do arquivo, do formato e do desempenho do seu dispositivo. Conversões de imagem são quase instantâneas. Vídeos maiores podem levar alguns minutos.',
  },
  {
    q: 'O que fazer quando uma conversão não é suportada?',
    a: 'O sistema informa claramente quando uma conversão não está disponível. Não geramos arquivos inválidos. Novos formatos são adicionados progressivamente.',
  },
  {
    q: 'Por que algumas conversões de vídeo/áudio demoram para iniciar?',
    a: 'O motor FFmpeg (WebAssembly) é carregado sob demanda apenas quando necessário, para manter a página inicial leve e rápida.',
  },
];

export function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-foreground dark:text-white">Perguntas frequentes</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="card p-5 group"
          >
            <summary className="font-semibold text-foreground dark:text-white cursor-pointer list-none flex items-center justify-between">
              {faq.q}
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
