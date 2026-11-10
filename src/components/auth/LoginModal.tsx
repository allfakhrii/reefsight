'use client';

import React from 'react';
import { UserRole } from '@/types/reefsight';
import { Shield, Radio, Activity, CheckCircle, Globe, Lock, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  activeRole: UserRole;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSelectRole,
  activeRole
}: Props) {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'admin' as UserRole,
      title: 'Administrator',
      workspace: 'Admin Workspace',
      desc: 'Pengelola seluruh sistem REEFSIGHT: manajemen akun, prototype, kurasi publikasi, dan alert darurat WhatsApp.',
      icon: Shield,
      color: 'border-red-500/40 text-red-400 bg-red-950/20'
    },
    {
      id: 'operator_lapangan' as UserRole,
      title: 'Operator Lapangan (Tim Riset)',
      workspace: 'Research Workspace',
      desc: 'Mengumpulkan data insitu, mengoperasikan hardware EchoVision, serta mengunggah citra, rekaman akustik, dan kedalaman.',
      icon: Radio,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20'
    },
    {
      id: 'peneliti_ekologi' as UserRole,
      title: 'Peneliti Ekologi (Tim Riset)',
      workspace: 'Research Workspace',
      desc: 'Menganalisis bioakustik ACI, tutupan karang, korelasi suhu SST/CHL-a, dan menyusun laporan ilmiah publikasi.',
      icon: Activity,
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/20'
    },
    {
      id: 'validator_data' as UserRole,
      title: 'Validator Data (QA/QC)',
      workspace: 'Research Workspace',
      desc: 'Memeriksa kualitas, konsistensi koordinat, dan kelayakan data sebelum disetujui untuk dipublikasikan ke publik.',
      icon: CheckCircle,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
    },
    {
      id: 'public' as UserRole,
      title: 'Pengunjung Publik / Terdaftar',
      workspace: 'Public Workspace & Data Portal',
      desc: 'Masyarakat, akademisi, dan mahasiswa yang mengeksplorasi ensiklopedia, WebGIS, serta mengunduh dataset riset.',
      icon: Globe,
      color: 'border-slate-500/40 text-slate-300 bg-slate-900/40'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Sistem Autentikasi RBAC REEFSIGHT</h3>
            <p className="text-xs text-slate-400">Pilih simulasi peran akun pengguna untuk mengakses portal</p>
          </div>
        </div>

        <div className="space-y-2.5 mt-5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                <div className={`p-2.5 rounded-xl border mt-0.5 ${r.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{r.title}</h4>
                    <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                      {r.workspace}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            * Seluruh proses autentikasi diverifikasi untuk memastikan pengguna hanya dapat mengakses fitur sesuai hak otorisasi.
          </p>
        </div>
      </div>
    </div>
  );
}
