'use client';

import React, { useState } from 'react';
import { UserRole, SystemAlert, UserProfile } from '@/types/reefsight';
import {
  USER_DIRECTORY,
  SYSTEM_ALERTS_MOCK,
  PROTOTYPE_INVENTORY,
  PULAU_TUNDA_STATIONS
} from '@/data/mockData';
import {
  Shield,
  Users,
  Cpu,
  Database,
  Globe,
  ListFilter,
  Bell,
  Send,
  CheckCircle2,
  AlertTriangle,
  Check,
  Phone,
  MessageSquare,
  Lock,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  Activity,
  Layers,
  Calendar,
  X,
  FileText,
  Sliders,
  CheckCircle
} from 'lucide-react';

type AdminTabId =
  | 'dashboard'
  | 'user-management'
  | 'prototype-management'
  | 'data-management'
  | 'alert-management'
  | 'publication-management'
  | 'activity-logs'
  | 'settings';

const VALID_ADMIN_TABS: AdminTabId[] = [
  'dashboard',
  'user-management',
  'prototype-management',
  'data-management',
  'alert-management',
  'publication-management',
  'activity-logs',
  'settings',
];

interface Props {
  activeRole: UserRole;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function AdminWorkspaceView({
  activeRole,
  activeTab: controlledTab,
  onSelectTab,
}: Props) {
  const [internalTab, setInternalTab] = useState<AdminTabId>('dashboard');
  const activeTab: AdminTabId =
    controlledTab && VALID_ADMIN_TABS.includes(controlledTab as AdminTabId)
      ? (controlledTab as AdminTabId)
      : internalTab;
  const setActiveTab = (tab: AdminTabId) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };
  const [adminNotice, setAdminNotice] = useState<{
    scope: 'telemetry' | 'user' | 'alert';
    tone: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  // Users Management state matching image18.png
  const [users, setUsers] = useState<UserProfile[]>(USER_DIRECTORY as UserProfile[]);
  const [selectedUser, setSelectedUser] = useState<UserProfile>(USER_DIRECTORY[0] as UserProfile);
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('operator_lapangan');
  const [newUserInst, setNewUserInst] = useState('');

  // Alerts Management state matching image23.png
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS_MOCK as unknown as SystemAlert[]);
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert>(SYSTEM_ALERTS_MOCK[0] as unknown as SystemAlert);
  const [alertFilterType, setAlertFilterType] = useState('All');
  const [officerPhone, setOfficerPhone] = useState('085892640228');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Prototype fleet state matching image19.png
  const [devices, setDevices] = useState(PROTOTYPE_INVENTORY);

