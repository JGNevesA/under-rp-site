const RulesSection = () => {
  const ruleCategories = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: 'Anti-RP',
      description: 'O que dá ban na hora',
      rules: [
        'Comprar briga sem motivo (RDM)',
        'Atropelar as pessoas à toa (VDM)',
        'Misturar vida real com o jogo (Meta)',
        'Powergaming é passível de punição',
        'Combat Logging = Ban temporário',
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Comunicação',
      description: 'Como trocar ideia',
      rules: [
        'Respeito com todo mundo na cidade',
        'Não foca no OOC no meio do RP',
        'Saiba a hora de mandar mensagem',
        'Evite informações OOC no IC',
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Precisando de Ajuda',
      description: 'Como chamar os Deuses',
      rules: [
        'Use o mental mentalize a Staff',
        'Dúvidas pesadas? Chama no Ticket',
        'Não fica chorando no /report atoa',
        'Aguarde resposta com paciência',
        'Forneça provas quando necessário',
      ],
    },
  ];

  return (
    <section id="regras" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 mt-4" style={{ fontFamily: 'var(--font-headline)' }}>
            Regras da <span className="gold-text">Cidade</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pra cidade fluir legal e todo mundo se divertir fazendo aquele RP brabo, tem que andar na linha. Dá uma lida aqui antes de tomar punição de bobeira.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {ruleCategories.map((category, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 neon-border gold-border group hover:scale-[1.02] transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>{category.title}</h3>
              <p className="text-gray-400 mb-6">{category.description}</p>

              {/* Rules List */}
              <ul className="space-y-3">
                {category.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Warning Banner */}
        <div className="mt-12 glass-card rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-subtitle)' }}>Aviso da Staff</h4>
              <p className="text-gray-400">
                Se pisar na bola ou cometer Anti-RP, vai de ralo (kick ou ban). Tem dúvida de algo que pode ou não fazer? Abre um ticket no Discord antes de fazer besteira in-game.
              </p>
            </div>
            <a
              href="https://discord.com/channels/1460473286264750349/1487647967711330366"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-gray-700 text-white font-medium hover:bg-white/5 transition-colors flex-shrink-0 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Regras Completas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
