'use client';

import React from 'react';
import { WorkspaceMode, UserRole } from '@/types/reefsight';
import {
  Home,
  MapPin,
  Compass,
  Fish,
  Activity,
  Waves,
  Mic2,
  Camera,
  Palmtree,
  BookOpen,
  Info,
  Users,
  Cpu,
  Database,
  Bell,
  FileText,
  Sliders,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

interface AppSidebarProps {
  workspace: WorkspaceMode;
  activeRole: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
  onOpenLogin: () => void;
}

export default function AppSidebar({
  workspace,
  activeRole,
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  onOpenLogin
}: AppSidebarProps) {
  // Navigation definitions per workspace matching extracted_designs mockups
  const publicNavItems = [
    { id: 'home', label: 'Home', icon: Home, desc: 'Ecological Encyclopedia' },
    { id: 'webgis', label: 'WebGIS & Deployment', icon: MapPin, desc: 'Prototype Locations' },
    { id: 'coral-distribution', label: 'Coral Distribution', icon: Layers, desc: 'ArcGIS Interpretation' },
    { id: 'coral-projection', label: 'Coral Projection', icon: Compass, desc: 'Future Modeling' },
    { id: 'biodiversity', label: 'Biodiversity Explorer', icon: Fish, desc: 'Coral & Reef Fish' },
    { id: 'ecological-assessment', label: 'Reef Health (RHI)', icon: Activity, desc: 'Ecological Assessment' },
    { id: 'ocean-environment', label: 'Ocean Environment', icon: Waves, desc: 'SST & Chlorophyll-a' },
    { id: 'acoustic-intelligence', label: 'Acoustic Intelligence', icon: Mic2, desc: 'Soundscape & Waveform' },
    { id: 'prototype-3d', label: 'Prototype Intelligence', icon: Cpu, desc: 'EchoVision 3D Hardware' },
    { id: 'eco-tourism', label: 'Eco-Tourism & Conservation', icon: Palmtree, desc: 'Suitability Planner' },
    { id: 'research-logbook', label: 'Research & Publications', icon: BookOpen, desc: 'Scientific Documents' },
    { id: 'system-architecture', label: 'ERD & Architecture', icon: Database, desc: 'System Database' },
    { id: 'about', label: 'About REEFSIGHT', icon: Info, desc: 'Vision & Partners' }
  ];

  const researchNavItems = [
    { id: 'dashboard', label: 'Research Dashboard', icon: Home, desc: 'Operations & Summary' },
    { id: 'field-collection', label: 'Field Data Collection', icon: Camera, desc: 'Sensor & Visual Upload' },
    { id: 'environmental-data', label: 'Environmental Data', icon: Waves, desc: 'SST & Water Quality' },
    { id: 'coral-analysis', label: 'Coral Distribution', icon: Layers, desc: 'ArcGIS Analysis' },
    { id: 'ecological-dynamics', label: 'Ecological Dynamics', icon: Activity, desc: 'Multi-Sensor Integration' },
    { id: 'data-validation', label: 'Data Validation (QA/QC)', icon: CheckCircle2, desc: 'Review & Verify' },
    { id: 'research-logbook', label: 'Research Logbook', icon: BookOpen, desc: 'Chronological Logs' },
    { id: 'scientific-reports', label: 'Scientific Reports', icon: FileText, desc: 'PDF Report Generator' }
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: Home, desc: 'Platform Overview' },
    { id: 'user-management', label: 'User Management', icon: Users, desc: 'RBAC Accounts & Roles' },
    { id: 'prototype-management', label: 'Prototype Management', icon: Cpu, desc: 'EchoVision Device Fleet' },
    { id: 'data-management', label: 'Data Management', icon: Database, desc: 'Datasets & GeoJSON' },
    { id: 'alert-management', label: 'Alert Management', icon: Bell, desc: 'Anomalies & WhatsApp API' },
    { id: 'publication-management', label: 'Publication Management', icon: BookOpen, desc: 'Approve & Publish' },
    { id: 'activity-logs', label: 'Activity Logs & Audit', icon: Activity, desc: 'System Audit Trail' },
    { id: 'settings', label: 'System Settings', icon: Sliders, desc: 'API & Gateway Config' }
  ];

  const navItems =
    workspace === 'public'
      ? publicNavItems
      : workspace === 'research'
      ? researchNavItems
      : adminNavItems;

  const workspaceSubtitle =
    workspace === 'public'
      ? 'Ecological Intelligence Platform'
      : workspace === 'research'
      ? 'Research & Field Workspace'
      : 'Admin Workspace';

  return (
    <aside
      aria-label="Navigasi Utama"
      className={`h-dvh lg:fixed lg:top-0 lg:left-0 lg:bottom-0 z-30 flex flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300 w-72 max-w-[85vw] ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
        <button
          type="button"
          onClick={() => onSelectTab(navItems[0].id)}
          className="flex items-center gap-3 text-left overflow-hidden min-h-[44px] group"
        >
          {/* Coral Logo Icon */}
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <img
              src="/brand/reefsight-icon.svg"
              alt="REEFSIGHT"
              className="w-full h-full object-contain"
            />
          </div>
          <div className={`flex flex-col ${isCollapsed ? 'lg:hidden' : ''}`}>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight flex items-center gap-1.5">
              REEFSIGHT
              {workspace !== 'public' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  {workspace}
                </span>
              )}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight truncate">
              {workspaceSubtitle}
            </span>
          </div>
        </button>

        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 items-center justify-center transition-colors flex-shrink-0"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile drawer close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Role Pill Indicator (for Research & Admin) */}
      {workspace !== 'public' && (
        <div className={`mx-3 mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                Active Role
              </p>
              <p className="text-xs font-semibold text-slate-800 capitalize truncate">
                {activeRole.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="min-h-[36px] px-2 text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline flex-shrink-0"
          >
            Switch
          </button>
        </div>
      )}

      {/* Nav List */}
      <nav aria-label="Daftar Modul" className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${
                isActive
                  ? 'bg-orange-50 text-orange-700 font-semibold shadow-sm shadow-orange-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              }`}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-transform ${
                  isActive
                    ? 'text-orange-600 scale-110'
                    : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />

              <div className={`flex-1 min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
                <div className="text-sm leading-tight truncate">{item.label}</div>
                <div className="text-[11px] text-slate-500 group-hover:text-slate-600 leading-tight truncate">
                  {item.desc}
                </div>
              </div>

              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1 bg-orange-500 rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Area with Pulau Tunda Coordinates and Watermark */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 text-white relative overflow-hidden shadow-inner ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 opacity-15 pointer-events-none">
            <img
              src="/brand/reefsight-icon.svg"
              alt=""
              className="w-full h-full object-contain filter brightness-200"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={12} />
            Pulau Tunda, Banten
          </div>
          <p className="text-xs font-medium text-slate-200 leading-relaxed mb-2">
            5.813° S, 106.274° E
          </p>
          <div className="flex items-center justify-between text-[10px] text-cyan-200/80 pt-1 border-t border-white/10">
            <span>12 Mooring Stations</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              ● Live Telemetry
            </span>
          </div>
        </div>
        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-1">
            <div className="w-9 h-9 rounded-full bg-cyan-900 text-white flex items-center justify-center text-xs font-bold shadow">
              PT
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
