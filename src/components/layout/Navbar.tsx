'use client';

import React, { useState } from 'react';
import { WorkspaceMode, UserRole } from '@/types/reefsight';
import { 
  Waves, 
  Box, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Activity, 
  Radio, 
  Fish, 
  BookOpen, 
  FileText, 
  Database, 
  Info, 
  Shield, 
  LogIn, 
  LogOut, 
  User, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

interface Props {
  currentWorkspace: WorkspaceMode;
  onSelectWorkspace: (ws: WorkspaceMode) => void;
  activeRole: UserRole;
  onOpenLogin: () => void;
  onLogout: () => void;
  activePublicTab: string;
  onSelectPublicTab: (tab: string) => void;
}

export default function Navbar({
  currentWorkspace,
  onSelectWorkspace,
  activeRole,
  onOpenLogin,
  onLogout,
  activePublicTab,
  onSelectPublicTab
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { id: 'home', label: 'Home', icon: Waves },
    { id: 'prototype', label: 'Prototype 3D', icon: Box },
    { id: 'deployment', label: 'Peta Buoy', icon: MapPin },
    { id: 'distribution', label: 'Distribusi Karang', icon: Layers },
    { id: 'projection', label: 'Proyeksi Karang', icon: TrendingUp },
    { id: 'environmental', label: 'Oseanografi', icon: Activity },
    { id: 'bioacoustics', label: 'Bioakustik', icon: Radio },
    { id: 'biodiversity', label: 'Biodiversitas & Wisata', icon: Fish },
    { id: 'logbook', label: 'Logbook Riset', icon: BookOpen },
    { id: 'publications', label: 'Publikasi', icon: FileText },
    { id: 'erd', label: 'Arsitektur ERD', icon: Database },
    { id: 'about', label: 'Tentang & Kontak', icon: Info },
  ];

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'operator_lapangan': return 'Operator Lapangan';
      case 'peneliti_ekologi': return 'Peneliti Ekologi';
      case 'validator_data': return 'Validator Data';
      default: return 'Pengunjung Publik';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 text-white shadow-xl">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Waves className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white">
                REEF<span className="text-cyan-400">SIGHT</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Pulau Tunda
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Kecerdasan Ekologis Terumbu Karang
            </p>
          </div>
        </div>

        {/* Workspace Switcher (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectWorkspace('public')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentWorkspace === 'public'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Public Workspace
          </button>

          <button
            onClick={() => onSelectWorkspace('research')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentWorkspace === 'research'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Research Workspace
          </button>

          <button
            onClick={() => onSelectWorkspace('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentWorkspace === 'admin'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Admin Panel
          </button>
        </div>

        {/* User Auth & Profile Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              Role: <strong className="text-cyan-400">{getRoleLabel(activeRole)}</strong>
            </span>
          </div>

          {activeRole === 'public' ? (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" /> Login Portal
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                title="Ganti Role Akun"
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Ganti Role
              </button>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 rounded-xl text-xs bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Secondary Navigation (Public Workspace Modules) */}
      {currentWorkspace === 'public' && (
        <div className="hidden md:block bg-slate-950/95 border-t border-slate-900 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max">
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePublicTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPublicTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Pilih Ruang Kerja (Workspace)
            </span>
            <button
              onClick={() => { onSelectWorkspace('public'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-2 rounded-lg text-xs font-bold ${
                currentWorkspace === 'public' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              Public Workspace
            </button>
            <button
              onClick={() => { onSelectWorkspace('research'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-2 rounded-lg text-xs font-bold ${
                currentWorkspace === 'research' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              Research Workspace
            </button>
            <button
              onClick={() => { onSelectWorkspace('admin'); setMobileMenuOpen(false); }}
              className={`w-full text-left p-2 rounded-lg text-xs font-bold ${
                currentWorkspace === 'admin' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              Admin Panel
            </button>
          </div>

          {currentWorkspace === 'public' && (
            <div className="pt-3 border-t border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Navigasi Publik
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {publicNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onSelectPublicTab(item.id); setMobileMenuOpen(false); }}
                    className={`p-2 rounded-lg text-left text-xs ${
                      activePublicTab === item.id ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
