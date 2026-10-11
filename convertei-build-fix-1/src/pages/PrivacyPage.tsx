export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-foreground dark:text-white">Política de Privacidade</h1>
      
      <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">Processamento local</h2>
          <p>
            O Convertei prioriza o processamento de arquivos diretamente no seu navegador (client-side).
            Sempre que tecnicamente possível, seus arquivos <strong>não são enviados</strong> para nossos servidores
            nem para serviços de terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">O que não fazemos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Não armazenamos o conteúdo dos seus arquivos permanentemente</li>
            <li>Não vendemos ou compartilhamos dados de arquivos</li>
            <li>Não utilizamos APIs comerciais de conversão que enviam arquivos para terceiros</li>
            <li>Não coletamos o conteúdo dos documentos, vídeos ou imagens</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">Dados que podemos coletar</h2>
          <p>
            Podemos registrar eventos anônimos de uso (ex: conversão iniciada, formato de entrada/saída, erros)
            apenas para melhorar o serviço. Você pode desativar analytics nas configurações quando disponíveis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">Contas de usuário</h2>
          <p>
            Se você criar uma conta no futuro, armazenaremos apenas dados necessários para autenticação
            e histórico de metadados (não o conteúdo dos arquivos).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">Cookies e armazenamento local</h2>
          <p>
            Utilizamos localStorage para preferências (tema claro/escuro) e IndexedDB temporariamente
            quando necessário para processamento. Você pode limpar os dados do site a qualquer momento.
          </p>
        </section>

        <p className="text-sm text-gray-400 pt-4">
          Última atualização: Outubro 2025
        </p>
      </div>
    </div>
  );
}
