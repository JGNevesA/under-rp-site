import { Link } from 'react-router-dom';

const SupportSection = () => {
  const supportOptions = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Chat ao Vivo',
      description: 'Converse diretamente com nossa equipe de suporte em tempo real.',
      action: 'Iniciar Chat',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      href: 'https://discord.com/channels/1460473286264750349/1480725578817732749',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      title: 'Abrir Ticket',
      description: 'Crie um ticket para problemas técnicos, denúncias ou apelos de ban.',
      action: 'Novo Ticket / Apelo',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      to: '/bans',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Base de Conhecimento',
      description: 'Encontre respostas para as perguntas mais frequentes.',
      action: 'Ver FAQ',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    },

  ];

  const faqItems = [
    {
      question: 'Como faço para entrar no servidor?',
      answer: 'Você precisa completar o processo de whitelist em nosso Discord e ter o GTA V original na Steam.',
    },
    {
      question: 'Posso trocar meus benefícios?',
      answer: 'Benefícios de doações não são transferíveis entre contas, mas podem ser trocados dentro do jogo.',
    },
    {
      question: 'Quais são os requisitos mínimos?',
      answer: 'GTA V original, FiveM instalado, microfone funcional e idade mínima de 16 anos.',
    },
    {
      question: 'Como reportar um jogador?',
      answer: 'Use o comando /report no jogo ou abra um ticket em nosso Discord com provas.',
    },
    {
      question: 'Como funciona o sistema de doações?',
      answer: 'As doações são processadas automaticamente e os benefícios são entregues em até 24 horas.',
    },
    {
      question: 'O servidor tem wipe?',
      answer: 'Realizamos wipes parciais a cada 3-4 meses para manter a economia balanceada.',
    },
  ];

  return (
    <section id="suporte" className="py-24 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-indigo-950/10 to-black/0" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-violet-400 font-medium">Central de Ajuda</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
            Precisa de <span className="gradient-text">Ajuda</span>?
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Nossa equipe está pronta para ajudar você. Escolha a melhor forma de entrar em contato.
          </p>
        </div>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {supportOptions.map((option, index) => {
            const CardWrapper = option.href || option.to ? (option.to ? Link : 'a') : 'div';
            const extraProps = option.href 
              ? { href: option.href, target: '_blank', rel: 'noopener noreferrer' } 
              : option.to ? { to: option.to } : {};
            return (
              <CardWrapper
                key={index}
                {...extraProps as any}
                className="group bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1 cursor-pointer block no-underline"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${option.iconBg} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {option.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>{option.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{option.description}</p>

                {/* Action */}
                <div className="flex items-center gap-1 text-violet-400 font-medium text-sm group-hover:gap-2 transition-all">
                  <span>{option.action}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10" style={{ fontFamily: 'var(--font-headline)' }}>
              Perguntas Frequentes
            </h3>

            {/* FAQ Grid */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-white/10 pb-6">
                  <h4 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'var(--font-subtitle)' }}>{item.question}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Ver todas as perguntas
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Discord CTA Bar */}
          <div className="mt-6 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Ainda com dúvidas?</p>
                <p className="text-gray-400 text-sm">Entre em nosso Discord para suporte em tempo real</p>
              </div>
            </div>
            <a
              href="https://discord.gg/m7U6u9dtyw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#5865F2]/30"
              style={{ backgroundColor: '#5865F2' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Entrar no Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
