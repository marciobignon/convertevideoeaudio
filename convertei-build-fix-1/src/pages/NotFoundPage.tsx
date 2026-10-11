import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold text-foreground dark:text-white mb-2">
        Ops! Essa página não foi encontrada.
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <Link to="/" className="btn-primary">
        Voltar para o conversor
      </Link>
    </div>
  );
}
