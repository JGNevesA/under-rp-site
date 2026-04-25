import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onOpenQueue: () => void;
}

const Navbar = ({ user, setUser, onOpenQueue }: NavbarProps) => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { name: 'Início', href: '/#inicio' },
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Regras', href: '/#regras' },
    { name: 'Doações', href: '/#doacoes' },
    { name: 'Suporte', href: '/#suporte' },
    { name: 'Whitelist', href: '/#whitelist' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isScrolled ? 'rgba(8, 8, 8, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/#inicio" className="flex items-center group hover:opacity-90 transition-opacity duration-300">
              <Logo variant="icon" iconClassName="h-[42px] w-auto relative top-[-2px]" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                  style={{ fontFamily: 'var(--font-subtitle)' }}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right side: Auth (if logged in, keep avatar + fila button; if not, empty) */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                /* Logged in */
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                    >
                      <img src={user.avatar} alt={user.global_name} className="w-7 h-7 rounded-full" />
                      <span className="text-sm font-medium text-white max-w-[100px] truncate">{user.global_name}</span>
                      {user.is_admin && (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0c0c14]/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm font-medium text-white">{user.global_name}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                          <a
                            href="/bans"
                            className="w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 text-left flex items-center gap-2 transition-colors border-b border-white/10"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Painel / Suporte
                          </a>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 text-left flex items-center gap-2 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sair
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Not logged in: NO BUTTONS AT THE TOP */
                <div className="w-10"></div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/5 overflow-hidden"
              style={{ backgroundColor: 'rgba(8, 8, 8, 0.95)', backdropFilter: 'blur(20px)' }}
            >
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                  >
                    {item.name}
                  </a>
                ))}

                <div className="border-t border-white/5 mt-2 pt-4 flex flex-col gap-2">
                  {user && (
                    <div className="flex flex-col gap-3">

                      <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.global_name} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white">{user.global_name}</p>
                              {user.is_admin && (
                                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href="/bans"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-gray-400 hover:text-white text-sm font-medium"
                          >
                            Painel
                          </a>
                          <button
                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Sair
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
