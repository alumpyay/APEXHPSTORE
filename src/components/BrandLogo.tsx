import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  showBackground = false,
  className = '' 
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {showBackground ? (
        <div className="relative overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800/80 px-3.5 py-2 shadow-2xl">
          {/* Subtle background red & cyan laser flares */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-red-600/20 blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-cyan-500/20 blur-xl pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(239,68,68,0.1)_0%,transparent_50%,rgba(6,182,212,0.1)_100%)] pointer-events-none" />
          
          <LogoGraphic isSm={isSm} isLg={isLg} />
        </div>
      ) : (
        <LogoGraphic isSm={isSm} isLg={isLg} />
      )}
    </div>
  );
};

const LogoGraphic: React.FC<{ isSm: boolean; isLg: boolean }> = ({ isSm, isLg }) => {
  return (
    <div className="flex flex-col tracking-tight select-none">
      {/* Row 1: APEX / HP (with helmet emblem right next to HP) */}
      <div className="flex items-center gap-1.5 leading-none">
        <span 
          className={`font-black italic tracking-wide text-[#22d3ee] font-sans ${
            isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-lg'
          }`}
          style={{ fontStyle: 'italic', transform: 'skewX(-6deg)' }}
        >
          APEX
        </span>
        <span className="text-zinc-500 font-light text-sm -translate-y-0.5 mx-0.5">/</span>
        <div className="flex items-center gap-1">
          <span 
            className={`font-black italic tracking-wider text-[#ef4444] font-sans ${
              isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-lg'
            }`}
            style={{ fontStyle: 'italic', transform: 'skewX(-6deg)' }}
          >
            HP
          </span>
          {/* Small circular helmet profile matching logo */}
          <svg 
            viewBox="0 0 24 24" 
            className={`${isSm ? 'w-3.5 h-3.5' : isLg ? 'w-5 h-5' : 'w-4 h-4'} text-red-500 fill-none -translate-y-0.5`}
          >
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
            <path d="M8 12C8 9.5 9.8 7.5 12 7.5C14.2 7.5 16 9.5 16 12V15C16 16.5 14.5 17.5 12 17.5C9.5 17.5 8 16.5 8 15V12Z" fill="#ef4444" />
            <path d="M10 13H14M11 15H13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Row 2: JERSEY STORE */}
      <span 
        className={`font-black uppercase tracking-wider text-white dark:text-white html-light-text-zinc-900 leading-none mt-1 font-sans ${
          isSm ? 'text-[11px]' : isLg ? 'text-base' : 'text-[13px]'
        }`}
        style={{ letterSpacing: '0.09em' }}
      >
        JERSEY STORE
      </span>

      {/* Row 3: E S P O R T S */}
      <span 
        className="text-[#ef4444] font-bold uppercase tracking-[0.4em] text-[8px] leading-none mt-0.5"
      >
        ESPORTS
      </span>
    </div>
  );
};
