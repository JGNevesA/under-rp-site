import { useState, useEffect } from 'react';
import { User } from '../App';

const API_URL = 'https://underrp-api.onrender.com';

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onOpenQueue: () => void;
}

const Navbar = ({ user, setUser, onOpenQueue }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleDiscordLogin = () => {
    window.location.href = `${API_URL}/auth/discord`;
  };

  const handleSteamLogin = () => {
    window.location.href = `${API_URL}/auth/steam`;
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { name: 'Início', href: '#inicio' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Regras', href: '#regras' },
    { name: 'Doações', href: '#doacoes' },
    { name: 'Suporte', href: '#suporte' },
    { name: 'Whitelist', href: '#whitelist' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className={`rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled
          ? 'bg-black/70 backdrop-blur-xl border border-white/10 shadow-lg shadow-violet-500/5'
          : 'bg-white/[0.03] backdrop-blur-xl border border-white/10'
          }`}>
          {/* Logo with Gamepad Icon */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M6.343 6.343a8 8 0 000 11.314" />
              </svg>
            </div>
            <span className="text-xl font-bold hidden sm:block">
              <span className="text-white">UNDER</span>{' '}
              <span className="text-violet-400">RP</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Auth + Discord Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              /* Logged in - Show user */
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenQueue}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm rounded-lg transition-colors shadow-lg shadow-orange-500/20 hidden sm:block"
                >
                  Entrar na fila
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                  >
                    <img
                      src={user.avatar}
                      alt={user.global_name}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">
                      {user.global_name}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user.global_name}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 text-left flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Not logged in - Show login buttons */
              <div className="flex gap-2">
                <button
                  onClick={handleSteamLogin}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#171a21] hover:bg-[#2a475e] text-white font-medium rounded-lg transition-all duration-200 border border-white/10"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 10.942l6.432 2.658a3.387 3.387 0 011.912-.585c.064 0 .127.003.19.007l2.862-4.142v-.058a4.503 4.503 0 014.5-4.5 4.503 4.503 0 014.5 4.5 4.503 4.503 0 01-4.5 4.5h-.105l-4.076 2.91c0 .073.004.146.004.22a3.39 3.39 0 01-3.39 3.39 3.396 3.396 0 01-3.329-2.76L.308 15.597C1.87 20.562 6.533 24 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0z" />
                  </svg>
                  <span className="text-sm">Steam</span>
                </button>
                <button
                  onClick={handleDiscordLogin}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#5865F2]/30"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span className="text-sm">Discord</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 p-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                {user ? (
                  /* Mobile - Logged in */
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        onOpenQueue();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm rounded-lg transition-colors shadow-lg shadow-orange-500/20 text-center"
                    >
                      Entrar na fila
                    </button>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.global_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{user.global_name}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Sair
                    </button>
                  </div>
                </div>
                ) : (
                  /* Mobile - Not logged in */
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { handleSteamLogin(); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171a21] hover:bg-[#2a475e] text-white font-medium rounded-lg transition-all border border-white/10"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.979 0C5.678 0 .511 4.86.022 10.942l6.432 2.658a3.387 3.387 0 011.912-.585c.064 0 .127.003.19.007l2.862-4.142v-.058a4.503 4.503 0 014.5-4.5 4.503 4.503 0 014.5 4.5 4.503 4.503 0 01-4.5 4.5h-.105l-4.076 2.91c0 .073.004.146.004.22a3.39 3.39 0 01-3.39 3.39 3.396 3.396 0 01-3.329-2.76L.308 15.597C1.87 20.562 6.533 24 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0z" />
                      </svg>
                      <span className="text-sm">Steam</span>
                    </button>
                    <button
                      onClick={() => { handleDiscordLogin(); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      <span className="text-sm">Entrar com Discord</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
