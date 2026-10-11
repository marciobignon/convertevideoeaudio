import { FORMAT_INFO, CATEGORY_LABELS } from '../config/conversionMatrix';
import type { FileCategory } from '../types';

export function FormatsPage() {
  const byCategory = Object.values(FORMAT_INFO).reduce(
    (acc, fmt) => {
      if (!acc[fmt.category]) acc[fmt.category] = [];
      acc[fmt.category].push(fmt);
      return acc;
    },
    {} as Record<FileCategory, typeof FORMAT_INFO[string][]>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-foreground dark:text-white">Formatos suportados</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Lista de formatos realmente implementados no Convertei. Apenas conversões com motor real.
      </p>

      {Object.entries(byCategory).map(([cat, formats]) => (
        <section key={cat} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
            {CATEGORY_LABELS[cat as FileCategory]}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                  <th className="py-2 pr-4 font-medium">Formato</th>
                  <th className="py-2 pr-4 font-medium">Entrada</th>
                  <th className="py-2 pr-4 font-medium">Saída</th>
                  <th className="py-2 font-medium">Conversões disponíveis</th>
                </tr>
              </thead>
              <tbody>
                {formats.map((f) => (
                  <tr key={f.extension} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2.5 pr-4 font-medium">{f.label}</td>
                    <td className="py-2.5 pr-4">{f.canRead ? '✓' : '—'}</td>
                    <td className="py-2.5 pr-4">{f.canWrite ? '✓' : '—'}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">
                      {f.outputs.length > 0
                        ? f.outputs.map((o) => o.toUpperCase()).join(', ')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <p className="text-sm text-gray-400 mt-6">
        Novos formatos são adicionados conforme bibliotecas open-source permitem conversões reais no navegador.
      </p>
    </div>
  );
}
