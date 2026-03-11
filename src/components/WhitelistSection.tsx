import { User } from '../App';

interface WhitelistSectionProps {
  user: User | null;
}

const WhitelistSection = ({ user }: WhitelistSectionProps) => {
  const steps = [
    {
      number: '01',
      title: 'Crie sua Conta',
      description: 'Registre-se usando sua conta do Discord para sincronizar seus dados.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Leia as Regras',
      description: 'Familiarize-se com todas as regras e diretrizes do servidor.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Complete o Questionário',
      description: 'Responda perguntas sobre RP para demonstrar seu conhecimento.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Aguarde Aprovação',
      description: 'Nossa equipe analisará sua aplicação em até 24 horas.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="whitelist" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-4">
            Whitelist
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Entre para a <span className="gradient-text">Comunidade</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Complete o processo de whitelist para acessar o servidor e começar sua jornada em Los Santos.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent" />
              )}

              <div className="glass-card rounded-2xl p-6 h-full hover:scale-[1.02] transition-all duration-300 neon-border">
                {/* Step Number */}
                <span className="text-5xl font-black gradient-text opacity-20 absolute top-4 right-4">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 text-white">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Whitelist Form Preview */}
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto glow-violet">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Pronto para começar?</h3>
            <p className="text-gray-400">
              Clique no botão abaixo para iniciar o processo de whitelist
            </p>
          </div>

          {/* Requirements */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-300">Idade mínima 16 anos</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-300">Conhecimento básico de RP</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-300">Conta Discord verificada</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discord.com/channels/1460473286264750349/1480449093728735314"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl gold-gradient font-bold text-black text-lg transition-all duration-300 hover:scale-105 glow-gold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Iniciar Whitelist
            </a>
            {user?.discord_id && (
              <a
                href="https://discord.gg/3f3fQcCu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-700 font-semibold text-white text-lg transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#5865F2' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Entrar no Discord
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhitelistSection;
