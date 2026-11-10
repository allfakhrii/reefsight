'use client';

import React from 'react';

interface ReefSightLogoProps {
  variant?: 'icon' | 'horizontal' | 'stacked';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
}

export default function ReefSightLogo({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className = '',
  showTagline = true
}: ReefSightLogoProps) {
  // Dimensions map
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: { title: 'text-sm', sub: 'text-[8px]' },
    sm: { title: 'text-base', sub: 'text-[9px]' },
    md: { title: 'text-lg', sub: 'text-[10px]' },
    lg: { title: 'text-xl', sub: 'text-[11px]' },
    xl: { title: 'text-2xl', sub: 'text-xs' }
  };

  const isDark = theme === 'dark';

  // Icon only
  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-xs select-none transition-transform hover:scale-105 ${iconSizes[size]} ${className}`}
        title="REEFSIGHT Coral Emblem"
      >
        <img
          src="/brand/reefsight-icon.svg"
          alt="REEFSIGHT"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Horizontal Brandmark
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <div
          className={`relative flex-shrink-0 rounded-2xl overflow-hidden shadow-xs transition-transform hover:scale-105 ${iconSizes[size]}`}
        >
          <img
            src="/brand/reefsight-icon.svg"
            alt="REEFSIGHT Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <div
            className={`font-black tracking-tight leading-none ${textSizes[size].title} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            REEF<span className="text-[#F05A28]">SIGHT</span>
          </div>
          {showTagline && (
            <div
              className={`font-semibold tracking-wider uppercase mt-1 leading-none ${textSizes[size].sub} ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Ecological Intelligence
            </div>
          )}
        </div>
      </div>
    );
  }

  // Stacked Brandmark
  return (
    <div className={`flex flex-col items-center text-center gap-2 select-none ${className}`}>
      <div
        className={`relative rounded-3xl overflow-hidden shadow-sm transition-transform hover:scale-105 ${iconSizes[size]}`}
      >
        <img
          src="/brand/reefsight-icon.svg"
          alt="REEFSIGHT Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col items-center">
        <div
          className={`font-black tracking-tight leading-none ${textSizes[size].title} ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          REEF<span className="text-[#F05A28]">SIGHT</span>
        </div>
        {showTagline && (
          <div
            className={`font-semibold tracking-widest uppercase mt-1 leading-none ${textSizes[size].sub} ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Ecological Intelligence Platform
          </div>
        )}
      </div>
    </div>
  );
}
