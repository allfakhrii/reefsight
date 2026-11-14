'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import EchoVisionCanvas from '@/components/three/EchoVisionCanvas';
import DeploymentMapLibre from '@/components/maps/DeploymentMapLibre';
import SoundscapeExplorer from '@/components/audio/SoundscapeExplorer';
import EnvironmentalCharts from '@/components/charts/EnvironmentalCharts';

const CoralDistributionMap = dynamic(() => import('@/components/maps/CoralDistributionMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-xs animate-pulse">
      Memuat Peta Distribusi Leaflet...
    </div>
  ),
});

const CoralProjectionMap = dynamic(() => import('@/components/maps/CoralProjectionMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-xs animate-pulse">
      Memuat Peta Proyeksi Leaflet...
    </div>
  ),
});
import {
  CORAL_LIFE_FORMS,
  REEF_FISH_CATALOG,
  MACROBENTHOS_CATALOG,
  PULAU_TUNDA_TRANSECT_PHOTOS,
  MOCK_PUBLICATIONS,
  MOCK_RESEARCH_LOGBOOKS,
  ECO_TOURISM_ZONES,
  USER_DIRECTORY
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
  Eye,
  Activity,
  Mic2,
  Camera,
  Palmtree,
  BookOpen,
  Cpu,
  Clock,
  Radio,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
}

