export function PricingPage() {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      features: [
        'Conversões básicas',
        'Até 500 MB por arquivo',
        'Processamento local',
        'Sem cadastro obrigatório',
        'Conversões limitadas por sessão',
      ],
      cta: 'Começar agora',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 'Em breve',
      period: '',
      features: [
        'Arquivos maiores',
        'Conversão em lote avançada',
        'Histórico de conversões',
        'Recursos avançados',
        'Prioridade no processamento',
      ],
      cta: 'Em breve',
      highlight: true,
    },
    {
      name: 'Empresa',
      price: 'Em breve',
      period: '',
      features: [
        'Limites elevados',
        'Processamento avançado',
        'Recursos administrativos',
        'Suporte prioritário',
        'API (futuro)',
      ],
      cta: 'Em breve',
      highlight: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground dark:text-white">Planos</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Comece grátis. Planos pagos em breve com mais recursos.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 flex flex-col ${
              plan.highlight ? 'ring-2 ring-primary shadow-soft' : ''
            }`}
          >
            <h2 className="text-lg font-bold text-foreground dark:text-white">{plan.name}</h2>
            <div className="mt-3 mb-6">
              <span className="text-3xl font-bold text-foreground dark:text-white">{plan.price}</span>
              {plan.period && (
                <span className="text-sm text-gray-400 ml-1">/ {plan.period}</span>
              )}
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={plan.highlight ? 'btn-primary w-full' : 'btn-secondary w-full'}
              disabled={plan.cta === 'Em breve'}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        Cobrança real ainda não implementada. Esta é a estrutura preparada para o futuro.
      </p>
    </div>
  );
}
