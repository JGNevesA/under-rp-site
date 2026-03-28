import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import RulesSection from './components/RulesSection';
import DonationSection from './components/DonationSection';
import WhitelistSection from './components/WhitelistSection';
import SupportSection from './components/SupportSection';
import Footer from './components/Footer';
import QueueModal from './components/QueueModal';
import BanHistory from './components/BanHistory';

export interface User {
  id?: string;
  discord_id?: string;
  steam_id?: string;
  username: string;
  global_name: string;
  avatar: string;
  source: 'discord' | 'steam';
}

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://underrp-api.onrender.com';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      fetchUser(savedToken);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } catch {
      console.error('Erro ao buscar usuário');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Subtle grid pattern */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none z-[1]" />

        {/* Content */}
        <div className="relative z-10">
          <ScrollToTop />
          <Navbar user={user} setUser={setUser} onOpenQueue={() => setIsQueueOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <AboutSection />
                  <RulesSection />
                  <DonationSection />
                  <WhitelistSection user={user} />
                  <SupportSection />
                </>
              } />
              <Route path="/bans" element={<BanHistory />} />
            </Routes>
          </main>
          <Footer />
        </div>
        {isQueueOpen && <QueueModal onClose={() => setIsQueueOpen(false)} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