export default function PublicView({ activeTab, onSelectTab, onOpenLogin }: Props) {
  // Scenario state for 3D Prototype simulation
  const [activeScenario, setActiveScenario] = useState<'normal' | 'thermal_stress' | 'turbidity'>('normal');

  // Projection simulator state matching image6.jpeg
  const [projPeriod, setProjPeriod] = useState<number>(5); // 5, 10, 15 years
  const [projScenario, setProjScenario] = useState<'baseline' | 'high_pressure' | 'recovery'>('baseline');

  // Biodiversity subtabs matching image10.jpeg
  const [bioTab, setBioTab] = useState<
    'growth_form' | 'thermal' | 'fish' | 'benthos' | 'relationship' | 'transects'
  >('growth_form');
  const [selectedGrowthForm, setSelectedGrowthForm] = useState<string>('Acropora Branching');
  const [selectedTransect, setSelectedTransect] = useState<any | null>(null);

  // Eco-tourism subtabs matching image12.jpeg
  const [ecoTab, setEcoTab] = useState<'suitability' | 'rehabilitation' | 'recommendation'>('suitability');
  const [selectedEcoZone, setSelectedEcoZone] = useState(ECO_TOURISM_ZONES[0]);

  // Logbook & Profile subtabs
  const [logbookTab, setLogbookTab] = useState<'profile' | 'logbook' | 'publications'>('profile');

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactInstitution, setContactInstitution] = useState('');
  const [contactCategory, setContactCategory] = useState('Kolaborasi Penelitian');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownloadPdf = (title: string) => {
    setDownloadToast(`Menyiapkan berkas PDF: "${title}". Unduhan dimulai.`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactInstitution('');
    setContactMsg('');
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ======================================================== */}
      {/* 01. TAB: HOME (ECOLOGICAL ENCYCLOPEDIA) - image2.jpeg     */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Panoramic Hero Banner matching image2.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-lg min-h-[380px] flex items-center">
            {/* Background Coral Reef Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/biodiversity/ikan-karang-hero.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl text-white space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
                <span className="w-4 h-0.5 bg-orange-400" />
                Marine Ecological Encyclopedia
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Discover the Living Ecosystem Beneath the Ocean
              </h1>

              <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Explore the coral reef ecosystems of Pulau Tunda, their biodiversity, habitat characteristics, and ecological dynamics through integrated acoustic, optical, environmental, and spatial intelligence.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectTab('biodiversity')}
                  className="min-h-[44px] px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold text-xs shadow-md shadow-orange-500/30 hover:from-orange-600 hover:to-rose-700 transition-all flex items-center gap-2"
                >
                  <span>Explore Encyclopedia</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('webgis')}
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all"
                >
                  <MapPin size={14} />
                  <span>View WebGIS</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium pt-2 flex items-center gap-1.5">
                <MapPin size={13} className="text-orange-400" />
                Pulau Tunda, Serang, Banten, Indonesia
              </p>
            </div>
          </div>

          {/* Quick Sub-Navigation Bar matching image2.jpeg */}
          <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto gap-2 text-xs font-semibold text-slate-700">
            {[
              { id: 'bio-ecosystem', label: 'Coral Reef Ecosystem', icon: '🪸', tab: 'home' },
              { id: 'bio-growth', label: 'Coral Growth Forms', icon: '🌿', tab: 'biodiversity' },
              { id: 'bio-diversity', label: 'Marine Biodiversity', icon: '🐟', tab: 'biodiversity' },
              { id: 'bio-assessment', label: 'Habitat Characteristics', icon: '📊', tab: 'ecological-assessment' },
              { id: 'bio-profile', label: 'Pulau Tunda Profile', icon: '📍', tab: 'research-logbook' },
              { id: 'bio-research', label: 'Research Approach', icon: '🔬', tab: 'prototype-3d' }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectTab(sub.tab)}
                className="px-4 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 whitespace-nowrap transition-colors"
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
              </button>
            ))}
          </div>

          {/* Cards Grid matching image2.jpeg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Coral Reef Ecosystem */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Coral Reef Ecosystem
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Pusat Keanekaragaman Hayati Laut Tropis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Terumbu karang adalah ekosistem laut tropis yang dibentuk oleh koloni karang batu (karang keras) dan berbagai organisme laut, yang menyediakan habitat, sumber makanan, serta perlindungan bagi keanekaragaman hayati laut di perairan Pulau Tunda.
                </p>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-100 group">
                <img
                  src="/images/biodiversity/ikan-karang-hero.jpg"
                  alt="Coral Reef"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={() => onSelectTab('biodiversity')}
                    className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-xs shadow-md hover:bg-white flex items-center gap-1.5 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Bentuk Pertumbuhan Karang (Coral Growth Forms) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Bentuk Pertumbuhan Karang (Coral Growth Forms)
                </div>
                <button
                  onClick={() => onSelectTab('biodiversity')}
                  className="text-xs font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { name: 'Branching', sub: '(Bercabang)', img: '/images/biodiversity/branching.jpg' },
                  { name: 'Massive', sub: '(Masif)', img: '/images/biodiversity/massive.jpg' },
                  { name: 'Encrusting', sub: '(Menempel)', img: '/images/biodiversity/encrusting.jpg' },
                  { name: 'Foliose', sub: '(Berlembar)', img: '/images/biodiversity/foliose.jpg' },
                  { name: 'Tabular', sub: '(Meja)', img: '/images/coral-surveys/tunda_transect_03.jpg' },
                  { name: 'Submassive', sub: '(Setengah Masif)', img: '/images/coral-surveys/tunda_transect_07.jpg' }
                ].map((form) => (
                  <button
                    key={form.name}
                    type="button"
                    onClick={() => {
                      setSelectedGrowthForm(`Acropora ${form.name}`);
                      onSelectTab('biodiversity');
                    }}
                    className="w-full p-2.5 rounded-2xl border border-slate-100 hover:border-orange-300 hover:shadow-xs text-center cursor-pointer transition-all group bg-white"
                  >
                    <div className="h-16 rounded-xl overflow-hidden mb-1.5 bg-slate-100">
                      <img
                        src={form.img}
                        alt={form.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      {form.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {form.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card 3: Keanekaragaman Biota Laut */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Keanekaragaman Biota Laut
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('biodiversity')}
                  className="min-h-[36px] px-2 text-xs font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="h-14 rounded-xl overflow-hidden mb-1">
                    <img src="/images/biodiversity/ikan-karang-hero.jpg" alt="Ikan Karang" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">Ikan Karang</div>
                  <div className="text-[9px] text-slate-500">(Reef Fish)</div>
                </div>
                <div className="p-2 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="h-14 rounded-xl overflow-hidden mb-1">
                    <img src="/images/biodiversity/echinodermata.jpg" alt="Echinodermata" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">Echinodermata</div>
                  <div className="text-[9px] text-slate-500">(Bintang Laut)</div>
                </div>
                <div className="p-2 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="h-14 rounded-xl overflow-hidden mb-1">
                    <img src="/images/biodiversity/moluska.jpg" alt="Moluska" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">Moluska</div>
                  <div className="text-[9px] text-slate-500">(Kima, Siput)</div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('biodiversity')}
                  className="min-h-[84px] p-2 rounded-2xl border border-dashed border-slate-200 hover:border-orange-400 flex flex-col items-center justify-center cursor-pointer text-slate-600 hover:text-orange-600 transition-colors"
                >
                  <span className="text-base font-bold">+</span>
                  <span className="text-[10px] font-bold">Lainnya</span>
                  <span className="text-[9px] text-slate-500">(Spesies Terkait)</span>
                </button>
              </div>
            </div>

            {/* Card 4: Profil Ekologis Pulau Tunda */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Profil Ekologis Pulau Tunda
                </div>
                <button
                  onClick={() => onSelectTab('research-logbook')}
                  className="text-xs font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <span>Learn More</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-32 h-36 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src="/images/coral-surveys/tunda_transect_02.jpg"
                    alt="Aerial Pulau Tunda"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pulau Tunda merupakan pulau kecil di Kabupaten Serang, Banten, dengan ekosistem terumbu karang yang berperan penting dalam menjaga produktivitas dan keanekaragaman hayati laut di Teluk Banten.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Luas</div>
                  <div className="text-xs font-extrabold text-slate-800">± 2,8 km²</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Panjang Pesisir</div>
                  <div className="text-xs font-extrabold text-slate-800">± 7,2 km</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Tipe Ekosistem</div>
                  <div className="text-xs font-extrabold text-slate-800">Fringing Reef</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pendekatan Penelitian REEFSIGHT matching image2.jpeg */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Pendekatan Penelitian REEFSIGHT
                </div>
                <p className="text-xs text-slate-500">
                  Integrasi multi-sumber informasi untuk memahami kondisi, dinamika, dan tekanan lingkungan ekosistem terumbu karang di Pulau Tunda.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('prototype-3d')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Learn More</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => onSelectTab('acoustic-intelligence')}
                className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 hover:border-cyan-300 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Mic2 size={16} />
                </div>
                <div className="text-xs font-bold text-cyan-900 mb-1">Acoustic Intelligence</div>
                <p className="text-[11px] text-cyan-700 leading-relaxed">
                  Analisis karakteristik suara bawah laut (hydrophone & ACI).
                </p>
              </div>

              <div
                onClick={() => onSelectTab('prototype-3d')}
                className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 hover:border-orange-300 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Camera size={16} />
                </div>
                <div className="text-xs font-bold text-orange-900 mb-1">Optical Intelligence</div>
                <p className="text-[11px] text-orange-700 leading-relaxed">
                  Dokumentasi visual kondisi terumbu karang dan biota bawah air.
                </p>
              </div>

              <div
                onClick={() => onSelectTab('ocean-environment')}
                className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-300 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Waves size={16} />
                </div>
                <div className="text-xs font-bold text-purple-900 mb-1">Environmental Intelligence</div>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Analisis parameter lingkungan (SST, CHL-a, kekeruhan air).
                </p>
              </div>

              <div
                onClick={() => onSelectTab('coral-distribution')}
                className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:border-emerald-300 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Layers size={16} />
                </div>
                <div className="text-xs font-bold text-emerald-900 mb-1">Spatial Intelligence</div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Analisis spasial dan pemetaan ekosistem WebGIS ArcGIS.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Banner: Fungsi Ekologis Terumbu Karang matching image2.jpeg */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-lg flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="lg:w-1/4 text-left">
              <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                Fungsi Ekologis Terumbu Karang
              </h3>
              <p className="text-[11px] text-slate-300 mt-1">Peran Vital Bagi Ekosistem Laut</p>
            </div>

            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐟</span>
                <span>Habitat dan tempat berlindung biota laut</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚓</span>
                <span>Menjaga rantai makanan laut</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌊</span>
                <span>Melindungi pesisir dari gelombang & abrasi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💧</span>
                <span>Menjaga kualitas & kejernihan perairan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎣</span>
                <span>Mendukung produktivitas perikanan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🩺</span>
                <span>Menjadi indikator kesehatan ekosistem</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 02. TAB: PROTOTYPE INTELLIGENCE - image3.jpeg            */}
      {/* ======================================================== */}
      {activeTab === 'prototype-3d' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner matching image3.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_01.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                REEFSIGHT TECHNOLOGY
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Explore the Technology Beneath the Surface
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Discover the hardware architecture behind REEFSIGHT, an integrated marine monitoring concept designed to support acoustic, optical, and environmental observation of coral reef ecosystems.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#viewer3d"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Cpu size={14} />
                  Explore 3D Prototype →
                </a>
                <button
                  onClick={() => onSelectTab('system-architecture')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-all"
                >
                  <Database size={14} />
                  View System Architecture
                </button>
              </div>
            </div>
          </div>

          {/* Subnavigation Tabs matching image3.jpeg */}
          <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700">
            <button className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold flex items-center gap-1.5 shadow-xs">
              <Cpu size={14} />
              3D Prototype Explorer
            </button>
              <button
                type="button"
                onClick={() => onSelectTab('system-architecture')}
                className="min-h-[40px] px-4 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Database size={14} />
                System Architecture
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('bom-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="min-h-[40px] px-4 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <FileSpreadsheet size={14} />
                Hardware Components
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('scenario-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="min-h-[40px] px-4 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Activity size={14} />
                Scenario Simulation
              </button>
          </div>

          {/* Interactive Three.js 3D Prototype Hardware Canvas */}
          <div id="viewer3d">
            <EchoVisionCanvas
              scenario={
                activeScenario === 'thermal_stress'
                  ? 'bleaching'
                  : activeScenario === 'turbidity'
                  ? 'degradation'
                  : 'healthy'
              }
            />
          </div>

          {/* Bottom Row matching image3.jpeg: System Architecture Flow, Scenario Simulation & BOM Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* 1. System Architecture */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Database size={14} className="text-blue-600" />
                  System Architecture
                </h4>
                <button
                  type="button"
                  onClick={() => onSelectTab('system-architecture')}
                  className="text-xs font-semibold text-orange-600 hover:underline"
                >
                  View Detail →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
                <div className="p-2 rounded-2xl bg-slate-50/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1 text-xs">
                    🌊
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">Akuisisi Data</div>
                  <div className="text-[9px] text-slate-500">Sensor Akustik/Optik</div>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50/70">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1 text-xs">
                    💾
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">Data Logger</div>
                  <div className="text-[9px] text-slate-500">Penyimpanan Lokal</div>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50/70">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1 text-xs">
                    📡
                  </div>
                  <div className="text-[10px] font-bold text-slate-800">Transmisi LoRa</div>
                  <div className="text-[9px] text-slate-500">868 MHz Gateway</div>
                </div>
              </div>
            </div>

            {/* 2. Scenario Simulation */}
            <div id="scenario-section" className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-orange-500" />
                  Scenario Simulation
                </h4>
                <span className="text-[10px] font-semibold text-slate-400">3 Mode</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveScenario('normal')}
                  className={`min-h-[44px] p-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                    activeScenario === 'normal'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-base mb-0.5">🌿</div>
                  <div className="text-[11px] font-bold">Normal</div>
                  <div className="text-[9px] text-slate-500">Ekosistem Stabil</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScenario('thermal_stress')}
                  className={`min-h-[44px] p-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                    activeScenario === 'thermal_stress'
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-base mb-0.5">🔥</div>
                  <div className="text-[11px] font-bold">Suhu Naik</div>
                  <div className="text-[9px] text-slate-500">Thermal Stress</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScenario('turbidity')}
                  className={`min-h-[44px] p-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                    activeScenario === 'turbidity'
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-base mb-0.5">🌪️</div>
                  <div className="text-[11px] font-bold">Keruh</div>
                  <div className="text-[9px] text-slate-500">Turbiditas Tinggi</div>
                </button>
              </div>
            </div>

            {/* 3. Estimasi Biaya Prototipe (EchoVision) matching image3.jpeg */}
            <div id="bom-section" className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet size={14} className="text-emerald-600" />
                Estimasi Biaya Prototipe (EchoVision)
              </h4>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Total Biaya Komponen (BOM)</span>
                  <span className="font-bold text-slate-900">Rp 2.120.000</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-600">
                  <span>Dengan Cadangan (±18%)</span>
                  <span className="font-extrabold text-orange-600 text-sm">Rp 2.500.000</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                ⓘ Dibulatkan Rp 2.500.000/unit termasuk cadangan ±18% untuk baut, seal anti-air IP68, dan kabel maritim.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 03. TAB: WEBGIS & DEPLOYMENT MAP - image4.jpeg           */}
      {/* ======================================================== */}
      {activeTab === 'webgis' && <DeploymentMapLibre />}

      {/* ======================================================== */}
      {/* 04. TAB: CORAL DISTRIBUTION - image5.jpeg                */}
      {/* ======================================================== */}
      {activeTab === 'coral-distribution' && <CoralDistributionMap />}

      {/* ======================================================== */}
      {/* 05. TAB: CORAL PROJECTION - image6.jpeg                  */}
      {/* ======================================================== */}
      {activeTab === 'coral-projection' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image6.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_02.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                FUTURE MODELING
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Coral Projection
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Future Modeling of Coral Reef Conditions. Pemodelan proyeksi potensi perubahan kondisi dan distribusi terumbu karang di Pulau Tunda berdasarkan kondisi awal, parameter lingkungan, dan skenario perubahan lingkungan.
              </p>
            </div>
          </div>

          {/* Period Selector Tabs matching image6.jpeg */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {[5, 10, 15].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setProjPeriod(period)}
                className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all ${
                  projPeriod === period
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Calendar size={14} className={projPeriod === period ? 'text-orange-400' : 'text-slate-400'} />
                <span>{period} Years Projection</span>
              </button>
            ))}
          </div>

          {/* Projection Visual Area & Charts matching image6.jpeg */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Spatial Projection MapLibre Map */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>🗺️</span>
                    <span>Peta Proyeksi Sebaran Spasial Karang (+{projPeriod} Tahun)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Model spasial Cellular Automata (CA) & Rantai Markov berbasis baseline tutupan terumbu karang Pulau Tunda.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  Model: Cellular Automata (CA) · R² = 0,87
                </span>
              </div>

              {/* Dynamic Interactive Map Component */}
              <CoralProjectionMap
                period={projPeriod as 5 | 10 | 15}
                onSelectPeriod={(p) => setProjPeriod(p)}
              />
            </div>

            {/* Trajectory & Delta Comparison */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Perbandingan Kondisi Karang
                  </h4>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    +{projPeriod} Tahun
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">Karang Keras (HC)</span>
                    <span className="font-extrabold text-emerald-700">
                      {projPeriod === 5 ? '+2,68 ha (+2,38%)' : projPeriod === 10 ? '+5,36 ha (+4,75%)' : '+8,31 ha (+7,37%)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                    <span className="font-semibold text-rose-900">Karang Lunak (SC)</span>
                    <span className="font-extrabold text-rose-700">
                      {projPeriod === 5 ? '-2,33 ha (-5,04%)' : projPeriod === 10 ? '-4,06 ha (-8,78%)' : '-5,51 ha (-11,92%)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                    <span className="font-semibold text-amber-900">Karang Mati (DC)</span>
                    <span className="font-extrabold text-amber-700">
                      {projPeriod === 5 ? '-3,12 ha (-11,21%)' : projPeriod === 10 ? '-5,53 ha (-19,87%)' : '-7,65 ha (-27,49%)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Ketidakpastian Model</h4>
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                  <div className="text-2xl font-black text-orange-600">± 7,6 %</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                    Rentang kepercayaan 95% (Validation R² = 0,87)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 06. TAB: BIODIVERSITY EXPLORER - image10.jpeg            */}
      {/* ======================================================== */}
      {activeTab === 'biodiversity' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image10.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_04.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                CORAL & MARINE BIODIVERSITY EXPLORER
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Discover the Living Biodiversity of Coral Reef Ecosystems
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Explore coral growth forms, reef fish communities, and ecological relationships within the coral reef ecosystem through an integrated marine biodiversity information platform.
              </p>
            </div>
          </div>

          {/* Overview Metric Pills matching image10.jpeg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-orange-600">44</div>
              <div className="text-[10px] font-bold text-slate-800">Recorded Coral</div>
              <div className="text-[9px] text-slate-400">Taksa</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-blue-600">7</div>
              <div className="text-[10px] font-bold text-slate-800">Growth Forms</div>
              <div className="text-[9px] text-slate-400">Kategori</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-cyan-600">68</div>
              <div className="text-[10px] font-bold text-slate-800">Recorded Fish</div>
              <div className="text-[9px] text-slate-400">Spesies</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-purple-600">16</div>
              <div className="text-[10px] font-bold text-slate-800">Fish Families</div>
              <div className="text-[9px] text-slate-400">Famili</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-emerald-600">3</div>
              <div className="text-[10px] font-bold text-slate-800">Research Stations</div>
              <div className="text-[9px] text-slate-400">Stasiun</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xl font-black text-amber-600">128</div>
              <div className="text-[10px] font-bold text-slate-800">Records</div>
              <div className="text-[9px] text-slate-400">Catatan</div>
            </div>
          </div>

          {/* Subtabs matching image10.jpeg */}
          <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => setBioTab('growth_form')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                bioTab === 'growth_form'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Coral Species & Growth Form
            </button>
            <button
              type="button"
              onClick={() => setBioTab('fish')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                bioTab === 'fish'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Reef Fish (6 Spesies)
            </button>
            <button
              type="button"
              onClick={() => setBioTab('benthos')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                bioTab === 'benthos'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Makrobentos Bentik
            </button>
            <button
              type="button"
              onClick={() => setBioTab('relationship')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                bioTab === 'relationship'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Matriks Asosiasi Ekologis
            </button>
            <button
              type="button"
              onClick={() => setBioTab('transects')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                bioTab === 'transects'
                  ? 'bg-orange-600 text-white shadow-xs font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Galeri Foto Survei Lapangan (16 Transek)
            </button>
          </div>

          {/* Subtab Contents */}
          {bioTab === 'growth_form' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {CORAL_LIFE_FORMS.map((coral) => (
                <div
                  key={coral.name}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100">
                    <img
                      src={coral.image_url}
                      alt={coral.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{coral.name}</h4>
                    <p className="text-xs text-orange-600 italic font-medium">
                      {coral.scientific_name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {coral.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-700">Suhu Optimal:</span>{' '}
                      {coral.optimal_temp_c}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Tunda Status:</span>{' '}
                      {coral.tunda_status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {bioTab === 'fish' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {REEF_FISH_CATALOG.map((fish) => (
                <div
                  key={fish.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100">
                    <img
                      src={fish.image_url || '/images/biodiversity/ikan-karang-hero.jpg'}
                      alt={fish.common_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      {fish.trophic_group}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Kedalaman: {fish.depth_range_m}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{fish.common_name}</h4>
                    <p className="text-xs text-slate-500 italic">{fish.scientific_name}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fish.ecological_role}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700">
                    <span className="font-semibold">Asosiasi Karang:</span> {fish.associated_coral_form}
                  </div>
                </div>
              ))}
            </div>
          )}

          {bioTab === 'benthos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MACROBENTHOS_CATALOG.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100">
                    <img
                      src={b.image_url}
                      alt={b.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{b.name}</h4>
                    <p className="text-xs text-cyan-600 font-semibold italic mt-0.5">{b.taxa}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.role}</p>
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Kedalaman:</span> {b.depth}
                  </div>
                </div>
              ))}
            </div>
          )}

          {bioTab === 'transects' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">Dokumentasi Survei Lapangan Pulau Tunda:</span>{' '}
                  16 titik transek pengamatan visual dasar laut, kuadrat karang keras, dan kesehatan terumbu.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PULAU_TUNDA_TRANSECT_PHOTOS.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => setSelectedTransect(tr)}
                    className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:border-orange-400 cursor-pointer transition-all"
                  >
                    <div className="h-44 overflow-hidden bg-slate-900 relative">
                      <img
                        src={tr.file}
                        alt={tr.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                        {tr.station}
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{tr.title}</h5>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                        ● {tr.condition}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bioTab === 'relationship' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Biodiversity Relationship Matrix (Bentuk Karang → Ikan Berasosiasi)
              </h3>
              <p className="text-xs text-slate-500">
                Pilih bentuk pertumbuhan karang untuk menganalisis komunitas ikan karang yang tercatat berasosiasi di Pulau Tunda.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {CORAL_LIFE_FORMS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedGrowthForm(c.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedGrowthForm === c.name
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.growth_form}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  Ikan yang berasosiasi dengan {selectedGrowthForm}:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {CORAL_LIFE_FORMS.find((c) => c.name === selectedGrowthForm)?.associated_fish.map((fish, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
                      🐟 {fish}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 07. TAB: REEF HEALTH & ECOLOGICAL ASSESSMENT (RHI)       */}
      {/* ======================================================== */}
      {activeTab === 'ecological-assessment' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image11.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_05.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                ECOLOGICAL ASSESSMENT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Reef Health & Ecological Assessment
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Assessment of Reef Health and Ecological Condition. Penilaian kesehatan dan kondisi ekologis terumbu karang di Pulau Tunda berdasarkan data tutupan karang, keanekaragaman, komunitas ikan, rekrutmen karang, dan komposisi substrat.
              </p>
            </div>
          </div>

          {/* RHI Gauge & 8 Primary Indicators matching image11.jpeg */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RHI Gauge Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-center">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Reef Health Index (RHI)
              </h4>
              <div className="relative w-40 h-28 mx-auto flex items-end justify-center">
                <div className="text-4xl font-black text-slate-900">76.4</div>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Kondisi Baik (Good)
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ekosistem terumbu karang di Pulau Tunda berada dalam kondisi baik dengan tutupan karang hidup tinggi dan rekrutmen karang yang masih berlangsung.
              </p>
            </div>

            {/* 8 Indicators Grid matching image11.jpeg */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Indikator Ekologis Utama (Rata-rata Pulau Tunda)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Live Coral Cover</div>
                  <div className="text-lg font-black text-emerald-600">52.8%</div>
                  <div className="text-[9px] text-emerald-700">▲ +4.3%</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Dead Coral</div>
                  <div className="text-lg font-black text-rose-600">11.6%</div>
                  <div className="text-[9px] text-emerald-700">▼ -1.8%</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Dead Coral w/ Algae</div>
                  <div className="text-lg font-black text-amber-600">14.2%</div>
                  <div className="text-[9px] text-emerald-700">▼ -2.1%</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Coral Diversity</div>
                  <div className="text-lg font-black text-purple-600">44 Taksa</div>
                  <div className="text-[9px] text-slate-400">H&apos; = 2.86</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Fish Diversity</div>
                  <div className="text-lg font-black text-blue-600">68 Spesies</div>
                  <div className="text-[9px] text-slate-400">H&apos; = 3.21</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Fish Abundance</div>
                  <div className="text-lg font-black text-cyan-600">2,348 Ind.</div>
                  <div className="text-[9px] text-slate-400">per transek</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Coral Recruitment</div>
                  <div className="text-lg font-black text-emerald-600">6.4 ind/m²</div>
                  <div className="text-[9px] text-slate-400">Kepadatan</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">Benthic LC</div>
                  <div className="text-lg font-black text-slate-800">52.8%</div>
                  <div className="text-[9px] text-slate-400">DCA: 14.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 08. TAB: OCEAN ENVIRONMENTAL INTELLIGENCE - image13.jpeg */}
      {/* ======================================================== */}
      {activeTab === 'ocean-environment' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image13.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_06.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                OCEAN ENVIRONMENTAL INTELLIGENCE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Ocean Environmental Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Analysis of oceanographic dynamics and environmental conditions to understand their relationship with coral reef ecosystems in Pulau Tunda.
              </p>
            </div>
          </div>

          {/* Environmental Charts Integration */}
          <EnvironmentalCharts />
        </div>
      )}

      {/* ======================================================== */}
      {/* 09. TAB: ACOUSTIC INTELLIGENCE - image14.jpeg            */}
      {/* ======================================================== */}
      {activeTab === 'acoustic-intelligence' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image14.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/soundscape/reef_spectrograms.png')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                ACOUSTIC & UNDERWATER INTELLIGENCE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Acoustic & Underwater Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Underwater Soundscape and Visual Reef Exploration. Eksplorasi dan analisis informasi bawah laut berbasis rekaman akustik (hydrophone) dan dokumentasi visual kamera optik.
              </p>
            </div>
          </div>

          {/* Web Audio API Soundscape Player with Waveform & FFT Spectrogram */}
          <SoundscapeExplorer />
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. TAB: ECO-TOURISM & CONSERVATION - image12.jpeg       */}
      {/* ======================================================== */}
      {activeTab === 'eco-tourism' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image12.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_08.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                ECO-TOURISM & CONSERVATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Eco-Tourism & Conservation Planner
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Planning for Sustainable Marine Tourism and Coral Reef Conservation. Modul perencanaan ekowisata bahari dan zonasi konservasi terumbu karang di Pulau Tunda.
              </p>
            </div>
          </div>

          {/* Subtabs matching image12.jpeg */}
          <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => setEcoTab('suitability')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                ecoTab === 'suitability' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Eco-Tourism Suitability Map
            </button>
            <button
              type="button"
              onClick={() => setEcoTab('rehabilitation')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                ecoTab === 'rehabilitation' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Coral Rehabilitation Priority Map
            </button>
            <button
              type="button"
              onClick={() => setEcoTab('recommendation')}
              className={`min-h-[44px] px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                ecoTab === 'recommendation' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Diving & Conservation Recommendation
            </button>
          </div>

          {/* Main Grid: Zone Selector & Inspector matching image12.jpeg */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zones List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Zonasi Ekowisata & Konservasi
              </h4>
              <div className="space-y-2">
                {ECO_TOURISM_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedEcoZone(zone)}
                    className={`w-full text-left p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedEcoZone.id === zone.id
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <span className="font-bold text-slate-900 text-xs">{zone.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${zone.badgeColor}`}>
                        {zone.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{zone.rationale}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Inspector Card matching image12.jpeg */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{selectedEcoZone.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedEcoZone.category}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {selectedEcoZone.suitabilityStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Kedalaman</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedEcoZone.depthRangeM}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Tutupan Karang</div>
                  <div className="text-xs font-bold text-emerald-600 mt-0.5">{selectedEcoZone.liveCoralPct}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Visibilitas</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedEcoZone.visibilityM}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-[10px] text-slate-400 font-semibold">Tekanan Manusia</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedEcoZone.humanPressure}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="font-bold text-slate-900">Rekomendasi Aktivitas & Alasan:</div>
                <p className="text-slate-600 leading-relaxed">{selectedEcoZone.rationale}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. TAB: RESEARCH & PUBLICATIONS - Logbook & About Info  */}
      {/* ======================================================== */}
      {activeTab === 'research-logbook' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_09.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                RESEARCH & PUBLICATION CENTER
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Research Logbook, Profile & Publications
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Dokumentasi kronologis ekspedisi lapangan, profil ekologis terumbu karang Pulau Tunda, metodologi sains IoUT, dan publikasi ilmiah resmi.
              </p>
            </div>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
            {[
              { id: 'profile' as const, label: 'Visi & Profil Ekologis', icon: '🪸' },
              { id: 'logbook' as const, label: 'Logbook Lapangan Kronologis', icon: '📝' },
              { id: 'publications' as const, label: 'Publikasi Ilmiah Open Access', icon: '📄' }
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setLogbookTab(sub.id)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  logbookTab === sub.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
              </button>
            ))}
          </div>

          {/* Subtab 1: Visi, Latar Belakang & Profil Ekologis (About Content) */}
          {logbookTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latar Belakang & Visi */}
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                    <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                    Latar Belakang & Visi Riset
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Kecerdasan Ekologis untuk Perlindungan Terumbu Karang Pulau Tunda
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>
                      Pulau Tunda merupakan ekosistem terumbu karang kepulauan penting di Teluk Banten yang menghadapi tekanan ganda: fluktuasi oseanografi dinamis dari dinamika Selat Sunda dan sedimentasi serta aktivitas perikanan pesisir.
                    </p>
                    <p>
                      Platform REEFSIGHT dikembangkan sebagai ekosistem komputasi kecerdasan buatan dan Internet of Underwater Things (IoUT) untuk menjembatani observasi bioakustik bawah air, pemodelan tutupan karang berbasis penginderaan jauh satelit, serta WebGIS telemetri waktu-nyata bagi peneliti, pemerintah daerah, dan konservator.
                    </p>
                    <p>
                      Melalui 12 stasiun pemantauan terintegrasi (ASIK-01 hingga ASIK-12) yang melingkari pulau, REEFSIGHT menyediakan transparansi data ilmiah, peringatan dini anomali lingkungan, dan proyeksi pemulihan terumbu karang untuk mendukung konservasi berkelanjutan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold">Tipe Ekosistem</div>
                      <div className="text-sm font-black text-slate-800 mt-0.5">Fringing Reef</div>
                      <div className="text-[10px] text-slate-500">Terumbu Karang Tepi</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold">Luas Daratan & Pesisir</div>
                      <div className="text-sm font-black text-slate-800 mt-0.5">± 2.8 km² / 7.2 km</div>
                      <div className="text-[10px] text-slate-500">Garis Pantai Melingkar</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold">Jaringan Buoy Telemetri</div>
                      <div className="text-sm font-black text-emerald-600 mt-0.5">12 Stasiun Aktif</div>
                      <div className="text-[10px] text-slate-500">EchoVision Hardware</div>
                    </div>
                  </div>
                </div>

                {/* Mitra Strategis & Kolaborator */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                      <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                      Mitra Konservasi & Kolaborator
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Kolaborasi Lintas Disiplin & Pemberdayaan Pesisir
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pengembangan dan operasional REEFSIGHT melibatkan sinergi akademisi, otoritas kelautan, serta kelompok masyarakat pesisir Pulau Tunda.
                    </p>
                    <div className="space-y-2.5 pt-2">
                      {[
                        { name: 'DKP Provinsi Banten', role: 'Regulator & Otoritas Konservasi Kelautan Daerah' },
                        { name: 'Pokdarwis Pulau Tunda', role: 'Operator Lapangan & Mitra Eduwisata Ramah Lingkungan' },
                        { name: 'Laboratorium Bioakustik Laut', role: 'Validasi Sinyal Akustik Hydrophone & ACI' },
                        { name: 'Konsorsium Komputasi Ekologi', role: 'Infrastruktur Big Data Spasial & PostGIS' }
                      ].map((m, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <span className="font-bold text-slate-800 block">{m.name}</span>
                          <span className="text-[10px] text-slate-500">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTab('contact')}
                    className="w-full min-h-[44px] py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Ajukan Kolaborasi Riset</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Metodologi Sains REEFSIGHT */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>🔬</span>
                  <span>4 Pilar Metodologi Sains Ekologis REEFSIGHT</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      pilar: '01. Bioakustik Hydrophone',
                      desc: 'Perekaman audio bawah air 24/7 untuk menghitung Acoustic Complexity Index (ACI) dan mendeteksi aktivitas snaps udang pistol serta vokal ikan karang.',
                      icon: '🎙️'
                    },
                    {
                      pilar: '02. UPT Citra Optik',
                      desc: 'Underwater Photo Transect (UPT) kuadrat 1×1m untuk verifikasi bentuk pertumbuhan karang, rekrutmen koloni, dan deteksi dini pemutihan (bleaching).',
                      icon: '📷'
                    },
                    {
                      pilar: '03. WebGIS Multi-Temporal',
                      desc: 'Integrasi citra satelit resolusi tinggi dengan algoritma Lyzenga, Sea Surface Temperature (SST), dan Chlorophyll-a (CHL) deret 2022–2026.',
                      icon: '🗺️'
                    },
                    {
                      pilar: '04. Verifikasi QA/QC Terpisah',
                      desc: 'Pemisahan tugas (Separation of Duties): Operator pengumpul data tidak dapat memvalidasi datanya sendiri demi menjamin integritas saintifik.',
                      icon: '🛡️'
                    }
                  ].map((p, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="text-xl">{p.icon}</div>
                      <div className="text-xs font-bold text-slate-900">{p.pilar}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: Logbook Lapangan Kronologis */}
          {logbookTab === 'logbook' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-orange-500" />
                    <span>Catatan Kronologis Riset & Ekspedisi Lapangan Pulau Tunda</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Log aktivitas operasional, pemasangan sensor, dan temuan observasi terumbu karang.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  ● Semua Data Terverifikasi QA/QC
                </span>
              </div>

              <div className="space-y-4">
                {MOCK_RESEARCH_LOGBOOKS.map((log) => {
                  const samplePhoto = PULAU_TUNDA_TRANSECT_PHOTOS.find((p) =>
                    p.station.toLowerCase().includes(log.station_id?.toLowerCase() || '')
                  ) || PULAU_TUNDA_TRANSECT_PHOTOS[0];

                  return (
                    <div
                      key={log.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between"
                    >
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                            {log.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-700 text-xs font-semibold">
                            {log.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {log.date}
                          </span>
                          {log.station_id && (
                            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                              <MapPin size={12} />
                              {log.station_id}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {log.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {log.content}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <span className="font-semibold text-slate-700">Pelapor / Peneliti:</span>
                          <span>{log.author}</span>
                        </div>
                      </div>

                      {/* Photo Thumbnail */}
                      <div
                        onClick={() => setSelectedTransect(samplePhoto)}
                        className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative group cursor-pointer flex-shrink-0"
                      >
                        <img
                          src={samplePhoto.file}
                          alt={samplePhoto.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                          <span className="text-[10px] font-bold truncate">{samplePhoto.station}</span>
                          <span className="text-[9px] text-slate-300">Klik untuk preview foto UPT</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtab 3: Dokumen Publikasi Ilmiah Resmi (Open Access) */}
          {logbookTab === 'publications' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-500" />
                <span>Dokumen Publikasi Ilmiah Resmi (Open Access)</span>
              </h3>

              {downloadToast && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{downloadToast}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {MOCK_PUBLICATIONS.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                        {pub.category} · {pub.year}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {pub.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {pub.abstract}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">{pub.download_count} Unduhan</span>
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(pub.title)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={13} />
                        <span>Unduh PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. TAB: ERD & SYSTEM ARCHITECTURE                       */}
      {/* ======================================================== */}
      {activeTab === 'system-architecture' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-3">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              DATABASE & PLATFORM INFRASTRUCTURE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ERD & System Database Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Arsitektur basis data relasional PostgreSQL + PostGIS dengan 3 kelompok pengguna (Public, Research, Admin) dan pemisahan tugas validasi (Separation-of-Duties).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database size={16} className="text-blue-600" />
                Daftar Tabel Database Supabase PostGIS
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'profiles', desc: 'Akun RBAC, identitas, institusi, role pengembang' },
                  { name: 'prototypes', desc: 'Inventarisasi hardware EchoVision, ReefCam, status baterai' },
                  { name: 'stations', desc: '12 titik koordinat spasial buoy di sekeliling Pulau Tunda' },
                  { name: 'coral_distribution', desc: 'Poligon tutupan karang GeoJSON ArcGIS' },
                  { name: 'sensor_readings', desc: 'Data deret waktu SST, pH, salinitas, kekeruhan' },
                  { name: 'field_observations', desc: 'Unggahan citra optik & rekaman audio hydrophone' },
                  { name: 'alerts', desc: 'Anomali terdeteksi & status pengiriman WhatsApp API' },
                  { name: 'publications', desc: 'Laporan ilmiah & dataset penelitian yang dipublikasikan' }
                ].map((t) => (
                  <div key={t.name} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono font-bold text-slate-900">{t.name}</span>
                      <p className="text-[11px] text-slate-500">{t.desc}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex-shrink-0">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-purple-600" />
                Aturan Integritas & Pemisahan Tugas (Separation of Duties)
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-600" />
                  Kaidah Validasi Ilmiah REEFSIGHT:
                </div>
                <p className="leading-relaxed">
                  Operator Lapangan yang mengumpulkan data observasi TIDAK DAPAT memvalidasi atau menerbitkan datanya sendiri. Validasi wajib dilakukan oleh Validator Data independen sebelum dipublikasikan ke Public Workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 13. TAB: KONTAK & KOLABORASI REEFSIGHT                   */}
      {/* ======================================================== */}
      {(activeTab === 'contact' || activeTab === 'about') && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_10.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                KONTAK & KOLABORASI REEFSIGHT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Hubungi Kami & Kemitraan Riset
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Pusat komunikasi resmi tim pengembang, peneliti ekologi terumbu karang, dan koordinator operasional stasiun pemantauan Pulau Tunda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informasi Kontak & Stasiun Lapangan */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Informasi Kontak Resmi
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Stasiun Riset & Laboratorium
                </h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-500" />
                    Stasiun Lapangan Pulau Tunda:
                  </span>
                  <p className="text-slate-500 leading-relaxed pl-5">
                    Dermaga Barat, Desa Wargasara, Kecamatan Tirtayasa, Kabupaten Serang, Banten 42193
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    Pusat Laboratorium Komputasi:
                  </span>
                  <p className="text-slate-500 leading-relaxed pl-5">
                    Gedung Riset Sains Kelautan Terpadu, Jl. Raya Jakarta - Serang Km. 4, Kota Serang, Banten
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 block">Surat Elektronik (Email):</span>
                  <div className="space-y-1 pl-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Riset & Sains:</span>
                      <a href="mailto:riset@reefsight.id" className="font-mono text-orange-600 font-bold hover:underline">
                        riset@reefsight.id
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Kemitraan & CSR:</span>
                      <a href="mailto:kolaborasi@reefsight.id" className="font-mono text-blue-600 font-bold hover:underline">
                        kolaborasi@reefsight.id
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Layanan Umum:</span>
                      <a href="mailto:info@reefsight.id" className="font-mono text-slate-700 font-bold hover:underline">
                        info@reefsight.id
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-800 block">Hotline Operasional (WhatsApp):</span>
                  <p className="font-mono text-emerald-700 font-bold pl-1">
                    +62 812-3456-7890 (Koordinator Lapangan)
                  </p>
                  <p className="text-[10px] text-slate-400 pl-1">
                    Layanan konsultasi: Senin - Jumat 08:30 - 17:00 WIB
                  </p>
                </div>
              </div>
            </div>

            {/* Formulir Kontak & Pengajuan Kerja Sama */}
            <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full" />
                  Formulir Interaktif
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Formulir Pengajuan Kemitraan & Pertanyaan Ilmiah
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kirimkan permohonan kolaborasi riset, izin kunjungan stasiun, atau integrasi data telemetri.
                </p>
              </div>

              {contactSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                    Pesan Anda Berhasil Terkirim ke Tim REEFSIGHT!
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-700">
                    Terima kasih atas minat dan dukungan Anda terhadap konservasi ekosistem terumbu karang Pulau Tunda. Koordinator riset kami akan menghubungi Anda melalui email dalam waktu 1×24 jam kerja.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSent(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contoh: Dr. Budi Santoso"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Instansi</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="nama@instansi.ac.id"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Instansi / Organisasi</label>
                      <input
                        type="text"
                        required
                        value={contactInstitution}
                        onChange={(e) => setContactInstitution(e.target.value)}
                        placeholder="Contoh: Universitas Sultan Ageng Tirtayasa"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kategori Minat / Kemitraan</label>
                      <select
                        value={contactCategory}
                        onChange={(e) => setContactCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs bg-white text-slate-800"
                      >
                        <option value="Kolaborasi Penelitian">Riset Akademik & Penelitian Skripsi/Tesis</option>
                        <option value="Kemitraan Konservasi">Program Restorasi Terumbu Karang & CSR</option>
                        <option value="Akses Data Telemetri">Permohonan Data Telemetri & API WebGIS</option>
                        <option value="Kunjungan Lapangan">Kunjungan Ekspedisi & Eduwisata Pulau Tunda</option>
                        <option value="Hardware EchoVision">Konsultasi Teknis Perangkat EchoVision</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pesan / Uraian Rencana Kerja Sama</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Jelaskan secara ringkas maksud, jadwal penelitian, atau bentuk kemitraan yang diharapkan..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-400">
                      🔒 Informasi Anda dilindungi dan hanya digunakan untuk keperluan koordinasi ilmiah.
                    </p>
                    <button
                      type="submit"
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Kirim Permohonan Kolaborasi
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Panduan Rute & Aksesibilitas Menuju Pulau Tunda */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <span>⛵</span>
              <span>Panduan Aksesibilitas & Rute Penyeberangan Pulau Tunda</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-orange-300">1. Titik Keberangkatan</div>
                <p className="text-slate-300 leading-relaxed">
                  Pelabuhan Perikanan Karangantu, Kasemen, Kota Serang. Berjarak ± 15 menit dari gerbang tol Serang Timur.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-orange-300">2. Transportasi Laut</div>
                <p className="text-slate-300 leading-relaxed">
                  Kapal motor kayu penumpang harian (waktu tempuh ± 2 jam) atau speedboat sewa khusus riset (± 45 menit).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-orange-300">3. Izin Operasional Lapangan</div>
                <p className="text-slate-300 leading-relaxed">
                  Peneliti wajib menunjukkan surat tugas dari instansi asal dan melakukan registrasi di posko Pokdarwis Desa Wargasara.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transect Survey Photo Lightbox Modal */}
      {selectedTransect && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Detail Foto Transek Lapangan"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedTransect(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs">
                  {selectedTransect.station}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {selectedTransect.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransect(null)}
                aria-label="Tutup preview"
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedTransect.file}
                alt={selectedTransect.title}
                className="w-full h-full max-h-[60vh] object-contain"
              />
            </div>

            <div className="p-5 sm:p-6 space-y-3 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {selectedTransect.title}
                </h4>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {selectedTransect.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold">Lokasi Sampling</div>
                  <div className="font-bold text-slate-800">{selectedTransect.station}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold">Metodologi</div>
                  <div className="font-bold text-slate-800">Underwater Photo Transect (UPT)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 font-semibold">Format Resolusi</div>
                  <div className="font-bold text-slate-800">High-Res Field Survey JPEG</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={selectedTransect.file}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-2 transition-colors"
                >
                  Buka Gambar Asli ↗
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedTransect(null)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
