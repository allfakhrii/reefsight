'use client';

import React, { useState } from 'react';
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
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface AppHeaderProps {
  workspace: WorkspaceMode;
  onSelectWorkspace: (ws: WorkspaceMode) => void;
  activeRole: UserRole;
  activeTab: string;
  onOpenLogin: () => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

export default function AppHeader({
  workspace,
  onSelectWorkspace,
  activeRole,
  activeTab,
  onOpenLogin,
  onLogout,
  onToggleMobileSidebar
}: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumbTitle = () => {
    const formattedTab = activeTab
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    if (workspace === 'public') {
      return `Public Workspace > ${formattedTab}`;
    }
    if (workspace === 'research') {
      return `Research Workspace > ${formattedTab}`;
    }
    return `Admin Workspace > ${formattedTab}`;
  };

  const getRoleDisplayName = () => {
    switch (activeRole) {
      case 'admin':
        return 'Reza Gading Oktavian (Administrator)';
      case 'peneliti_ekologi':
        return 'Dr. Aulia Rahma (Peneliti Ekologi)';
      case 'operator_lapangan':
        return 'Dimas Pratama (Operator Lapangan)';
      case 'validator_data':
        return 'Sinta Nurhaliza (Validator Data)';
      default:
        return 'Pengunjung Publik';
    }
  };

  const getRoleBadgeStyle = () => {
    switch (activeRole) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'peneliti_ekologi':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'operator_lapangan':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'validator_data':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left side: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle mobile menu"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          {/* Workspace Switcher Pill */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => onSelectWorkspace('public')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                workspace === 'public'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Public
            </button>
            <button
              onClick={() => onSelectWorkspace('research')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                workspace === 'research'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Research
            </button>
            <button
              onClick={() => onSelectWorkspace('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                workspace === 'admin'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          <span className="hidden md:inline-block text-slate-300">|</span>
          <span className="hidden md:inline-block text-xs font-medium text-slate-500 truncate max-w-xs">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ekosistem, spesies karang, stasiun buoy, atau dokumen..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Alerts & User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            aria-label="Notification center"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Quick Alert Notification Dropdown */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-orange-500" />
                  Notifikasi Anomali Ekologis
                </span>
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
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
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowAlertMenu(false);
                    onSelectWorkspace('admin');
                  }}
                  className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
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
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-xs shadow-sm shadow-orange-500/20 hover:from-orange-600 hover:to-rose-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            <LogIn size={15} />
            <span>Login Workspace</span>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center">
                {activeRole === 'admin' ? 'RG' : 'AR'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {activeRole === 'admin' ? 'Reza Gading O.' : 'Dr. Aulia R.'}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getRoleBadgeStyle()}`}
                >
                  {activeRole.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-800">{getRoleDisplayName()}</p>
                  <p className="text-[10px] text-slate-500">
                    Pulau Tunda Marine Ecological Intelligence
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLogin();
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2 font-medium"
                  >
                    <User size={14} />
                    Ganti Peran / Switch Role
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectWorkspace('public');
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Compass size={14} />
                    Ke Public Workspace
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectWorkspace('research');
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 size={14} />
                    Ke Research Workspace
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectWorkspace('admin');
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Shield size={14} />
                    Ke Admin Workspace
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
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
    </header>
  );
}
