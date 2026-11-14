'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types/reefsight';
import {
  MOCK_FIELD_OBSERVATIONS,
  PULAU_TUNDA_STATIONS,
  MOCK_RESEARCH_LOGBOOKS,
  FIELD_COLLECTIONS_MOCK,
  USER_DIRECTORY,
  PULAU_TUNDA_TRANSECT_PHOTOS
} from '@/data/mockData';
import {
  Activity,
  Radio,
  CheckCircle,
  BookOpen,
  FileText,
  Upload,
  Layers,
  Thermometer,
  Plus,
  FileDown,
  Eye,
  Check,
  X,
  RotateCcw,
  AlertTriangle,
  FolderOpen,
  Camera,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Cpu,
  Mic2,
  Waves,
  Search,
  Filter,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Inbox,
  Microscope
} from 'lucide-react';

type ResearchTabId =
  | 'dashboard'
  | 'field-collection'
  | 'environmental-data'
  | 'coral-analysis'
  | 'ecological-dynamics'
  | 'data-validation'
  | 'research-logbook'
  | 'scientific-reports';

const VALID_RESEARCH_TABS: ResearchTabId[] = [
  'dashboard',
  'field-collection',
  'environmental-data',
  'coral-analysis',
  'ecological-dynamics',
  'data-validation',
  'research-logbook',
  'scientific-reports',
];

interface Props {
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function ResearchWorkspaceView({
  activeRole,
  onSwitchRole,
  activeTab: controlledTab,
  onSelectTab,
}: Props) {
  const [internalTab, setInternalTab] = useState<ResearchTabId>('dashboard');
  const activeTab: ResearchTabId =
    controlledTab && VALID_RESEARCH_TABS.includes(controlledTab as ResearchTabId)
      ? (controlledTab as ResearchTabId)
      : internalTab;
  const setActiveTab = (tab: ResearchTabId) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };
  const [researchNotice, setResearchNotice] = useState<{
    type: 'error' | 'info' | 'success';
    message: string;
  } | null>(null);

  // Field Collections state
  const [collections, setCollections] = useState<any[]>(FIELD_COLLECTIONS_MOCK);
  const [selectedCollection, setSelectedCollection] = useState<any>(FIELD_COLLECTIONS_MOCK[1]); // Default COL-2025-0283
  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Validation state
  const [validationData, setValidationData] = useState<any[]>(FIELD_COLLECTIONS_MOCK);
  const [selectedValidationItem, setSelectedValidationItem] = useState<any>(FIELD_COLLECTIONS_MOCK[1]);
  const [validationNotes, setValidationNotes] = useState('');
  const [validationSuccessMsg, setValidationSuccessMsg] = useState('');

  // Field Data Form state
  const [newTitle, setNewTitle] = useState('Survei Pemantauan Bentik Pulau Tunda');
  const [newType, setNewType] = useState('Optical');
  const [newStation, setNewStation] = useState('TUN-01');
  const [newDepth, setNewDepth] = useState('8.5');
  const [newNotes, setNewNotes] = useState('');

  // Handle Validation Action (enforcing Separation of Duties)
  const handleValidate = (status: 'Validated' | 'Needs Revision' | 'Rejected') => {
    // Separation of Duties check: Operator Lapangan cannot validate data!
    if (activeRole === 'operator_lapangan') {
      setResearchNotice({
        type: 'error',
        message:
          'Akses Ditolak (Separation of Duties): Sebagai Operator Lapangan, Anda tidak berhak memvalidasi atau menyetujui data lapangan. Silakan gunakan akun Validator Data.',
      });
      return;
    }
    setResearchNotice(null);

    const updated = validationData.map((item) => {
      if (item.id === selectedValidationItem.id) {
        return {
          ...item,
          validationStatus: status,
          notes: validationNotes ? `${item.notes} [Validator: ${validationNotes}]` : item.notes
        };
      }
      return item;
    });

    setValidationData(updated);
    setSelectedValidationItem({
      ...selectedValidationItem,
      validationStatus: status
    });
    setValidationSuccessMsg(`Status data ${selectedValidationItem.collectionCode} berhasil diubah menjadi "${status}".`);
    setTimeout(() => setValidationSuccessMsg(''), 4000);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: `COL-2025-0${collections.length + 285}`,
      collectionCode: `COL-2025-0${collections.length + 285}`,
      collectionTitle: newTitle,
      stationId: newStation,
      stationCode: newStation,
      operatorId: 'USR-003',
      operatorName: 'Dimas Pratama (Operator Lapangan)',
      observationDate: '14 Nov 2025',
      timeWindow: '11:00 WIB',
      depthM: parseFloat(newDepth) || 8.0,
      deviceUsed: 'ReefCam (RC-01)',
      collectionType: newType as any,
      fileCount: 24,
      fileSizeBytes: 3200000000,
      completenessPct: 100,
      validationStatus: 'Pending' as const,
      notes: newNotes || 'Pengambilan data lapangan baru.'
    };

