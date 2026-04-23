import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';
import { User } from '../App';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://under-rp-site.onrender.com';

/* ── SVG Icons ── */
const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.979 0C5.678 0 .511 4.86.022 10.942l6.432 2.658a3.387 3.387 0 011.912-.585c.064 0 .127.003.19.007l2.862-4.142v-.058a4.503 4.503 0 014.5-4.5 4.503 4.503 0 014.5 4.5 4.503 4.503 0 01-4.5 4.5h-.105l-4.076 2.91c0 .073.004.146.004.22a3.39 3.39 0 01-3.39 3.39 3.396 3.396 0 01-3.329-2.76L.308 15.597C1.87 20.562 6.533 24 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const HeroSection = ({ user, onOpenQueue }: { user?: User | null, onOpenQueue: () => void }) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [stats, setStats] = useState({
    players: 0,
    maxPlayers: 1024,
    queuePosition: 0,
    status: 'offline' as 'online' | 'offline',
  });

  // Live stats update from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/server/status`);
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...data,
            // Preserve last known maxPlayers when server goes offline
            maxPlayers: data.maxPlayers > 0 ? data.maxPlayers : prev.maxPlayers,
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar status do servidor:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSteamLogin = () => {
    const token = localStorage.getItem('auth_token');
    window.location.href = `${API_URL}/auth/steam${token ? `?token=${token}` : ''}`;
  };

  const handleDiscordLogin = () => {
    const token = localStorage.getItem('auth_token');
    window.location.href = `${API_URL}/auth/discord${token ? `?token=${token}` : ''}`;
  };

  /* ── Particle Canvas ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    
    let w = 0, h = 0, ps: any[] = [], raf: number;

    const resize = () => {
      w = c.width = c.parentElement?.offsetWidth || window.innerWidth;
      h = c.height = c.parentElement?.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      ps.push({
        x: Math.random() * (w || 1400),
        y: Math.random() * (h || 900),
        r: Math.random() * 1.8 + 0.4,
        dx: (Math.random() - .5) * .25,
        dy: (Math.random() - .5) * .25,
        o: Math.random() * .35 + .08,
      });
    }

    const draw = () => {
      // Get RGB from current theme custom property set by ThemeContext
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryRgbStr = rootStyles.getPropertyValue('--theme-primary-rgb').trim() || '245, 158, 11';
      const secondaryRgbStr = rootStyles.getPropertyValue('--theme-secondary-rgb').trim() || '250, 204, 21';

      ctx.clearRect(0, 0, w, h);
      ps.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryRgbStr},${p.o})`;
        ctx.fill();
      });
      // connection lines
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(${secondaryRgbStr},${.06 * (1 - d / 110)})`;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ── Mouse Parallax ── */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouse({ x, y });
    };
    const el = heroRef.current;
    if (el) el.addEventListener('mousemove', handleMouse);
    return () => { if (el) el.removeEventListener('mousemove', handleMouse); };
  }, []);

  const parallax = (depth = 1) => ({
    transform: `translate(${mouse.x * 8 * depth}px, ${mouse.y * 6 * depth}px)`,
    transition: 'transform 0.15s ease-out',
  });

  const tiltLeft = {
    transform: `perspective(1000px) rotateY(${15 + mouse.x * 6}deg) rotateX(${-mouse.y * 4}deg)`,
    transition: 'transform 0.2s ease-out',
  };
  const tiltRight = {
    transform: `perspective(1000px) rotateY(${-15 + mouse.x * 6}deg) rotateX(${-mouse.y * 4}deg)`,
    transition: 'transform 0.2s ease-out',
  };

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Glow Orbs */}
      <div
        className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[150px] animate-pulse-glow pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: `${theme.primary}15` }}
      />
      <div
        className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full blur-[150px] animate-pulse-glow pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: `${theme.secondary}15`, animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: `${theme.primary}0a` }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-16 py-10 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 w-full">

          {/* ── LEFT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-xl"
          >
            <div style={{ ...tiltLeft, transformStyle: 'preserve-3d' }} className="w-full h-full">

            {/* Title / Logo */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mb-8"
                style={parallax(0.15)}
              >
                <Logo 
                  variant="text"
                  className="items-center justify-start" 
                  textClassName="h-[136px] sm:h-[187px] md:h-[255px] lg:h-[306px] w-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-500" 
                />
              </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="text-xl md:text-2xl uppercase tracking-wider font-semibold mb-4 transition-colors duration-700"
              style={{ color: theme.primary, fontFamily: 'var(--font-subtitle)', ...parallax(0.1) }}
            >
              A experiência mais imersiva de GTA RP
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-sm uppercase tracking-wide leading-relaxed max-w-lg mb-8"
              style={parallax(0.05)}
            >
              Sua nova vida começa aqui. Faça sua história no maior e mais completo
              servidor de Roleplay de Los Santos. Economia real, empregos, facções e
              uma comunidade vibrante te esperam.
            </motion.p>

            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 flex flex-col items-center lg:items-end max-w-md w-full"
          >
            <div style={{ ...tiltRight, transformStyle: 'preserve-3d' }} className="w-full h-full flex flex-col items-center lg:items-end">
            {/* Server Online Badge (Moved above the Queue Card) */}
            <div className="w-full max-w-sm flex items-center justify-center mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{
                  backgroundColor: stats.status === 'online' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${stats.status === 'online' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  boxShadow: stats.status === 'online' ? '0 0 12px rgba(34,197,94,0.3)' : '0 0 12px rgba(239,68,68,0.3)',
                  ...parallax(0.3)
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: stats.status === 'online' ? '#4ade80' : '#f87171' }} />
                <span className="text-sm font-medium" style={{ color: stats.status === 'online' ? '#4ade80' : '#f87171' }}>
                  {stats.status === 'online' ? 'Servidor Online' : 'Servidor Offline'}
                </span>
              </motion.div>
            </div>

            {/* Queue Card */}
              <div
                className="w-full max-w-sm h-full glass-card rounded-2xl p-6 relative overflow-hidden neon-border"
                style={parallax(0.4)}
              >
                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-subtitle)' }}>Fila do Servidor</h3>
                      <p className="text-gray-500 text-xs mt-0.5">Status em tempo real</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-700"
                      style={{ backgroundColor: `${theme.primary}15`, border: `1px solid ${theme.primary}30` }}
                    >
                      <div style={{ color: theme.primary }} className="transition-colors duration-700">
                        <ChartIcon />
                      </div>
                    </div>
                  </div>

                  {/* Queue Position */}
                  <div
                    className="rounded-xl p-5 mb-5 text-center relative overflow-hidden transition-all duration-700"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-10 transition-colors duration-700"
                      style={{ background: `radial-gradient(circle at center, ${theme.primary}, transparent 70%)` }}
                    />
                    <div className="relative">
                      <div
                        className="text-5xl font-black mb-1 bg-clip-text text-transparent transition-all duration-700"
                        style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, fontFamily: 'var(--font-headline)' }}
                      >
                        #{stats.queuePosition}
                      </div>
                      <div className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium mt-1">
                        Sua Posição na Fila
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <UsersIcon />
                        Jogadores
                      </span>
                      <span className="text-white font-semibold">{stats.players} / {stats.maxPlayers}</span>
                    </div>
                  </div>
                </div>
              </div>

            {/* Play Button - JOGAR AGORA */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 w-full max-w-sm relative z-50 pointer-events-auto"
                style={parallax(0.3)}
              >
                <a
                  href="fivem://connect/45.146.81.252:30120"
                  className="w-full flex items-center justify-center px-6 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 8px 30px ${theme.glow}`,
                  }}
                >
                  ENTRAR NA FILA
                </a>
              </motion.div>
            )}

            {/* Steam & Discord buttons — below card */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-sm relative z-50 pointer-events-auto"
                style={parallax(0.25)}
              >
                <button
                  onClick={handleSteamLogin}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <SteamIcon />
                  Steam
                </button>
                <button
                  onClick={handleDiscordLogin}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 4px 20px ${theme.glow.replace('0.4', '0.3')}`,
                  }}
                >
                  <DiscordIcon />
                  Discord
                </button>
               </motion.div>
            )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
