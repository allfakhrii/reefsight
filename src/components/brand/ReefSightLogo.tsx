'use client';

import React from 'react';

interface ReefSightLogoProps {
  variant?: 'icon' | 'horizontal' | 'stacked' | 'banner' | 'badge';
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
    xs: { title: 'text-sm font-black', sub: 'text-[8px]' },
    sm: { title: 'text-base font-black', sub: 'text-[9px]' },
    md: { title: 'text-lg font-black', sub: 'text-[10px]' },
    lg: { title: 'text-xl font-black', sub: 'text-[11px]' },
    xl: { title: 'text-2xl font-black', sub: 'text-xs' }
  };

  const isDark = theme === 'dark';

  // Banner graphic variant (using Data/logo3.jpeg horizontal artwork)
  if (variant === 'banner') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/brand/logo-horizontal.jpg"
          alt="REEFSIGHT Platform"
          className="h-9 sm:h-11 w-auto object-contain rounded-xl shadow-xs"
        />
      </div>
    );
  }

  // Circular Badge variant (using Data/logo2.jpeg badge artwork)
  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-xs select-none transition-transform hover:scale-105 border border-slate-700/20 bg-slate-900 ${iconSizes[size]} ${className}`}
        title="REEFSIGHT Official Badge"
      >
        <img
          src="/brand/logo-badge.jpg"
          alt="REEFSIGHT Badge"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Icon only
  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-xs select-none transition-transform hover:scale-105 border border-slate-700/20 bg-slate-900 ${iconSizes[size]} ${className}`}
        title="REEFSIGHT Official Emblem"
      >
        <img
          src="/brand/logo.jpg"
          alt="REEFSIGHT Emblem"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Horizontal Brandmark
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <div
          className={`relative flex-shrink-0 rounded-2xl overflow-hidden shadow-xs transition-transform hover:scale-105 border border-slate-700/20 bg-slate-900 ${iconSizes[size]}`}
        >
          <img
            src="/brand/logo.jpg"
            alt="REEFSIGHT Logo"
            className="w-full h-full object-cover"
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
              Ecological Intelligence · Pulau Tunda
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
        className={`relative rounded-3xl overflow-hidden shadow-sm transition-transform hover:scale-105 border border-slate-700/20 bg-slate-900 ${iconSizes[size]}`}
      >
        <img
          src="/brand/logo.jpg"
          alt="REEFSIGHT Logo"
          className="w-full h-full object-cover"
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
