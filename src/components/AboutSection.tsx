const AboutSection = () => {
  const features = [
    'Sistema de economia realista e balanceado',
    'Mais de 200 empregos legais e ilegais',
    'Sistema de facções exclusivo',
    'Mecânicas de roleplay avançadas',
    'Suporte 24/7 com equipe dedicada',
    'Comunidade ativa e acolhedora',
    'Eventos semanais com premiações',
    'Veículos e propriedades exclusivas',
  ];

  const stats = [
    { value: '50K+', label: 'Jogadores Registrados' },
    { value: '2+', label: 'Anos Online' },
    { value: '99.9%', label: 'Uptime Garantido' },
    { value: '24/7', label: 'Suporte Ativo' },
  ];

  return (
    <section id="sobre" className="py-24 px-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2064)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-[#07070a]/95 to-[#07070a]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4">
            A Cidade
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
            <span className="gradient-text">Bem-vindo a UNDER RP</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            O servidor de roleplay que mais cresce no Brasil. Aqui o RP é sério, a economia é equilibrada e a diversão é garantida.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-white" style={{ fontFamily: 'var(--font-subtitle)' }}>
                Por que escolher o <span className="gold-text">UNDER RP</span>?
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="glass-card rounded-xl p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold gold-text mb-1" style={{ fontFamily: 'var(--font-headline)' }}>{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 neon-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>Host BR Premium</h4>
                  <p className="text-gray-400">FPS cravado e ping liso. Infraestrutura de ponta pra você jogar sem ter dor de cabeça.</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 neon-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>Staff Presente</h4>
                  <p className="text-gray-400">Equipe online e pronta pra atender chamado na hora. Aqui a gente valoriza o seu RP justo.</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 neon-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>Novidades toda semana</h4>
                  <p className="text-gray-400">A cidade não para! Scripts novos, melhorias e carros inéditos chegando sempre.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