    setCollections([newRecord, ...collections]);
    setIsNewFieldModalOpen(false);
    setWizardStep(1);
    setNewNotes('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Separation of Duties Warning if activeRole === 'operator_lapangan' */}
      {researchNotice && (
        <div
          role={researchNotice.type === 'error' ? 'alert' : 'status'}
          className={`p-3.5 sm:p-4 rounded-2xl border text-xs flex items-start sm:items-center justify-between gap-3 shadow-xs ${
            researchNotice.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : researchNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-sky-50 border-sky-200 text-sky-900'
          }`}
        >
          <span className="leading-relaxed font-medium">{researchNotice.message}</span>
          <button
            type="button"
            onClick={() => setResearchNotice(null)}
            aria-label="Tutup pemberitahuan"
            className="min-w-[44px] min-h-[44px] -my-2 -mr-2 inline-flex items-center justify-center rounded-xl hover:bg-black/5 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {activeRole === 'operator_lapangan' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="leading-relaxed">
              <span className="font-bold">Mode Operator Lapangan:</span> Anda memiliki izin pengumpulan data & upload sensor, namun tidak berhak memvalidasi atau menerbitkan data (Separation-of-Duties).
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSwitchRole('validator_data')}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex-shrink-0 transition-colors"
          >
            Switch to Validator
          </button>
        </div>
      )}

