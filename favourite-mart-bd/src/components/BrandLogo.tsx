import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'stacked';
  theme?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  size = 'md',
}) => {
  const isDark = theme === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Dedicated Vector SVG of the exact Favourite Mart BD Logo
  const LogoIcon = (
    <svg
      viewBox="0 0 200 200"
      className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-105 flex-shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fmTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A3C4" />
          <stop offset="50%" stopColor="#00829B" />
          <stop offset="100%" stopColor="#006477" />
        </linearGradient>
        <linearGradient id="fmDeepNavy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E4B5B" />
          <stop offset="100%" stopColor="#083344" />
        </linearGradient>
      </defs>

      {/* Top Handle Arc */}
      <path
        d="M 68 62 A 32 32 0 0 1 132 62"
        stroke="url(#fmTealGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Upper Triangle Flange */}
      <polygon
        points="48,64 152,64 100,102"
        fill="url(#fmTealGrad)"
      />

      {/* Left Pillar of M */}
      <path
        d="M 44,70 L 74,70 L 74,156 L 44,156 Z"
        fill="url(#fmTealGrad)"
      />

      {/* Right Pillar of M */}
      <path
        d="M 126,70 L 156,70 L 156,156 L 126,156 Z"
        fill="url(#fmDeepNavy)"
      />

      {/* Inner Central Chevron of M */}
      <polygon
        points="44,70 100,132 156,70 156,104 100,154 44,104"
        fill="url(#fmDeepNavy)"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {LogoIcon}
        <div className="mt-2">
          <span
            className={`block font-black tracking-[0.25em] text-lg leading-none ${
              isDark ? 'text-white' : 'text-[#083344]'
            }`}
          >
            FAVOURITE
          </span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="h-[1.5px] w-4 bg-[#00829B]" />
            <span className="font-extrabold text-[10px] tracking-[0.2em] text-[#00829B] uppercase">
              MART BD
            </span>
            <span className="h-[1.5px] w-4 bg-[#00829B]" />
          </div>
        </div>
      </div>
    );
  }

  // Full Horizontal Brand Layout
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {LogoIcon}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-[0.16em] text-lg sm:text-xl leading-none ${
              isDark ? 'text-white' : 'text-[#083344]'
            }`}
          >
            FAVOURITE
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-[1.5px] w-3 bg-[#00829B]" />
          <span className="font-extrabold text-[10px] sm:text-[11px] tracking-[0.22em] text-[#00829B] uppercase leading-none">
            MART BD
          </span>
          <span className="h-[1.5px] w-3 bg-[#00829B]" />
        </div>
      </div>
    </div>
  );
};
