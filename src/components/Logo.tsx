

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'full' | 'icon' | 'text';
}

export const Logo = ({ className = "", iconClassName = "h-10", textClassName = "h-6", variant = 'full' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <img 
          src="/logos/logo-icon-day.png"
          alt="Under RP Icon" 
          className={`${iconClassName} object-contain`}
        />
      )}
      {(variant === 'full' || variant === 'text') && (
        <img 
          src="/logos/logo-text-day.png"
          alt="Under RP Text" 
          className={`${textClassName} object-contain`}
        />
      )}
    </div>
  );
};
