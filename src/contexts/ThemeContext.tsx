import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  glow: string;
  gradientFrom: string;
  gradientTo: string;
}

interface ThemeContextType {
  isDaytime: boolean;
  theme: ThemeColors;
}

const dayTheme: ThemeColors = {
  primary: '#f59e0b',
  secondary: '#facc15',
  glow: 'rgba(245, 158, 11, 0.4)',
  gradientFrom: '#f59e0b',
  gradientTo: '#facc15',
};

const nightTheme: ThemeColors = {
  primary: '#36c0ff',
  secondary: '#8b5cf6',
  glow: 'rgba(54, 192, 255, 0.4)',
  gradientFrom: '#36c0ff',
  gradientTo: '#8b5cf6',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getIsDaytime(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function applyThemeToDOM(theme: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-primary-rgb', hexToRgb(theme.primary));
  root.style.setProperty('--theme-secondary-rgb', hexToRgb(theme.secondary));
  root.style.setProperty('--theme-glow', theme.glow);
  root.style.setProperty('--theme-gradient-from', theme.gradientFrom);
  root.style.setProperty('--theme-gradient-to', theme.gradientTo);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDaytime, setIsDaytime] = useState(getIsDaytime);

  const theme = isDaytime ? dayTheme : nightTheme;

  // Auto-detect time changes every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setIsDaytime(getIsDaytime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyThemeToDOM(theme);
    document.documentElement.setAttribute('data-theme', isDaytime ? 'day' : 'night');
  }, [isDaytime, theme]);

  return (
    <ThemeContext.Provider value={{ isDaytime, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
