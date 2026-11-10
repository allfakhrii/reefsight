'use client';

import React from 'react';
import { Waves, Heart, ShieldCheck, MapPin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Project Overview */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Waves className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-white tracking-wider text-sm">REEFSIGHT</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Platform Kecerdasan Ekologis untuk Analisis Dinamika dan Tekanan Lingkungan Terumbu Karang di Pulau Tunda, Kabupaten Serang, Banten.
          </p>
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px]">
            <MapPin className="w-3.5 h-3.5" /> Koordinat: 5°48'46"S 106°16'36"E
          </div>
        </div>

        {/* Col 2: Workspace Nav */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ruang Kerja</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>Public Workspace (Ensiklopedia & WebGIS)</li>
            <li>Research Workspace (Field, Bioakustik & Validasi)</li>
            <li>Admin Workspace (Platform Control & WhatsApp Alert)</li>
            <li>Public Data Portal (Unduh Dataset Riset)</li>
          </ul>
        </div>

        {/* Col 3: Hardware & Technology */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Teknologi Terpadu</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>EchoVision Buoy Prototype (ASIK v2.0)</li>
            <li>Sensor Akustik Hydrophone Bawah Air</li>
            <li>Kamera Optik Bentik Bawah Laut</li>
            <li>WebGIS MapLibre GL JS & PostGIS</li>
            <li>Analisis Termal NOAA (DHW & MMM)</li>
          </ul>
        </div>

        {/* Col 4: Lembaga & Kolaborasi */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Kolaborasi & Konservasi</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Bekerja sama dengan Masyarakat Pulau Tunda, Komunitas Konservasi Selat Sunda, dan Laboratorium Oseanografi & Biosains Kelautan.
          </p>
          <div className="pt-2 text-[11px] text-slate-500">
            Kontak Tim Riset: <br />
            <a href="mailto:research@reefsight.id" className="text-cyan-400 hover:underline">research@reefsight.id</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
        <p>© 2026 REEFSIGHT Ecological Intelligence Platform. Hak Cipta Dilindungi Undang-Undang.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sistem Multi-Workspace RBAC
          </span>
          <span>Pulau Tunda, Banten, Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
