import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import RulesSection from './components/RulesSection';
import DonationSection from './components/DonationSection';
import WhitelistSection from './components/WhitelistSection';
import SupportSection from './components/SupportSection';
import Footer from './components/Footer';

export interface User {
  id?: string;
  discord_id?: string;
  steam_id?: string;
  username: string;
  global_name: string;
  avatar: string;
  source: 'discord' | 'steam';
}

const API_URL = 'https://underrp-api.onrender.com';

function App() {
  const [user, setUser] = useState<User | null>(null);

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
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-50 pointer-events-none" />

      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar user={user} setUser={setUser} />
        <main>
          <HeroSection />
          <AboutSection />
          <RulesSection />
          <DonationSection />
          <WhitelistSection user={user} />
          <SupportSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
