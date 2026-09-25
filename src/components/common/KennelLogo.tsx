import { useState } from 'react';
import { KENNEL_BRAND } from '../../assets/logo';

interface KennelLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
  lang?: 'ru' | 'en';
  onClick?: () => void;
}

export function KennelLogo({
  size = 'md',
  showText = false,
  textColor = 'dark',
  className = '',
  lang = 'ru',
  onClick,
}: KennelLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-10 h-10 text-xs',
    md: 'w-13 h-13 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const imageSize = sizeClasses[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div
        className={`relative ${imageSize} rounded-full overflow-hidden shrink-0 border-2 border-amber-500/60 shadow-md bg-stone-950 flex items-center justify-center transition-transform group-hover:scale-105`}
      >
        {!imageError ? (
          <img
            src="/monterun_star_logo.jpg"
            alt="MONTERUN STAR Kennel Logo"
            className="w-full h-full object-cover object-center"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-900 to-amber-950 flex flex-col items-center justify-center text-amber-300 font-serif-royal font-bold">
            <span>MS</span>
            <span className="text-[7px] text-amber-400">13²</span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] tracking-[0.22em] uppercase font-bold ${
                textColor === 'light' ? 'text-amber-400' : 'text-amber-800'
              }`}
            >
              {lang === 'en' ? 'Russian Borzoi Kennel' : 'Питомник Русских Борзых'}
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-900/20 text-amber-500 font-mono font-semibold">
              Bela SK
            </span>
          </div>
          <div
            className={`font-serif-royal font-extrabold tracking-wide leading-tight ${
              size === 'lg' || size === 'xl' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            } ${textColor === 'light' ? 'text-stone-100 group-hover:text-amber-200' : 'text-stone-900 group-hover:text-amber-900'}`}
          >
            {KENNEL_BRAND.name}
          </div>
          <div
            className={`text-[11px] font-medium tracking-wider ${
              textColor === 'light' ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            {KENNEL_BRAND.subName} · {KENNEL_BRAND.motto}
          </div>
        </div>
      )}
    </div>
  );
}
