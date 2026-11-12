'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WorkspaceMode, UserRole } from '@/types/reefsight';
import {
  Menu,
  Search,
  Bell,
  LogIn,
  LogOut,
  ChevronDown,
  Shield,
  Compass,
  AlertTriangle,
  User,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';

interface AppHeaderProps {
  workspace: WorkspaceMode;
  onSelectWorkspace: (ws: WorkspaceMode) => void;
  activeRole: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

interface SearchEntry {
  id: string;
  title: string;
  subtitle: string;
  targetWorkspace: WorkspaceMode;
  tabId: string;
  keywords: string[];
}

const SEARCH_INDEX: SearchEntry[] = [
  { id: 'home', title: 'Home & Ecological Encyclopedia', subtitle: 'Profil Pulau Tunda & Taksonomi Karang', targetWorkspace: 'public', tabId: 'home', keywords: ['home', 'beranda', 'pulau tunda', 'acropora', 'karang', 'fish'] },
  { id: 'webgis', title: 'WebGIS & Deployment Map', subtitle: '12 Stasiun Buoy ASIK-01 hingga ASIK-12 (TUN-01 - TUN-04)', targetWorkspace: 'public', tabId: 'webgis', keywords: ['webgis', 'peta', 'map', 'stasiun', 'buoy', 'asik', 'tun', 'deployment'] },
  { id: 'coral-dist', title: 'Coral Distribution (ArcGIS)', subtitle: 'Peta Distribusi Terumbu Karang 2020 vs 2023', targetWorkspace: 'public', tabId: 'coral-distribution', keywords: ['coral', 'distribusi', 'arcgis', 'tutupan', 'geojson', '2023', '2020'] },
  { id: 'coral-proj', title: 'Coral Projection Modeling', subtitle: 'Simulasi Pertumbuhan & Pemulihan Karang', targetWorkspace: 'public', tabId: 'coral-projection', keywords: ['projection', 'proyeksi', 'simulasi', 'masa depan'] },
  { id: 'bio', title: 'Biodiversity Explorer', subtitle: 'Life Forms Karang & Katalog Ikan Terumbu', targetWorkspace: 'public', tabId: 'biodiversity', keywords: ['biodiversity', 'ikan', 'biota', 'species', 'growth form'] },
  { id: 'rhi', title: 'Reef Health Index (RHI)', subtitle: 'Skor Kesehatan Ekosistem (76.4 Good)', targetWorkspace: 'public', tabId: 'ecological-assessment', keywords: ['rhi', 'kesehatan', 'assessment', 'indikator'] },
  { id: 'ocean', title: 'Ocean Environmental Intelligence', subtitle: 'SST, Klorofil-a, Salinitas & NOAA Heat Stress', targetWorkspace: 'public', tabId: 'ocean-environment', keywords: ['ocean', 'sst', 'suhu', 'klorofil', 'bleaching', 'noaa'] },
  { id: 'acoustic', title: 'Acoustic & Underwater Intelligence', subtitle: 'Audio Hydrophone, Waveform & FFT Spectrogram', targetWorkspace: 'public', tabId: 'acoustic-intelligence', keywords: ['acoustic', 'bioakustik', 'hydrophone', 'soundscape', 'suara', 'audio'] },
  { id: 'proto', title: 'EchoVision 3D Hardware', subtitle: 'Visualisasi 3D Interaktif & Komponen Buoy', targetWorkspace: 'public', tabId: 'prototype-3d', keywords: ['3d', 'echovision', 'prototype', 'hardware', 'sensor', 'kamera'] },
  { id: 'eco', title: 'Eco-Tourism & Conservation', subtitle: 'Zonasi Ekowisata & Rehabilitasi Karang', targetWorkspace: 'public', tabId: 'eco-tourism', keywords: ['ekowisata', 'tourism', 'konservasi', 'diving', 'zonasi'] },
  { id: 'pub', title: 'Research & Scientific Publications', subtitle: 'Publikasi Ilmiah Open Access & Logbook', targetWorkspace: 'public', tabId: 'research-logbook', keywords: ['riset', 'publikasi', 'jurnal', 'pdf', 'dokumen', 'logbook'] },
  { id: 'erd', title: 'ERD & System Architecture', subtitle: 'Skema PostgreSQL PostGIS & Separation of Duties', targetWorkspace: 'public', tabId: 'system-architecture', keywords: ['erd', 'database', 'supabase', 'postgis', 'arsitektur'] },
  { id: 'about', title: 'About REEFSIGHT & Collaboration', subtitle: 'Visi Riset & Formulir Kolaborasi', targetWorkspace: 'public', tabId: 'about', keywords: ['about', 'tentang', 'kontak', 'kolaborasi'] }
];

const ROLE_META: Record<UserRole, { full: string; short: string; initials: string; badge: string }> = {
  admin: {
    full: 'Reza Gading Oktavian (Administrator)',
    short: 'Reza Gading O.',
    initials: 'RG',
    badge: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  peneliti_ekologi: {
    full: 'Dr. Aulia Rahma (Peneliti Ekologi)',
    short: 'Dr. Aulia R.',
    initials: 'AR',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  operator_lapangan: {
    full: 'Dimas Pratama (Operator Lapangan)',
    short: 'Dimas P.',
    initials: 'DP',
    badge: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  validator_data: {
    full: 'Sinta Nurhaliza (Validator Data)',
    short: 'Sinta N.',
    initials: 'SN',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  public: {
    full: 'Pengunjung Publik',
    short: 'Publik',
    initials: 'PB',
    badge: 'bg-slate-100 text-slate-700 border-slate-200'
  }
};

export default function AppHeader({
  workspace,
  onSelectWorkspace,
  activeRole,
  activeTab,
  onSelectTab,
  onOpenLogin,
  onLogout,
  onToggleMobileSidebar
}: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowAlertMenu(false);
        setShowSearchDropdown(false);
        setShowMobileSearch(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowAlertMenu(false);
        setShowSearchDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredResults = searchQuery.trim()
    ? SEARCH_INDEX.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
    : [];

  const handleNavigateSearchResult = (entry: SearchEntry) => {
    if (workspace !== entry.targetWorkspace) {
      onSelectWorkspace(entry.targetWorkspace);
    }
    onSelectTab(entry.tabId);
    setSearchQuery('');
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
  };

  const getBreadcrumbTitle = () => {
    const formattedTab = activeTab
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    if (workspace === 'public') return `Public Workspace > ${formattedTab}`;
    if (workspace === 'research') return `Research Workspace > ${formattedTab}`;
    return `Admin Workspace > ${formattedTab}`;
  };

  const roleMeta = ROLE_META[activeRole] || ROLE_META.public;

  const renderWorkspaceButtons = (isMobile = false) => (
    <div
      role="tablist"
      aria-label="Pilih Workspace"
      className={
        isMobile
          ? 'grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold w-full'
          : 'inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold'
      }
    >
      <button
        type="button"
        role="tab"
        aria-selected={workspace === 'public'}
        onClick={() => onSelectWorkspace('public')}
        className={`${isMobile ? 'min-h-[40px] justify-center' : 'min-h-[36px] px-2.5'} py-1.5 rounded-lg transition-all flex items-center ${
          workspace === 'public'
            ? 'bg-white text-orange-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Public
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={workspace === 'research'}
        onClick={() => onSelectWorkspace('research')}
        className={`${isMobile ? 'min-h-[40px] justify-center' : 'min-h-[36px] px-2.5'} py-1.5 rounded-lg transition-all flex items-center ${
          workspace === 'research'
            ? 'bg-white text-blue-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Research
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={workspace === 'admin'}
        onClick={() => onSelectWorkspace('admin')}
        className={`${isMobile ? 'min-h-[40px] justify-center' : 'min-h-[36px] px-2.5'} py-1.5 rounded-lg transition-all flex items-center ${
          workspace === 'admin'
            ? 'bg-white text-purple-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Admin
      </button>
    </div>
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
    >
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: Mobile Toggle, Mobile Brand, Desktop Workspace Switcher & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle mobile menu"
            className="lg:hidden min-w-[44px] min-h-[44px] -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Brand Logo */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex lg:hidden items-center gap-1.5 min-h-[44px] flex-shrink-0"
          >
            <img
              src="/brand/reefsight-icon.svg"
              alt="REEFSIGHT"
              className="w-7 h-7 rounded-lg object-contain shadow-xs"
            />
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight">
              REEF<span className="text-[#F05A28]">SIGHT</span>
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 min-w-0">
            {renderWorkspaceButtons(false)}
            <span className="hidden xl:inline-block text-slate-300">|</span>
            <span className="hidden xl:inline-block text-xs font-medium text-slate-500 truncate max-w-[14rem]">
              {getBreadcrumbTitle()}
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop/Tablet) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 min-w-0 relative">
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="search"
              aria-label="Cari ekosistem, spesies karang, stasiun buoy, atau fitur"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredResults.length > 0) {
                  e.preventDefault();
                  handleNavigateSearchResult(filteredResults[0]);
                }
              }}
              placeholder="Cari ekosistem, spesies karang, stasiun buoy, atau fitur..."
              className="w-full min-h-[40px] pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs max-h-80 overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleNavigateSearchResult(entry)}
                    className="w-full min-h-[44px] px-4 py-2 text-left hover:bg-orange-50/70 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{entry.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{entry.subtitle}</div>
                    </div>
                    <ArrowRight size={14} className="text-orange-500 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500 text-center">
                  Tidak ada modul yang cocok dengan &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Mobile Search Trigger, Alerts & User Profile */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowMobileSearch((prev) => !prev);
              setShowAlertMenu(false);
              setShowUserMenu(false);
            }}
            aria-label="Toggle pencarian modul"
            aria-expanded={showMobileSearch}
            className="md:hidden min-w-[44px] min-h-[44px] rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            {showMobileSearch ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowAlertMenu((prev) => !prev);
                setShowUserMenu(false);
              }}
              aria-label="Notification center"
              aria-expanded={showAlertMenu}
              className="relative min-w-[44px] min-h-[44px] rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Quick Alert Notification Dropdown */}
            {showAlertMenu && (
              <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-orange-500 flex-shrink-0" />
                    <span>Notifikasi Anomali Ekologis</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    2 Baru
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-rose-600">Coral Bleaching</span>
                      <span className="text-[10px] text-slate-400">10 Menit lalu</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Stasiun TUN-01: Anomali SST +0.9°C di atas MMM historis.
                    </p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-amber-600">Low Fish Activity</span>
                      <span className="text-[10px] text-slate-400">35 Menit lalu</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Stasiun TUN-02: Indeks bioakustik ACI turun menjadi 0.28.
                    </p>
                  </div>
                </div>
                <div className="px-4 py-1.5 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAlertMenu(false);
                      onSelectWorkspace('admin');
                    }}
                    className="min-h-[40px] px-3 text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Buka Alert Management →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account Button */}
          {activeRole === 'public' ? (
            <button
              type="button"
              onClick={onOpenLogin}
              className="min-h-[44px] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-xs shadow-sm shadow-orange-500/20 hover:from-orange-600 hover:to-rose-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40 whitespace-nowrap"
            >
              <LogIn size={15} />
              <span className="sm:hidden">Masuk</span>
              <span className="hidden sm:inline">Login Workspace</span>
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu((prev) => !prev);
                  setShowAlertMenu(false);
                }}
                aria-label="Menu akun pengguna"
                aria-expanded={showUserMenu}
                className="min-h-[44px] flex items-center gap-2 p-1.5 sm:pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {roleMeta.initials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {roleMeta.short}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${roleMeta.badge}`}
                  >
                    {activeRole.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{roleMeta.full}</p>
                    <p className="text-[10px] text-slate-500">
                      Pulau Tunda Marine Ecological Intelligence
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenLogin();
                      }}
                      className="w-full min-h-[44px] px-4 py-2 text-left text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2 font-medium"
                    >
                      <User size={14} />
                      Ganti Peran / Switch Role
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectWorkspace('public');
                      }}
                      className="w-full min-h-[44px] px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Compass size={14} />
                      Ke Public Workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectWorkspace('research');
                      }}
                      className="w-full min-h-[44px] px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <CheckCircle2 size={14} />
                      Ke Research Workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectWorkspace('admin');
                      }}
                      className="w-full min-h-[44px] px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Shield size={14} />
                      Ke Admin Workspace
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full min-h-[44px] px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut size={14} />
                      Keluar / Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Mobile Search Bar (< md) */}
      {showMobileSearch && (
        <div className="md:hidden px-3 pb-3 pt-1 border-t border-slate-100 bg-white space-y-2 animate-fadeIn">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="search"
              autoFocus
              aria-label="Cari modul REEFSIGHT mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredResults.length > 0) {
                  e.preventDefault();
                  handleNavigateSearchResult(filteredResults[0]);
                }
              }}
              placeholder="Cari ekosistem, karang, stasiun ASIK..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          {searchQuery.trim() !== '' && (
            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs">
              {filteredResults.length > 0 ? (
                filteredResults.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleNavigateSearchResult(entry)}
                    className="w-full min-h-[44px] px-3 py-2 text-left hover:bg-orange-50 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{entry.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{entry.subtitle}</div>
                    </div>
                    <ArrowRight size={14} className="text-orange-500 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-2.5 text-slate-500 text-center">
                  Tidak ada modul yang cocok.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dedicated Mobile Workspace Switcher Bar (< sm) */}
      <div className="sm:hidden px-3 pb-2.5 pt-1 border-t border-slate-100/80 bg-white/90">
        {renderWorkspaceButtons(true)}
      </div>
    </header>
  );
}