      {/* Workspace Subtabs Navigation */}
      <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700">
        {[
          { id: 'dashboard', label: 'Research Dashboard', icon: Activity },
          { id: 'field-collection', label: 'Field Data Collection', icon: Camera },
          { id: 'environmental-data', label: 'Environmental Data', icon: Waves },
          { id: 'coral-analysis', label: 'Coral Distribution Analysis', icon: Layers },
          { id: 'ecological-dynamics', label: 'Ecological Dynamics', icon: Cpu },
          { id: 'data-validation', label: 'Data Validation (QA/QC)', icon: CheckCircle2 },
          { id: 'research-logbook', label: 'Research Logbook', icon: BookOpen },
          { id: 'scientific-reports', label: 'Scientific Reports', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ResearchTabId)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
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
      {/* 01. TAB: RESEARCH DASHBOARD - image24.jpeg               */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Panoramic Banner matching image24.jpeg */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_13.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                RESEARCH WORKSPACE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Research Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Monitor research activities, field data collection, processing progress, and scientific data validation across REEFSIGHT.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-orange-400" />
                  Periode: Jan – Mar 2025
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-orange-400" />
                  Lokasi: Pulau Tunda (TUN-01 – TUN-04)
                </span>
              </div>
            </div>
          </div>

          {/* Research Overview Metric Cards matching image24.jpeg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Total Research Data</div>
              <div className="text-2xl font-black text-slate-900 mt-1">2,846</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ +12.4% vs periode lalu</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Collected Data</div>
              <div className="text-2xl font-black text-blue-600 mt-1">1,567</div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">Acoustic, Optic, Env</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Processing Data</div>
              <div className="text-2xl font-black text-purple-600 mt-1">684</div>
              <div className="text-[10px] text-purple-700 font-medium mt-1">24.0% dari total</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Pending Validation</div>
              <div className="text-2xl font-black text-amber-600 mt-1">317</div>
              <div className="text-[10px] text-amber-700 font-medium mt-1">11.1% butuh review</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Validated Data</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">2,312</div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1">81.3% data selesai</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Research Activities</div>
              <div className="text-2xl font-black text-rose-600 mt-1">48</div>
              <div className="text-[10px] text-rose-700 font-medium mt-1">↑ +6 vs minggu lalu</div>
            </div>
          </div>

          {/* Research Data Pipeline flow matching image24.jpeg */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Research Data Pipeline Flow
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center [&>div]:w-full sm:[&>div]:w-auto">
              <div className="sm:flex-1 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <Inbox size={18} />
                </div>
                <div className="text-xs font-bold text-slate-900">Collected</div>
                <div className="text-lg font-black text-blue-600">1,567</div>
              </div>
              <div className="text-slate-300 font-bold hidden sm:block text-xl">→</div>
              <div className="flex-1 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <Cpu size={18} />
                </div>
                <div className="text-xs font-bold text-slate-900">Processing</div>
                <div className="text-lg font-black text-purple-600">684</div>
              </div>
              <div className="text-slate-300 font-bold hidden sm:block text-xl">→</div>
              <div className="flex-1 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <Search size={18} />
                </div>
                <div className="text-xs font-bold text-slate-900">Validation</div>
                <div className="text-lg font-black text-amber-600">317</div>
              </div>
              <div className="text-slate-300 font-bold hidden sm:block text-xl">→</div>
              <div className="flex-1 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <CheckCircle2 size={18} />
                </div>
                <div className="text-xs font-bold text-slate-900">Validated</div>
                <div className="text-lg font-black text-emerald-600">2,312</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 02. TAB: FIELD DATA COLLECTION - image25.png             */}
      {/* ======================================================== */}
      {activeTab === 'field-collection' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image25.png */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_14.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                FIELD DATA COLLECTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Field Data Collection
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Collect, organize, and manage underwater field observations and research datasets across REEFSIGHT research stations.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewFieldModalOpen(true)}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Plus size={14} />
                  <span>+ New Field Collection</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setResearchNotice({
                      type: 'info',
                      message:
                        'Panel upload dataset sensor (CSV/WAV/GeoJSON) siap digunakan. Pilih file dari perangkat Anda untuk divalidasi.',
                    })
                  }
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Upload size={14} />
                  <span>Upload Dataset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table of Records & Inspector Drawer matching image25.png */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">Collection Records (2,846 records)</h3>
                <span className="text-xs text-slate-500">Pulau Tunda Fleet</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Collection ID</th>
                      <th className="py-2.5 px-3">Station</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {collections.map((col) => (
                      <tr
                        key={col.id}
                        onClick={() => setSelectedCollection(col)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          selectedCollection.id === col.id ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{col.collectionCode}</td>
                        <td className="py-3 px-3 text-slate-700">{col.stationCode}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                            {col.collectionType}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{col.observationDate}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              col.validationStatus === 'Validated'
                                ? 'bg-emerald-100 text-emerald-700'
                                : col.validationStatus === 'Pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {col.validationStatus}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            aria-label="Lihat detail rekaman observasi"
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

            {/* Right Drawer: Inspection Card matching image25.png */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-base">
                    {selectedCollection.collectionCode}
                  </span>
                  <p className="text-xs text-slate-500">{selectedCollection.collectionTitle}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  {selectedCollection.collectionType}
                </span>
              </div>

              <div className="h-40 rounded-2xl overflow-hidden bg-slate-900 relative">
                <img
                  src={
                    selectedCollection.collectionType === 'Acoustic'
                      ? '/soundscape/reef_spectrograms.png'
                      : '/images/coral-surveys/tunda_transect_02.jpg'
                  }
                  alt="Inspection"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                  {selectedCollection.collectionType === 'Acoustic' ? 'Spektrogram Akustik' : 'Dokumentasi Lapangan UPT'}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Foto Transek Terkait ({PULAU_TUNDA_TRANSECT_PHOTOS.length} sampel)
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {PULAU_TUNDA_TRANSECT_PHOTOS.slice(0, 4).map((tp) => (
                    <div key={tp.id} className="h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group relative">
                      <img src={tp.file} alt={tp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Pengumpul</span>
                  <span className="font-semibold text-slate-800">{selectedCollection.operatorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Stasiun</span>
                  <span className="font-semibold text-slate-800">{selectedCollection.stationCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Kedalaman</span>
                  <span className="font-semibold text-slate-800">{selectedCollection.depthM} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kelengkapan</span>
                  <span className="font-bold text-emerald-600">{selectedCollection.completenessPct}%</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="font-bold block mb-1">Catatan Observasi:</span>
                <p className="leading-relaxed">{selectedCollection.notes}</p>
              </div>
            </div>
          </div>

          {/* + New Field Collection 5-Step Modal matching image25.png */}
          {isNewFieldModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Tambah pengumpulan data lapangan baru"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsNewFieldModalOpen(false);
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsNewFieldModalOpen(false);
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
            >
              <div className="w-full max-w-xl max-h-[90dvh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200">
                <div className="sticky top-0 z-10 px-5 py-4 sm:p-6 bg-white/95 backdrop-blur-xs border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900">+ New Field Collection</h3>
                    <p className="text-xs text-slate-500">Step {wizardStep} of 5: Data Entry</p>
                  </div>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setIsNewFieldModalOpen(false)}
                    aria-label="Tutup modal pengumpulan data"
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateCollection} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Collection Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tipe Data</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Optical">Optical (Foto / Video)</option>
                        <option value="Acoustic">Acoustic (Hydrophone)</option>
                        <option value="Environmental">Environmental (Probe)</option>
                        <option value="Ecological">Ecological (UVC Fish)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Stasiun Riset</label>
                      <select
                        value={newStation}
                        onChange={(e) => setNewStation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="TUN-01">TUN-01 (Legon Bajo)</option>
                        <option value="TUN-02">TUN-02 (Karang Abang)</option>
                        <option value="TUN-03">TUN-03 (Ciput)</option>
                        <option value="TUN-04">TUN-04 (Teluk Selatan)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kedalaman Pengamatan (meter)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newDepth}
                      onChange={(e) => setNewDepth(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deskripsi & Catatan Lapangan</label>
                    <textarea
                      rows={3}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Tuliskan catatan kondisi cuaca, visibilitas air, dan temuan karang..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsNewFieldModalOpen(false)}
                      className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
                    >
                      Simpan & Kirim ke Antrean Validasi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 03. TAB: DATA VALIDATION (QA/QC) - image29.png           */}
      {/* ======================================================== */}
      {activeTab === 'data-validation' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner matching image29.png */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_15.jpg')` }}
            />
            <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                <span className="w-4 h-0.5 bg-orange-400" />
                DATA MANAGEMENT & QA/QC
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Data Validation
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Review, verify, and manage the scientific quality of ecological research data before public release.
              </p>
            </div>
          </div>

          {/* Validation Metrics matching image29.png */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-amber-600">317</div>
              <div className="text-xs font-bold text-slate-800">Pending Validation</div>
              <div className="text-[10px] text-slate-400">Butuh pemeriksaan</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-emerald-600">2,312</div>
              <div className="text-xs font-bold text-slate-800">Validated</div>
              <div className="text-[10px] text-slate-400">Siap dipublikasikan</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-purple-600">186</div>
              <div className="text-xs font-bold text-slate-800">Needs Revision</div>
              <div className="text-[10px] text-slate-400">Dikembalikan ke tim</div>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-rose-600">31</div>
              <div className="text-xs font-bold text-slate-800">Rejected</div>
              <div className="text-[10px] text-slate-400">Tidak lolos QC</div>
            </div>
          </div>

          {/* Success Banner */}
          {validationSuccessMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              {validationSuccessMsg}
            </div>
          )}

          {/* Main Grid: Validation Queue (Left) & Inspector with Action Buttons (Right) matching image29.png */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queue Table */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Daftar Data Validasi (317 data)</h3>
                <span className="text-xs text-slate-400">Antrean QA/QC</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Collection ID</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Stasiun</th>
                      <th className="py-2.5 px-3">Pengumpul</th>
                      <th className="py-2.5 px-3">Kelengkapan</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {validationData.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedValidationItem(item)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedValidationItem.id === item.id ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.collectionCode}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                            {item.collectionType}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{item.stationCode}</td>
                        <td className="py-3 px-3 text-slate-600">{item.operatorName}</td>
                        <td className="py-3 px-3">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${item.completenessPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.validationStatus === 'Validated'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.validationStatus === 'Pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {item.validationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Drawer: Inspection & Decision Actions matching image29.png */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-mono font-bold text-slate-900 text-base">
                    {selectedValidationItem.collectionCode}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedValidationItem.collectionTitle}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  {selectedValidationItem.collectionType}
                </span>
              </div>

              <div className="h-40 rounded-2xl overflow-hidden bg-slate-900 relative">
                <img
                  src={
                    selectedValidationItem.collectionType === 'Acoustic'
                      ? '/soundscape/reef_spectrograms.png'
                      : '/images/coral-surveys/tunda_transect_04.jpg'
                  }
                  alt="Validation Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                  {selectedValidationItem.collectionType === 'Acoustic' ? 'Spektrogram Akustik' : 'Citra Bawah Air UPT'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Kategori Data</span>
                  <span className="font-semibold text-slate-800">{selectedValidationItem.collectionType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Pengumpul</span>
                  <span className="font-semibold text-slate-800">{selectedValidationItem.operatorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Stasiun</span>
                  <span className="font-semibold text-slate-800">{selectedValidationItem.stationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kelengkapan</span>
                  <span className="font-bold text-emerald-600">{selectedValidationItem.completenessPct}%</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Validator:
                </label>
                <textarea
                  rows={2}
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder="Tuliskan catatan verifikasi kualitas atau instruksi revisi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* 3 Decision Action Buttons matching image29.png */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleValidate('Rejected')}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <X size={14} />
                  <span>Tolak</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleValidate('Needs Revision')}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Revisi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleValidate('Validated')}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Validasi</span>
                </button>
              </div>
              {researchNotice?.type === 'error' && activeRole === 'operator_lapangan' && (
                <p
                  role="alert"
                  className="text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2"
                >
                  {researchNotice.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 04. TAB: RESEARCH LOGBOOK */}
      {activeTab === 'research-logbook' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-3">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              RESEARCH LOGBOOK & EXPEDITION ARCHIVE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Logbook Riset & Catatan Ekspedisi Pulau Tunda
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Arsip kronologis catatan teknis lapangan operator buoy, sampling oseanografi perairan, dan inspeksi foto transek kuadrat terumbu karang.
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_RESEARCH_LOGBOOKS.map((log, i) => (
              <div
                key={log.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between"
              >
                <div className="space-y-2.5 max-w-3xl">
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
                  <h4 className="text-base font-bold text-slate-900">{log.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{log.content}</p>
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                    Pelapor: <span className="font-semibold text-slate-700">{log.author}</span>
                  </div>
                </div>
                <div className="w-full md:w-52 h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 flex-shrink-0">
                  <img
                    src={PULAU_TUNDA_TRANSECT_PHOTOS[i % PULAU_TUNDA_TRANSECT_PHOTOS.length].file}
                    alt={log.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs fallback for remaining modules */}
      {(activeTab === 'environmental-data' ||
        activeTab === 'coral-analysis' ||
        activeTab === 'ecological-dynamics' ||
        activeTab === 'scientific-reports') && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <Microscope size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 capitalize">
            {activeTab.replace('-', ' ')}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Modul analisis penelitian ekologi terhubung langsung dengan basis data telemetri 12 stasiun buoy Pulau Tunda dan terintegrasi dengan validasi QA/QC.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Kembali ke Research Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
