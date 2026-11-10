'use client';

import React, { useState } from 'react';
import { UserRole, AlertNotification } from '@/types/reefsight';
import { MOCK_ALERTS, PULAU_TUNDA_STATIONS } from '@/data/mockData';
import { formatRupiah } from '@/lib/utils';
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
  UserPlus
} from 'lucide-react';

interface Props {
  activeRole: UserRole;
}

export default function AdminWorkspaceView({ activeRole }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'prototypes' | 'alerts' | 'publications'>('dashboard');

  // Admin state
  const [alerts, setAlerts] = useState<AlertNotification[]>(MOCK_ALERTS);
  const [officerPhone, setOfficerPhone] = useState('085892640228');
  const [selectedAlert, setSelectedAlert] = useState<AlertNotification | null>(alerts[0]);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Users Mock State
  const [users, setUsers] = useState([
    { id: 'USR-01', name: 'Dr. Ilham S.Kel', role: 'validator_data', email: 'ilham@reefsight.id', status: 'Active' },
    { id: 'USR-02', name: 'Fakhri M.Si', role: 'operator_lapangan', email: 'fakhri@reefsight.id', status: 'Active' },
    { id: 'USR-03', name: 'Darmawan S.Pi', role: 'peneliti_ekologi', email: 'darmawan@reefsight.id', status: 'Active' },
    { id: 'USR-04', name: 'Rahmat (Patroli Tunda)', role: 'operator_lapangan', email: 'rahmat@tunda.desa.id', status: 'Active' }
  ]);

  // Handle WhatsApp Dispatch Simulation
  const handleDispatchWhatsApp = (alertItem: AlertNotification) => {
    const updated = alerts.map(a => {
      if (a.id === alertItem.id) {
        return {
          ...a,
          verification_status: 'Dispatched to Officer' as const,
          whatsapp_dispatched: true,
          officer_phone: officerPhone,
          dispatch_timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB'
        };
      }
      return a;
    });

    setAlerts(updated);
    setDispatchSuccess(`Notifikasi WhatsApp Alert terkirim ke ${officerPhone} via Gateway API.`);
    setTimeout(() => setDispatchSuccess(null), 5000);
  };

  const generateWhatsAppMessagePreview = (a: AlertNotification) => {
    return `*REEFSIGHT FIELD ALERT*
🚨 *Peringatan:* ${a.condition_type}
📍 *Station:* ${a.station_id} (Pulau Tunda, Banten)
⚠️ *Severity:* ${a.severity}
🕒 *Waktu Deteksi:* ${a.timestamp}

*Indikasi & Penyebab:*
${a.likely_cause.map(c => `• ${c}`).join('\n')}

*Rekomendasi Tindakan Lapangan:*
${a.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

_Status: Diverifikasi & Diteruskan ke Petugas Lapangan_`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950/30 to-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Admin Workspace & Control Panel
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Pusat Kendali Sistem REEFSIGHT</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Pengelolaan pengguna, unit prototipe EchoVision, kurasi publikasi data, audit logbook, dan pusat penanganan peringatan (*Alert Center*) terintegrasi WhatsApp API.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-950 border border-red-700 text-red-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Akses Administrator Penuh
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: 'Admin Dashboard', icon: Shield },
            { id: 'users', label: 'User Management', icon: Users, badge: users.length },
            { id: 'prototypes', label: 'Prototype Management', icon: Cpu, badge: 12 },
            { id: 'alerts', label: 'Alert Center (WhatsApp API)', icon: Bell, badge: alerts.filter(a => !a.whatsapp_dispatched).length },
            { id: 'publications', label: 'Publication Management', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ADMIN DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Akun Peneliti Terdaftar</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-white">{users.length} Akun</span>
                <span className="text-xs text-emerald-400 font-semibold">100% Aktif</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Unit EchoVision Deployed</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">12 Buoy</span>
                <span className="text-xs text-slate-400">Pulau Tunda</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Peringatan Ekologis Aktif</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-amber-400 font-mono">{alerts.length} Kasus</span>
                <span className="text-xs text-red-400 font-semibold">1 Kritis</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Nilai Total Hardware (BOM)</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-emerald-400 font-mono">{formatRupiah(25440000)}</span>
                <span className="text-[10px] text-slate-400 font-medium">12 Unit</span>
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Ringkasan Operasional Sistem REEFSIGHT</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Database & Storage (Supabase)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  PostgreSQL 16 + PostGIS extension aktif. Bucket audio hydrophone dan media optik beroperasi normal tanpa kendala kuota.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Serverless Runtime (Vercel)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Semua Server Actions dan Middleware RBAC berjalan dengan latensi rata-rata 32 ms. Zero downtime tercatat.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">WhatsApp Notification Gateway</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Gateway webhook Fonnte/Wablas terhubung ke nomor petugas lapangan Pulau Tunda: <code className="text-amber-300">085892640228</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">User Management (RBAC Tim Riset)</h3>
              <p className="text-xs text-slate-400">Kelola akun dan tentukan fungsi kerja pengguna internal.</p>
            </div>
            <button
              onClick={() => alert('Formulir penambahan user tim riset baru.')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" /> Tambah Akun Tim Riset
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Fungsi Kerja (Role)</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-semibold">{u.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Edit hak akses untuk ${u.name}`)}
                        className="text-xs text-cyan-400 hover:underline font-semibold"
                      >
                        Ubah Hak Akses
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROTOTYPE MANAGEMENT */}
      {activeTab === 'prototypes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Prototype Management (EchoVision / ASIK v2.0)</h3>
              <p className="text-xs text-slate-400">Inventarisasi 12 unit prototipe pemantau bawah air dan komponen Bill of Materials (BOM).</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
              Total BOM / Unit: {formatRupiah(2120000)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PULAU_TUNDA_STATIONS.map(st => (
              <div key={st.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">{st.prototype_id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    st.status === 'Active' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                  }`}>
                    {st.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white">{st.name}</h4>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p>Koordinat: {st.latitude.toFixed(4)}, {st.longitude.toFixed(4)}</p>
                  <p>Kedalaman: {st.depth_m} meter</p>
                  <p>Sensor: Hydrophone + Kamera Optik + Temp</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALERT CENTER & WHATSAPP API */}
      {activeTab === 'alerts' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
                <h3 className="text-base font-bold text-white">Alert Center & WhatsApp Notification Gateway</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat verifikasi notifikasi stres karang dan pengiriman dispatch instan ke petugas patroli lapangan Pulau Tunda.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Nomor Petugas:</span>
              <input
                type="text"
                value={officerPhone}
                onChange={(e) => setOfficerPhone(e.target.value)}
                className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>

          {dispatchSuccess && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{dispatchSuccess}</span>
            </div>
          )}

          {/* Alert List & WhatsApp Preview Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Active Alerts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Peringatan Sistem</h4>
              {alerts.map(a => {
                const isSelected = selectedAlert?.id === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAlert(a)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/80 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-white flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${a.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
                        {a.condition_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.severity === 'Critical' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {a.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{a.description}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                      <span>Stasiun: <strong className="text-cyan-300">{a.station_id}</strong></span>
                      <span>
                        Status: <strong className={a.whatsapp_dispatched ? 'text-emerald-400' : 'text-amber-400'}>
                          {a.whatsapp_dispatched ? 'WhatsApp Terkirim' : 'Belum Dikirim'}
                        </strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: WhatsApp Message Simulation & Dispatch Trigger */}
            {selectedAlert && (
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white">Pratinjau Pesan WhatsApp Gateway API</h4>
                  </div>

                  {/* Mock WhatsApp Chat Bubble */}
                  <div className="mt-3 p-4 bg-[#0b2b26] rounded-2xl border border-emerald-800/50 font-sans text-xs text-emerald-100 whitespace-pre-wrap leading-relaxed shadow-lg">
                    {generateWhatsAppMessagePreview(selectedAlert)}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleDispatchWhatsApp(selectedAlert)}
                    disabled={selectedAlert.whatsapp_dispatched}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                      selectedAlert.whatsapp_dispatched
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {selectedAlert.whatsapp_dispatched ? 'Peringatan Sudah Diteruskan ke Petugas' : 'Kirim Alert WhatsApp ke Petugas Lapangan Sekarang'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PUBLICATION MANAGEMENT */}
      {activeTab === 'publications' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-4">
          <h3 className="text-base font-bold text-white">Publication Management</h3>
          <p className="text-xs text-slate-400">
            Kurasi dataset dan laporan ilmiah yang memperoleh izin untuk dapat diakses dan diunduh oleh publik di Public Workspace.
          </p>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
            Seluruh data pengamatan yang berstatus <strong className="text-emerald-400">Approved</strong> secara otomatis diintegrasikan ke dalam portal publikasi dan WebGIS.
          </div>
        </div>
      )}
    </div>
  );
}
