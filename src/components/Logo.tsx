import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'full' | 'icon' | 'text';
}

export const Logo = ({ className = "", iconClassName = "h-10", textClassName = "h-6", variant = 'full' }: LogoProps) => {
  const { isDaytime, theme } = useTheme();
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        className={`flex items-center font-black tracking-tight transition-colors duration-700 text-3xl ${className}`}
        style={{ fontFamily: "var(--font-headline)" }}
      >
        <span
          className="bg-clip-text text-transparent transition-all duration-700"
          style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
        >
          {variant !== 'icon' ? 'UNDER' : 'U'}
        </span>
        {variant !== 'icon' && <span className="text-white ml-2">RP</span>}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <img 
          src={isDaytime ? '/logos/logo-icon-day.png' : '/logos/logo-icon-night.png'} 
          alt="Under RP Icon" 
          onError={() => setHasError(true)}
          className={`${iconClassName} object-contain transition-opacity duration-500`}
        />
      )}
      {(variant === 'full' || variant === 'text') && (
        <img 
          src={isDaytime ? '/logos/logo-text-day.png' : '/logos/logo-text-night.png'} 
          alt="Under RP Text" 
          onError={() => setHasError(true)}
          className={`${textClassName} object-contain transition-opacity duration-500`}
        />
      )}
    </div>
  );
};
