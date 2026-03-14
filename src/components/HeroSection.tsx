import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onOpenQueue: () => void;
}

const HeroSection = ({ onOpenQueue }: HeroSectionProps) => {
  const [stats, setStats] = useState({
    players: 246,
    ping: 15,
    uptime: 99.9,
  });

  // Simulated live stats update
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        players: Math.floor(Math.random() * 30) + 230,
        ping: Math.floor(Math.random() * 10) + 10,
        uptime: 99.9,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-green-400 text-sm font-medium">Servidor Online</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent drop-shadow-2xl">
            UNDER
          </span>
          <span className="text-white ml-4">RP</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Sua nova vida começa aqui. Faça sua história no maior e mais completo 
          <span className="text-violet-400"> Roleplay de Los Santos</span>.
        </p>

        {/* Server Stats Widget */}
        <div className="inline-flex flex-col items-center gap-6 px-8 py-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl mb-12">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Players Online */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-400 text-sm">Cidadãos na Cidade</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.players}</p>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Ping */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <span className="text-gray-400 text-sm">Ping</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.ping}<span className="text-lg">ms</span></p>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Uptime */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-400 text-sm">Uptime</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.uptime}%</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-center mb-16">
          <button
            onClick={onOpenQueue}
            className="group px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 flex items-center gap-2"
          >
            Entrar na Fila
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <svg className="w-6 h-6 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
