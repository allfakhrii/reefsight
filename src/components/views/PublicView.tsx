'use client';

import React, { useState } from 'react';
import EchoVisionCanvas from '@/components/three/EchoVisionCanvas';
import DeploymentMapLibre from '@/components/maps/DeploymentMapLibre';
import CoralDistributionMap from '@/components/maps/CoralDistributionMap';
import SoundscapeExplorer from '@/components/audio/SoundscapeExplorer';
import EnvironmentalCharts from '@/components/charts/EnvironmentalCharts';
import { 
  CORAL_LIFE_FORMS, 
  REEF_FISH_CATALOG, 
  MOCK_PUBLICATIONS, 
  MOCK_RESEARCH_LOGBOOKS 
} from '@/data/mockData';
import { 
  Waves, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Fish, 
  Compass, 
  FileText, 
  Database, 
  Info, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Sliders,
  Send,
  CheckCircle2,
  Calendar,
  Eye
} from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
}

export default function PublicView({ activeTab, onSelectTab, onOpenLogin }: Props) {
  // Scenario state for 3D Prototype simulation
  const [activeScenario, setActiveScenario] = useState<'healthy' | 'bleaching' | 'low_fish' | 'degradation'>('healthy');

  // Projection simulator state
  const [projYears, setProjYears] = useState<number>(10);
  const [sstIncreaseRate, setSstIncreaseRate] = useState<number>(0.3); // °C / decade
  const [protectEffort, setProtectEffort] = useState<'low' | 'moderate' | 'high'>('moderate');

  // Biodiversity association selector
  const [selectedLifeForm, setSelectedLifeForm] = useState<string>(CORAL_LIFE_FORMS[0].name);

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Compute projection metrics
  const baselineCover = 49.4; // %
  const penalty = (sstIncreaseRate / 0.1) * (projYears / 5) * (protectEffort === 'low' ? 3.5 : protectEffort === 'moderate' ? 1.8 : 0.8);
  const recoveryBonus = protectEffort === 'high' ? (projYears * 0.9) : protectEffort === 'moderate' ? (projYears * 0.3) : 0;
  const projectedCover = Math.max(12, Math.min(75, Number((baselineCover - penalty + recoveryBonus).toFixed(1))));

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* ======================================================== */}
      {/* 01. TAB: HOME (ECOLOGICAL ENCYCLOPEDIA)                  */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#061e33] via-slate-950 to-slate-950 border border-cyan-500/25 p-8 md:p-14 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Platform Kecerdasan Ekologis Terumbu Karang
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Memahami Dinamika & Ketahanan Karang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">Pulau Tunda</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                REEFSIGHT mengintegrasikan sensor bioakustik hydrophone bawah air, pengolahan citra optik bentik, WebGIS ArcGIS spasio-temporal, dan analitika suhu oseanografi untuk memantau serta memproyeksikan ekosistem terumbu karang di perairan Selat Sunda.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectTab('prototype')}
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Jelajahi 3D Hardware EchoVision <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectTab('deployment')}
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" /> Peta 12 Titik Buoy
                </button>
              </div>
            </div>

            {/* Quick Stat Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-8 border-t border-slate-800/80 text-white">
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lokasi Riset</span>
                <p className="text-base font-black text-cyan-300 mt-0.5">Pulau Tunda, Banten</p>
                <span className="text-[10px] text-slate-500">Kabupaten Serang</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Luas Hamparan Karang</span>
                <p className="text-base font-black text-emerald-400 mt-0.5">260.3 Hektar</p>
                <span className="text-[10px] text-slate-500">Hasil Interpretasi ArcGIS</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spesies Ikan Karang</span>
                <p className="text-base font-black text-amber-300 mt-0.5">57 – 69 Spesies</p>
                <span className="text-[10px] text-slate-500">17 Famili Biologis</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Stasiun Buoy AI</span>
                <p className="text-base font-black text-purple-300 mt-0.5">12 Titik Aktif</p>
                <span className="text-[10px] text-slate-500">Bioakustik & Optik Nirawak</span>
              </div>
            </div>
          </section>

          {/* Ensiklopedia Karang Pulau Tunda */}
          <section className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Ensiklopedia Ekologi</span>
              <h2 className="text-2xl font-black text-white mt-1">Bentuk Pertumbuhan Karang Utama Pulau Tunda</h2>
              <p className="text-xs text-slate-400 max-w-2xl mt-1">
                Berdasarkan kajian rekrutmen dan keanekaragaman karang, ditemukan 7 bentuk pertumbuhan (life form) utama yang menopang kompleksitas habitat perairan Pulau Tunda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CORAL_LIFE_FORMS.map((coral, i) => (
                <div
                  key={i}
                  className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/40 p-5 text-white transition-all shadow-xl hover:-translate-y-1 duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-40 rounded-xl overflow-hidden relative">
                      <img
                        src={coral.image_url}
                        alt={coral.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-cyan-300 border border-cyan-800">
                        {coral.growth_form}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{coral.name}</h3>
                      <p className="text-[11px] font-mono text-cyan-400 italic">{coral.scientific_name}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {coral.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] space-y-1">
                    <p className="text-slate-400"><strong>Suhu Ideal:</strong> <span className="text-amber-300">{coral.optimal_temp_c}</span></p>
                    <p className="text-slate-400"><strong>Sebaran Tunda:</strong> <span className="text-slate-200">{coral.tunda_status}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* 02. TAB: PROTOTYPE 3D INTELLIGENCE                       */}
      {/* ======================================================== */}
      {activeTab === 'prototype' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">3D Hardware & Scenario</span>
            <h2 className="text-2xl font-black text-white mt-1">Prototipe EchoVision (ASIK v2.0)</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Visualisasi 3D perangkat keras pemantau laut nirawak. Klik pada setiap komponen untuk membaca spesifikasi teknis, fungsi ekologis, dan estimasi biaya Bill of Materials (BOM). Uji skenario respons ekologis di bawah ini.
            </p>
          </div>

          {/* Scenario Simulation Switcher */}
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-2">
              Simulasi Skenario Ekologis:
            </span>
            <button
              onClick={() => setActiveScenario('healthy')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeScenario === 'healthy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1. Terumbu Sehat (Normal)
            </button>
            <button
              onClick={() => setActiveScenario('bleaching')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeScenario === 'bleaching'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2. Pemutihan Karang (Bleaching)
            </button>
            <button
              onClick={() => setActiveScenario('low_fish')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeScenario === 'low_fish'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3. Penurunan Aktivitas Ikan
            </button>
            <button
              onClick={() => setActiveScenario('degradation')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeScenario === 'degradation'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              4. Degradasi Terumbu
            </button>
          </div>

          {/* 3D Canvas */}
          <EchoVisionCanvas scenario={activeScenario} />
        </div>
      )}

      {/* ======================================================== */}
      {/* 03. TAB: DEPLOYMENT MAP (12 STATIONS)                    */}
      {/* ======================================================== */}
      {activeTab === 'deployment' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">WebGIS Deployment Locations</span>
            <h2 className="text-2xl font-black text-white mt-1">Peta Penempatan 12 Titik Prototipe Pulau Tunda</h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Sebaran 12 stasiun buoy cerdas melingkar di sekeliling Pulau Tunda (±400 meter dari garis pantai). Klik pada titik buoy untuk memeriksa kedalaman dan telemetri oseanografi waktu-nyata.
            </p>
          </div>

          <DeploymentMapLibre />
        </div>
      )}

      {/* ======================================================== */}
      {/* 04. TAB: CORAL DISTRIBUTION (ARCGIS & MAP SWIPE)         */}
      {/* ======================================================== */}
      {activeTab === 'distribution' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">ArcGIS Spatial Interpretation</span>
            <h2 className="text-2xl font-black text-white mt-1">Distribusi & Analisis Perubahan Tutupan Karang</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Peta spasial tutupan karang Pulau Tunda hasil klasifikasi citra satelit dan verifikasi lapangan ArcGIS. Gunakan pemilih tahun untuk menganalisis dinamika perubahan luasan karang (2020 vs 2023).
            </p>
          </div>

          <CoralDistributionMap />
        </div>
      )}

      {/* ======================================================== */}
      {/* 05. TAB: CORAL PROJECTION (FUTURE MODELING)              */}
      {/* ======================================================== */}
      {activeTab === 'projection' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Future Modeling & Scenarios</span>
            <h2 className="text-2xl font-black text-white mt-1">Pemodelan Proyeksi Tutupan Karang (5 – 15 Tahun)</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Simulasi interaktif proyeksi kondisi terumbu karang Pulau Tunda berdasarkan pemodelan matematis tekanan suhu permukaan laut, laju mortalitas karang, dan upaya konservasi daerah.
            </p>
          </div>

          {/* Interactive Simulator Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Pengaturan Parameter Pemodelan Proyeksi:</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: Rentang Tahun */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Horizon Waktu:</span>
                  <span className="font-bold text-cyan-400 font-mono">{projYears} Tahun ke Depan</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="5"
                  value={projYears}
                  onChange={(e) => setProjYears(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>5 Tahun (2031)</span>
                  <span>10 Tahun (2036)</span>
                  <span>15 Tahun (2041)</span>
                </div>
              </div>

              {/* Slider 2: Laju Kenaikan Suhu */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Laju Kenaikan SST:</span>
                  <span className="font-bold text-amber-400 font-mono">+{sstIncreaseRate}°C / Dekade</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.05"
                  value={sstIncreaseRate}
                  onChange={(e) => setSstIncreaseRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>+0.1°C (Rendah)</span>
                  <span>+0.3°C (Moderat)</span>
                  <span>+0.6°C (Ekstrem)</span>
                </div>
              </div>

              {/* Selector 3: Intervensi Konservasi */}
              <div>
                <span className="text-xs text-slate-400 block mb-2">Intervensi Konservasi:</span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['low', 'moderate', 'high'] as const).map(eff => (
                    <button
                      key={eff}
                      onClick={() => setProtectEffort(eff)}
                      className={`py-1.5 rounded-xl font-bold capitalize transition ${
                        protectEffort === eff
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {eff === 'low' ? 'Minim' : eff === 'moderate' ? 'Sedang' : 'Agresif'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projection Output KPI Banner */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Tutupan Karang Aktual (2026):</span>
                <span className="text-2xl font-black text-white block mt-0.5 font-mono">{baselineCover}%</span>
                <span className="text-[10px] text-slate-500">Hasil survei baseline</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Proyeksi Tahun {2026 + projYears}:</span>
                <span className={`text-2xl font-black block mt-0.5 font-mono ${
                  projectedCover >= baselineCover ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {projectedCover}%
                </span>
                <span className="text-[10px] text-slate-500">
                  Selisih: {projectedCover >= baselineCover ? '+' : ''}{(projectedCover - baselineCover).toFixed(1)}%
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Status Risiko Ekosistem:</span>
                <span className={`text-sm font-bold block mt-1.5 ${
                  projectedCover > 45 ? 'text-emerald-400' : projectedCover > 30 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {projectedCover > 45 ? 'Stabil & Berdaya Pulih' : projectedCover > 30 ? 'Stres Termal Signifikan' : 'Risiko Degradasi Kritis'}
                </span>
                <span className="text-[10px] text-slate-500">Asumsi Model Markov Spasial</span>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 italic">
              * Catatan Ilmiah: Pemodelan proyeksi ini merupakan simulasi konseptual berbasis skenario dan tidak dapat dianggap sebagai kepastian mutlak tanpa memperhitungkan variabel badai lokal dan sedimentasi darat.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 06. TAB: ENVIRONMENTAL ANALYTICS                         */}
      {/* ======================================================== */}
      {activeTab === 'environmental' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Ocean Environmental Intelligence</span>
            <h2 className="text-2xl font-black text-white mt-1">Analisis Parameter Lingkungan & Korelasi Ekologis</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Pemantauan spasio-temporal Suhu Permukaan Laut (SST), Konsentrasi Klorofil-a (CHL-a), Degree Heating Weeks (DHW), dan korelasi statistik ilmiah terhadap tutupan karang Pulau Tunda.
            </p>
          </div>

          <EnvironmentalCharts />
        </div>
      )}

      {/* ======================================================== */}
      {/* 07. TAB: BIOACOUSTICS & OPTICAL                          */}
      {/* ======================================================== */}
      {activeTab === 'bioacoustics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Acoustic & Underwater Intelligence</span>
            <h2 className="text-2xl font-black text-white mt-1">Eksplorasi Suara & Citra Bawah Laut</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Mendengarkan lanskap suara laut (*marine soundscape*) menggunakan sensor hydrophone EchoVision dan spektrogram frekuensi FFT, serta melihat dokumentasi optik terumbu karang.
            </p>
          </div>

          {/* Audio Visualizer */}
          <SoundscapeExplorer />

          {/* Optical Reef Explorer Gallery */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Galeri Citra Optik Bawah Laut per Stasiun</h3>
                <p className="text-xs text-slate-400">Dokumentasi visual koloni karang dan fauna asosiasi di Pulau Tunda.</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono">12 Foto Tervalidasi</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { title: 'Acropora Formosa', st: 'RFS-STA-001', img: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=500&q=80' },
                { title: 'Koloni Porites Lutea', st: 'RFS-STA-003', img: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=500&q=80' },
                { title: 'Acropora Tabulate Meja', st: 'RFS-STA-004', img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=500&q=80' },
                { title: 'Damselfish & Branching', st: 'RFS-STA-001', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=500&q=80' },
              ].map((item, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden h-44 bg-slate-950 border border-slate-800">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 p-3 flex flex-col justify-end">
                    <span className="text-[10px] text-cyan-400 font-mono">{item.st}</span>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 08. TAB: BIODIVERSITY & ECO-TOURISM PLANNER              */}
      {/* ======================================================== */}
      {activeTab === 'biodiversity' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Coral & Marine Biodiversity Explorer</span>
            <h2 className="text-2xl font-black text-white mt-1">Katalog Ikan Karang & Relasi Trofik Pulau Tunda</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Eksplorasi keterkaitan antara struktur arsitektur bentuk pertumbuhan karang dengan kelompok fungsional komunitas ikan karang (herbivora, karnivora, koralivora).
            </p>
          </div>

          {/* Interactive Relationship Explorer */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Biodiversity Relationship Explorer</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Pilih Bentuk Karang:</span>
                <select
                  value={selectedLifeForm}
                  onChange={(e) => setSelectedLifeForm(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 text-xs text-cyan-300 focus:outline-none"
                >
                  {CORAL_LIFE_FORMS.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matrix Result Card */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Asosiasi Spesies untuk:</span>
              <h4 className="text-base font-bold text-white mt-0.5">{selectedLifeForm}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Biota laut dan kelompok ikan yang tercatat bersimbiosis dan berasosiasi erat dengan bentuk pertumbuhan ini di perairan Pulau Tunda:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {REEF_FISH_CATALOG.map(fish => (
                  <div key={fish.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{fish.common_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                        {fish.trophic_group}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 italic">{fish.scientific_name}</p>
                    <p className="text-[11px] text-slate-300 pt-1 leading-relaxed">{fish.ecological_role}</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Kedalaman: {fish.depth_range_m}</span>
                      <span>Kelimpahan: {fish.abundance_per_100m2}/100m²</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Eco-Tourism Suitability Planner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Eco-Tourism & Conservation Planner</h3>
            <p className="text-xs text-slate-400">
              Zonasi peruntukan perairan Pulau Tunda berdasarkan kesesuaian ekologis dan keselamatan wisatawan:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 block">Potential Diving Spot</span>
                <p className="text-xs text-slate-300 mt-1">Stasiun RFS-STA-004 & STA-006 (Kedalaman 7–9m, tutupan karang meja tinggi, visibilitas air jernih).</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30">
                <span className="text-xs font-bold text-cyan-400 block">Potential Snorkeling Spot</span>
                <p className="text-xs text-slate-300 mt-1">Stasiun RFS-STA-001 & STA-010 (Rataan terumbu dangkal 4–5m, arus tenang, aman untuk perenang rekreasi).</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30">
                <span className="text-xs font-bold text-purple-400 block">Conservation Core Zone</span>
                <p className="text-xs text-slate-300 mt-1">Stasiun RFS-STA-003 (Zona perlindungan mutlak indukan Acropora tabulate, dilarang sandar jangkar).</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 block">Rehabilitation Priority</span>
                <p className="text-xs text-slate-300 mt-1">Stasiun RFS-STA-007 (Prioritas restorasi transplantasi karang dan pemasangan artificial reef).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 09. TAB: RESEARCH LOGBOOK (PUBLIC VIEW)                  */}
      {/* ======================================================== */}
      {activeTab === 'logbook' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Research & Conservation Timeline</span>
            <h2 className="text-2xl font-black text-white mt-1">Catatan Perkembangan Riset Terpublikasi</h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Dokumentasi kronologis kegiatan ekspedisi lapangan, instalasi perangkat EchoVision, dan tonggak capaian penelitian terumbu karang di Pulau Tunda.
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_RESEARCH_LOGBOOKS.map((log) => (
              <div key={log.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {log.date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                    {log.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white pt-1">{log.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{log.content}</p>
                <div className="pt-2 text-[11px] text-slate-500">
                  Penyusun: <strong className="text-slate-400">{log.author}</strong> · Lokasi: Pulau Tunda, Banten
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. TAB: PUBLICATION CENTER                              */}
      {/* ======================================================== */}
      {activeTab === 'publications' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Scientific Documentation Center</span>
            <h2 className="text-2xl font-black text-white mt-1">Publikasi Ilmiah & Dataset Terbuka</h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Akses artikel ilmiah, laporan teknis perangkat keras, dan unduh dataset spasial Pulau Tunda yang telah diverifikasi dan disetujui untuk keterbukaan publik.
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_PUBLICATIONS.map((pub) => (
              <div key={pub.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
                  <span className="font-mono text-cyan-400 font-bold">{pub.id} · Tahun {pub.year}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 w-fit">
                    {pub.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{pub.title}</h3>
                <p className="text-xs text-slate-400 italic">Oleh: {pub.authors.join(', ')}</p>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {pub.abstract}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <span className="text-slate-500 text-[11px]">Ukuran File: {pub.file_size_mb} MB · {pub.download_count} Kali Diunduh</span>
                  <button
                    onClick={() => alert(`Mengunduh berkas ${pub.title} (PDF)...`)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 w-fit transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Dokumen (PDF)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. TAB: ERD & SYSTEM ARCHITECTURE                       */}
      {/* ======================================================== */}
      {activeTab === 'erd' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">System Transparency & Database Architecture</span>
            <h2 className="text-2xl font-black text-white mt-1">Rancangan Basis Data & Konektivitas 3 Workspace</h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Dokumentasi teknis keterbukaan sistem REEFSIGHT. Menjelaskan diagram relasi entitas (Entity Relationship Diagram), alur data dari sensor lapangan hingga publikasi publik, dan pemisahan hak akses berbasis RBAC.
            </p>
          </div>

          {/* Interactive ERD Table Explorer */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Database Table Schema & Functions (PostgreSQL + PostGIS)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'stations', count: '12 Baris', desc: 'Menyimpan koordinat spasial buoy (GEOMETRY Point), kedalaman, dan status telemetri.' },
                { name: 'prototypes', count: '12 Unit', desc: 'Detail hardware EchoVision (ASIK v2.0), sensor akustik, optik, dan modul daya.' },
                { name: 'sensor_readings', count: 'Realtime', desc: 'Data berkala deret waktu: SST, salinitas, pH, kekeruhan NTU, dan dissolved oxygen.' },
                { name: 'acoustic_records', count: 'Audio Files', desc: 'Penyimpanan rekaman hydrophone (.wav), metadata sampling, dan kalkulasi ACI.' },
                { name: 'optical_images', count: 'Citra Bentik', desc: 'Foto transek terumbu bawah air, anotasi tutupan karang, dan label spesies.' },
                { name: 'validations', count: 'Audit Log', desc: 'Keputusan QA/QC oleh Validator Data (Approve, Return, Reject) dengan timestamp.' },
                { name: 'alerts', count: 'Insiden', desc: 'Peringatan otomatis anomali bleaching & degradasi, terhubung ke WhatsApp API.' },
                { name: 'publications', count: 'Artikel', desc: 'Dokumen ilmiah dan dataset GeoJSON/NetCDF yang memperoleh izin terbit publik.' },
                { name: 'users & profiles', count: 'RBAC', desc: 'Pengelolaan 5 role: Admin, Operator, Peneliti, Validator, dan Publik Terdaftar.' },
              ].map((tbl, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-300">{tbl.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tbl.count}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{tbl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. TAB: ABOUT & CONTACT                                 */}
      {/* ======================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">About REEFSIGHT & Collaboration</span>
            <h2 className="text-2xl font-black text-white mt-1">Tentang Platform & Kerja Sama Konservasi</h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Pengembangan platform berbasis kecerdasan ekologis untuk riset dan pelestarian terumbu karang di Pulau Tunda, Banten.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: About Text */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Latar Belakang & Tujuan Penelitian</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ekosistem terumbu karang di Pulau Tunda, Kabupaten Serang, menghadapi ancaman multifaktor: mulai dari kenaikan anomali suhu air laut Selat Sunda hingga tekanan aktivitas penangkapan ikan dan jangkar perahu.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Platform <strong>REEFSIGHT</strong> dikembangkan sebagai solusi teknologi terpadu yang menggabungkan stasiun buoy pemantau nirawak (EchoVision), kecerdasan bioakustik, dan analitika spasial WebGIS untuk memberikan informasi berbasis bukti ilmiah secara tepat waktu.
              </p>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <p>📍 <strong>Lokasi:</strong> Pulau Tunda, Desa Wargasara, Kec. Tirtayasa, Serang, Banten</p>
                <p>🤝 <strong>Mitra:</strong> Kelompok Sadar Wisata (Pokdarwis) & Masyarakat Nelayan Tunda</p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-base font-bold text-white mb-2">Formulir Kontak & Pengajuan Kerja Sama</h3>
              <p className="text-xs text-slate-400 mb-4">
                Kirimkan pertanyaan, permohonan data penelitian, atau penawaran kemitraan konservasi.
              </p>

              {contactSent && (
                <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Pesan Anda telah berhasil dikirimkan. Tim riset kami akan segera menghubungi Anda.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nama Lengkap & Institusi:</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contoh: Rahmat / Universitas..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Alamat Email:</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Isi Pesan / Kategori Kerja Sama:</label>
                  <textarea
                    rows={3}
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Tuliskan tujuan permohonan kolaborasi atau pertanyaan Anda..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Permohonan Kolaborasi
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
