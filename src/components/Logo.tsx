

import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'full' | 'icon' | 'text';
}

export const Logo = ({ className = "", iconClassName = "h-10", textClassName = "h-6", variant = 'full' }: LogoProps) => {
  const { isDaytime } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <img 
          src={isDaytime ? "/logos/logo-icon-day.png" : "/logos/logo-icon-night.png"}
          alt="Under RP Icon" 
          className={`${iconClassName} object-contain transition-all duration-700`}
        />
      )}
      {(variant === 'full' || variant === 'text') && (
        <img 
          src={isDaytime ? "/logos/logo-text-day.png" : "/logos/logo-text-night.png"}
          alt="Under RP Text" 
          className={`${textClassName} object-contain transition-all duration-700`}
        />
      )}
    </div>
  );
};;
