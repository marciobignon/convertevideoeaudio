import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="font-bold text-lg">CONVERTEI</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Converta seus arquivos online de forma rápida, simples e segura. Processamento local no navegador.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Conversores</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/video" className="hover:text-primary transition">Vídeo</Link></li>
              <li><Link to="/audio" className="hover:text-primary transition">Áudio</Link></li>
              <li><Link to="/imagem" className="hover:text-primary transition">Imagem</Link></li>
              <li><Link to="/pdf" className="hover:text-primary transition">PDF</Link></li>
              <li><Link to="/ocr" className="hover:text-primary transition">OCR</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/precos" className="hover:text-primary transition">Preços</Link></li>
              <li><Link to="/formatos" className="hover:text-primary transition">Formatos</Link></li>
              <li><Link to="/privacidade" className="hover:text-primary transition">Privacidade</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Privacidade</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Seus arquivos são processados localmente no seu navegador sempre que possível. Não enviamos arquivos para servidores de terceiros.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Convertei. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400">
            Feito com tecnologias open-source · Processamento local
          </p>
        </div>
      </div>
    </footer>
  );
}