  // Handle WhatsApp API Dispatch matching image23.png
  const handleSendWhatsApp = (alertItem: SystemAlert) => {
    const updated = alerts.map((a) => {
      if (a.id === alertItem.id) {
        return {
          ...a,
          whatsappDispatched: true,
          whatsappRecipient: officerPhone
        };
      }
      return a;
    });

    setAlerts(updated);
    setSelectedAlert({
      ...selectedAlert,
      whatsappDispatched: true,
      whatsappRecipient: officerPhone
    });

    setDispatchStatus(`Notifikasi WhatsApp Alert terkirim ke ${officerPhone} (Dimas Pratama - Operator). Gateway API 200 OK.`);
    setTimeout(() => setDispatchStatus(null), 5000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `USR-00${users.length + 1}`,
      fullName: newUserName,
      username: newUserName.toLowerCase().replace(/\s+/g, '.'),
      email: newUserEmail,
      role: newUserRole,
      institution: newUserInst || 'Universitas / Lembaga Riset',
      position: 'Staf Peneliti',
      phone: '081200000000',
      accountStatus: 'Active' as const,
      lastActivity: 'Baru saja',
      createdAt: '14 Nov 2025',
      avatarUrl: ''
    };

    setUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Subtabs Navigation matching image17.jpeg */}
      <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700">
        {[
          { id: 'dashboard', label: 'Admin Dashboard', icon: Activity },
          { id: 'user-management', label: 'User Management', icon: Users },
          { id: 'prototype-management', label: 'Prototype Management', icon: Cpu },
          { id: 'data-management', label: 'Data Management', icon: Database },
          { id: 'alert-management', label: 'Alert Management', icon: Bell },
          { id: 'publication-management', label: 'Publication Management', icon: Globe },
          { id: 'activity-logs', label: 'Activity Logs', icon: ListFilter },
          { id: 'settings', label: 'Settings', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-orange-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 01. TAB: ADMIN DASHBOARD - image17.jpeg                   */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Panoramic Banner matching image17.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_16.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                ADMIN DASHBOARD
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Admin Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Monitor platform operations, research data, prototype devices, and administrative activities across REEFSIGHT.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAdminNotice({
                      scope: 'telemetry',
                      tone: 'success',
                      message: 'Data telemetri 12 stasiun mooring dan sensor optik berhasil disinkronkan ulang.',
                    })
                  }
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <RefreshCw size={14} />
                  <span>Refresh Data</span>
                </button>
                <span className="text-xs text-slate-300">
                  Last update: 14 Nov 2025, 10:24 WIB
                </span>
              </div>
            </div>
          </div>

          {/* Platform Overview Metrics matching image17.jpeg */}
          {adminNotice?.scope === 'telemetry' && (
            <div
              role="status"
              className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3"
            >
              <span className="font-medium leading-relaxed">{adminNotice.message}</span>
              <button
                type="button"
                onClick={() => setAdminNotice(null)}
                aria-label="Tutup pemberitahuan sinkronisasi"
                className="min-w-[44px] min-h-[44px] -my-2 -mr-2 inline-flex items-center justify-center rounded-xl hover:bg-emerald-100 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('user-management')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('user-management');
                }
              }}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 focus-visible:outline-2 focus-visible:outline-orange-500 cursor-pointer transition-all min-w-0"
            >
              <div className="text-xs text-slate-400 font-semibold">Total Users</div>
              <div className="text-2xl font-black text-slate-900 mt-1">128</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">93 Active · 35 Inactive</div>
            </div>
            <div
              onClick={() => setActiveTab('prototype-management')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 cursor-pointer transition-all"
            >
              <div className="text-xs text-slate-400 font-semibold">Prototype Devices</div>
              <div className="text-2xl font-black text-blue-600 mt-1">12</div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">8 Active · 2 Maintenance</div>
            </div>
            <div
              onClick={() => setActiveTab('data-management')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 cursor-pointer transition-all"
            >
              <div className="text-xs text-slate-400 font-semibold">Total Research Data</div>
              <div className="text-2xl font-black text-purple-600 mt-1">2,846</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ +5.2% (7 hari terakhir)</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Pending Validation</div>
              <div className="text-2xl font-black text-amber-600 mt-1">317</div>
              <div className="text-[10px] text-amber-700 font-medium mt-1">12.5% dari total data</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Validated Data</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">2,312</div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1">81.3% dari total data</div>
            </div>
            <div
              onClick={() => setActiveTab('alert-management')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 cursor-pointer transition-all"
            >
              <div className="text-xs text-slate-400 font-semibold">Alert Center</div>
              <div className="text-2xl font-black text-rose-600 mt-1">248</div>
              <div className="text-[10px] text-rose-700 font-medium mt-1">12 Critical · 38 High</div>
            </div>
          </div>

          {/* User Distribution & Device Status matching image17.jpeg */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                User Distribution by Role
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Admin
                  </span>
                  <span className="font-bold text-slate-900">6 (4.7%)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Operator Lapangan
                  </span>
                  <span className="font-bold text-slate-900">38 (29.7%)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Peneliti Ekologi
                  </span>
                  <span className="font-bold text-slate-900">56 (43.8%)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Validator Data
                  </span>
                  <span className="font-bold text-slate-900">28 (21.9%)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Research Data by Category
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Acoustic Data</span>
                  <span className="font-bold text-slate-900">506 files</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[35%]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Optical Data</span>
                  <span className="font-bold text-slate-900">712 files</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[50%]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Environmental Data</span>
                  <span className="font-bold text-slate-900">684 records</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[45%]" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                System Monitoring
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Web Application (Next.js)', status: 'Online' },
                  { name: 'Database (Supabase PostGIS)', status: 'Online' },
                  { name: 'Storage Service', status: 'Online' },
                  { name: 'WebGIS Service (MapLibre)', status: 'Online' },
                  { name: 'WhatsApp Gateway API', status: 'Online' }
                ].map((s) => (
                  <div key={s.name} className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 02. TAB: USER MANAGEMENT - image18.png                    */}
      {/* ======================================================== */}
      {activeTab === 'user-management' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image18.png */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_01.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                USER MANAGEMENT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                User Management
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Manage internal REEFSIGHT accounts, user roles, access permissions, and account activities.
              </p>
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <UserPlus size={14} />
                <span>+ Add User</span>
              </button>
            </div>
          </div>

          {/* User Metrics matching image18.png */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-slate-900">128</div>
              <div className="text-xs font-bold text-slate-800">Total Users</div>
              <div className="text-[10px] text-slate-400">All registered accounts</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-emerald-600">93</div>
              <div className="text-xs font-bold text-slate-800">Active Users</div>
              <div className="text-[10px] text-emerald-700">72.7% of total users</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-rose-600">35</div>
              <div className="text-xs font-bold text-slate-800">Inactive Users</div>
              <div className="text-[10px] text-rose-700">27.3% of total users</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-amber-600">6</div>
              <div className="text-xs font-bold text-slate-800">Pending / Restricted</div>
              <div className="text-[10px] text-amber-700">Awaiting activation</div>
            </div>
          </div>

          {/* Main Grid: User Directory (Left) & User Profile Detail (Right) matching image18.png */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Directory Table */}
            <div className="lg:col-span-2 p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900">User Directory</h3>
                <div className="relative w-full sm:w-56">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari nama, username, peran..."
                    aria-label="Cari pengguna berdasarkan nama, username, atau peran"
                    className="w-full min-h-[42px] sm:min-h-[36px] pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Last Activity</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users
                      .filter((usr) => {
                        const q = userSearch.trim().toLowerCase();
                        if (!q) return true;
                        return Object.values(usr).some((val) =>
                          String(val ?? '').toLowerCase().includes(q)
                        );
                      })
                      .map((usr) => (
                      <tr
                        key={usr.id}
                        onClick={() => setSelectedUser(usr)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedUser.id === usr.id ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{usr.fullName}</div>
                          <div className="text-[10px] text-slate-400">{usr.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              usr.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : usr.role === 'peneliti_ekologi'
                                ? 'bg-blue-100 text-blue-700'
                                : usr.role === 'operator_lapangan'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {usr.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              usr.accountStatus === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {usr.accountStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{usr.lastActivity}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            aria-label="Lihat detail pengguna"
                            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Drawer: User Profile Detail matching image18.png */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                  {selectedUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{selectedUser.fullName}</h4>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase mt-1">
                    {selectedUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap justify-between gap-1.5 py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Username</span>
                  <span className="font-semibold text-slate-800 break-all">{selectedUser.username}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-1.5 py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Email</span>
                  <span className="font-semibold text-slate-800 break-all">{selectedUser.email}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-1.5 py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Institusi</span>
                  <span className="font-semibold text-slate-800 text-right">{selectedUser.institution}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-1.5 py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Status Akun</span>
                  <span className="font-bold text-emerald-600">● {selectedUser.accountStatus}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {adminNotice?.scope === 'user' && (
                  <div
                    role="status"
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      adminNotice.tone === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-sky-50 border-sky-200 text-sky-900'
                    }`}
                  >
                    <span className="leading-snug font-medium">{adminNotice.message}</span>
                    <button
                      type="button"
                      onClick={() => setAdminNotice(null)}
                      aria-label="Tutup pemberitahuan akun"
                      className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg hover:bg-black/5 flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setAdminNotice({
                      scope: 'user',
                      tone: 'info',
                      message: `Tautan reset password akun ${selectedUser.username} telah dikirim ke ${selectedUser.email}.`,
                    })
                  }
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAdminNotice({
                      scope: 'user',
                      tone: 'warning',
                      message: `Permintaan perubahan status aktif/nonaktif akun ${selectedUser.username} telah dicatat pada log audit.`,
                    })
                  }
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                >
                  Deactivate User
                </button>
              </div>
            </div>
          </div>

          {/* Add User Modal */}
          {isAddUserModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Tambah akun pengguna baru"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsAddUserModalOpen(false);
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsAddUserModalOpen(false);
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
            >
              <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-center gap-3 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">+ Add New User Account</h3>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setIsAddUserModalOpen(false)}
                    aria-label="Tutup modal tambah pengguna"
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleAddUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Dr. Budi Santoso"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="budi@reefsight.id"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Role / Peran Akses</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="operator_lapangan">Operator Lapangan</option>
                      <option value="peneliti_ekologi">Peneliti Ekologi</option>
                      <option value="validator_data">Validator Data</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institusi Asal</label>
                    <input
                      type="text"
                      value={newUserInst}
                      onChange={(e) => setNewUserInst(e.target.value)}
                      placeholder="e.g. BRIN / UPI / Komunitas Tunda"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold"
                    >
                      Buat Akun
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 03. TAB: ALERT MANAGEMENT - image23.png                   */}
      {/* ======================================================== */}
      {activeTab === 'alert-management' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image23.png */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_10.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                ALERT MANAGEMENT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Alert Management
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Monitor ecological alerts, verify detection results, manage notifications, and track field responses for reef ecosystem conditions in Pulau Tunda.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleSendWhatsApp(selectedAlert)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Send size={14} />
                  <span>Send WhatsApp Notification</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAdminNotice({
                      scope: 'alert',
                      tone: 'info',
                      message: 'Laporan rekapitulasi peringatan dini (CSV & ringkasan PDF) siap diunduh.',
                    })
                  }
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Download size={14} />
                  <span>Export Report</span>
                </button>
                {adminNotice?.scope === 'alert' && (
                  <p
                    role="status"
                    className="w-full text-[11px] font-medium text-emerald-200 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-3 py-2 mt-1"
                  >
                    {adminNotice.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp Success banner */}
          {dispatchStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              {dispatchStatus}
            </div>
          )}

          {/* Alert Metric Cards matching image23.png */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-slate-900">248</div>
              <div className="text-[10px] font-bold text-slate-700">Total Alerts</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-rose-600">12</div>
              <div className="text-[10px] font-bold text-slate-700">Critical</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-orange-600">38</div>
              <div className="text-[10px] font-bold text-slate-700">High</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-blue-600">96</div>
              <div className="text-[10px] font-bold text-slate-700">Medium</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-slate-600">54</div>
              <div className="text-[10px] font-bold text-slate-700">Low</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-emerald-600">73</div>
              <div className="text-[10px] font-bold text-slate-700">Verified</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-purple-600">61</div>
              <div className="text-[10px] font-bold text-slate-700">Resolved</div>
            </div>
          </div>

          {/* Alert Stepper Workflow matching image23.png */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center flex items-center justify-between overflow-x-auto text-xs text-slate-600 font-semibold gap-2">
            <span>Detection</span>
            <span className="text-slate-300">→</span>
            <span>Alert Generated</span>
            <span className="text-slate-300">→</span>
            <span>Admin Monitoring</span>
            <span className="text-slate-300">→</span>
            <span className="text-orange-600 font-bold">Research Verification</span>
            <span className="text-slate-300">→</span>
            <span className="text-emerald-600 font-bold">WhatsApp Dispatch</span>
            <span className="text-slate-300">→</span>
            <span>Field Response</span>
          </div>

          {/* Main Grid: Alert List (Left) & Alert Detail Drawer (Right) matching image23.png */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alert List Table */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">All Alerts (248)</h3>
                <span className="text-xs text-slate-400">Pulau Tunda Stations</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Alert ID</th>
                      <th className="py-2.5 px-3">Station</th>
                      <th className="py-2.5 px-3">Condition</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alerts.map((alt) => (
                      <tr
                        key={alt.id}
                        onClick={() => setSelectedAlert(alt)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedAlert.id === alt.id ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{alt.alertCode}</td>
                        <td className="py-3 px-3 text-slate-700">{alt.stationCode}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{alt.alertType}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              alt.severity === 'Critical' || alt.severity === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : alt.severity === 'Medium'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {alt.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {alt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Drawer: Alert Detail matching image23.png */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{selectedAlert.alertType}</h4>
                  <p className="font-mono text-xs text-slate-400">{selectedAlert.alertCode}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                  {selectedAlert.severity}
                </span>
              </div>

              <div className="h-36 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src="/images/coral-surveys/tunda_transect_10.jpg"
                  alt="Alert Detail"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Lokasi</span>
                  <span className="font-semibold text-slate-800">{selectedAlert.stationName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Waktu Deteksi</span>
                  <span className="font-semibold text-slate-800">{selectedAlert.detectedAt}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Model Confidence</span>
                  <span className="font-bold text-slate-900">{Math.round(selectedAlert.confidence * 100)}%</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold block">Detection Summary:</span>
                <p className="leading-relaxed">{selectedAlert.summary}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSendWhatsApp(selectedAlert)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Send size={14} />
                  <span>Kirim WhatsApp Notifikasi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs fallback for remaining admin modules */}
      {(activeTab === 'prototype-management' ||
        activeTab === 'data-management' ||
        activeTab === 'publication-management' ||
        activeTab === 'activity-logs' ||
        activeTab === 'settings') && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-xl">
            🛡️
          </div>
          <h3 className="text-lg font-bold text-slate-900 capitalize">
            {activeTab.replace('-', ' ')}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Modul administrasi sistem REEFSIGHT dengan kontrol penuh konfigurasi database Supabase PostGIS, hak akses RBAC, dan audit trail operasional.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Kembali ke Admin Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
