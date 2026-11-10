'use client';

import React, { useState } from 'react';
import { UserRole, FieldObservation, ResearchLogbookEntry } from '@/types/reefsight';
import { 
  MOCK_FIELD_OBSERVATIONS, 
  PULAU_TUNDA_STATIONS, 
  MOCK_RESEARCH_LOGBOOKS 
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
  FolderOpen
} from 'lucide-react';

interface Props {
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

export default function ResearchWorkspaceView({ activeRole, onSwitchRole }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'field' | 'env' | 'validation' | 'logbook' | 'reports'>('dashboard');

  // Observations State (Local reactivity)
  const [observations, setObservations] = useState<FieldObservation[]>(MOCK_FIELD_OBSERVATIONS);
  const [logbooks, setLogbooks] = useState<ResearchLogbookEntry[]>(MOCK_RESEARCH_LOGBOOKS);

  // Field Data Form state
  const [selectedStation, setSelectedStation] = useState(PULAU_TUNDA_STATIONS[0].id);
  const [depthInput, setDepthInput] = useState('5.5');
  const [tempInput, setTempInput] = useState('28.5');
  const [turbidityInput, setTurbidityInput] = useState('1.2');
  const [notesInput, setNotesInput] = useState('');
  const [audioName, setAudioName] = useState('hydrophone_rec_sample.wav');
  const [formSuccess, setFormSuccess] = useState(false);

  // Validation modal state
  const [selectedObsToValidate, setSelectedObsToValidate] = useState<FieldObservation | null>(null);
  const [validatorFeedback, setValidatorFeedback] = useState('');

  // Handle New Field Submission (Operator Lapangan)
  const handleSubmitFieldData = (e: React.FormEvent) => {
    e.preventDefault();
    const newObs: FieldObservation = {
      id: `OBS-2026-0${observations.length + 82}`,
      station_id: selectedStation,
      operator_name: activeRole === 'operator_lapangan' ? 'Operator Lapangan (Anda)' : 'Tim Lapangan',
      date_time: new Date().toLocaleString('id-ID'),
      depth_m: parseFloat(depthInput) || 5.0,
      water_temp_c: parseFloat(tempInput) || 28.5,
      turbidity_ntu: parseFloat(turbidityInput) || 1.2,
      audio_file_name: audioName,
      audio_duration_sec: 180,
      image_count: 12,
      live_coral_cover_pct: 48.0,
      notes: notesInput || 'Pengamatan rutin stasiun buoy pulau tunda.',
      validation_status: 'Pending Validation'
    };

    setObservations([newObs, ...observations]);
    setFormSuccess(true);
    setNotesInput('');
    setTimeout(() => setFormSuccess(false), 4000);
  };

  // Handle Validation Action (Validator Data)
  const handleValidateAction = (status: 'Approved' | 'Returned' | 'Rejected') => {
    if (!selectedObsToValidate) return;

    const updated = observations.map(obs => {
      if (obs.id === selectedObsToValidate.id) {
        return {
          ...obs,
          validation_status: status,
          validator_name: 'Validator Data (Anda)',
          validator_notes: validatorFeedback || (status === 'Approved' ? 'Data tervalidasi dan layak dipublikasikan.' : 'Memerlukan perbaikan.')
        };
      }
      return obs;
    });

    setObservations(updated);
    setSelectedObsToValidate(null);
    setValidatorFeedback('');
  };

  // Role separation warning
  const isOperator = activeRole === 'operator_lapangan';
  const isValidator = activeRole === 'validator_data';
  const isResearcher = activeRole === 'peneliti_ekologi';
  const isAdmin = activeRole === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Research Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Internal Research & Field Workspace
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Portal Tim Ekologi dan Riset</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Ruang kerja terpadu untuk pengumpulan data insitu lapangan, analisis bioakustik/optik, pemeriksaan kualitas data (QA/QC), dan penyusunan laporan ilmiah Pulau Tunda.
            </p>
          </div>

          {/* Quick Role Switcher for Testing */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1.5 min-w-[240px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Fungsi Kerja Aktif:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSwitchRole('operator_lapangan')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition ${
                  isOperator ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Operator
              </button>
              <button
                onClick={() => onSwitchRole('peneliti_ekologi')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition ${
                  isResearcher ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Peneliti
              </button>
              <button
                onClick={() => onSwitchRole('validator_data')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition ${
                  isValidator ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Validator
              </button>
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: 'Research Dashboard', icon: Activity },
            { id: 'field', label: 'Field Data Collection', icon: Radio },
            { id: 'env', label: 'Environmental Data', icon: Thermometer },
            { id: 'validation', label: 'Data Validation (QA/QC)', icon: CheckCircle, badge: observations.filter(o => o.validation_status === 'Pending Validation').length },
            { id: 'logbook', label: 'Research Logbook', icon: BookOpen },
            { id: 'reports', label: 'Scientific Reports', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: RESEARCH DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Total Data Observasi</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-white">{observations.length} Entri</span>
                <span className="text-xs text-emerald-400 font-semibold">+3 Pekan Ini</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Menunggu Validasi (QA)</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {observations.filter(o => o.validation_status === 'Pending Validation').length}
                </span>
                <span className="text-xs text-amber-400/80 font-medium">Perlu Review</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Data Terverifikasi (Valid)</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {observations.filter(o => o.validation_status === 'Approved').length}
                </span>
                <span className="text-xs text-slate-400 font-medium">Siap Publikasi</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Stasiun Buoy Aktif</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">11 / 12</span>
                <span className="text-xs text-slate-400 font-medium">1 Maintenance</span>
              </div>
            </div>
          </div>

          {/* Recent Observations List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Log Pengambilan Data Lapangan Terbaru</h3>
              <button
                onClick={() => setActiveSubTab('field')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Data Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ID Observasi</th>
                    <th className="py-3 px-4">Stasiun</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Kedalaman</th>
                    <th className="py-3 px-4">SST</th>
                    <th className="py-3 px-4">Tutupan Karang</th>
                    <th className="py-3 px-4">Status Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {observations.map(obs => (
                    <tr key={obs.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{obs.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{obs.station_id}</td>
                      <td className="py-3 px-4 text-slate-400">{obs.date_time}</td>
                      <td className="py-3 px-4">{obs.depth_m} m</td>
                      <td className="py-3 px-4 font-mono text-amber-300">{obs.water_temp_c}°C</td>
                      <td className="py-3 px-4 font-bold text-cyan-300">{obs.live_coral_cover_pct}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          obs.validation_status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : obs.validation_status === 'Pending Validation'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {obs.validation_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FIELD DATA COLLECTION FORM */}
      {activeSubTab === 'field' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Formulir Penginputan Insitu
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Field Data Collection Form</h3>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan formulir ini untuk merekam hasil ekspedisi lapangan, pengukuran sensor, dan unggah berkas audio/citra.
              </p>
            </div>

            {formSuccess && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Data berhasil disimpan dan masuk ke antrean <strong>Data Validation</strong> untuk diperiksa oleh Validator Data.</span>
              </div>
            )}

            <form onSubmit={handleSubmitFieldData} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Pilih Stasiun Buoy:</label>
                  <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {PULAU_TUNDA_STATIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Kedalaman Pengukuran (m):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={depthInput}
                    onChange={(e) => setDepthInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Suhu Permukaan Laut / SST (°C):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempInput}
                    onChange={(e) => setTempInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Kekeruhan Perairan (NTU):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={turbidityInput}
                    onChange={(e) => setTurbidityInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              {/* Upload Simulasi */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-dashed border-slate-700 space-y-2">
                <span className="text-xs font-bold text-cyan-400 block flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Berkas Audio Hydrophone & Foto Optik
                </span>
                <p className="text-[11px] text-slate-400">
                  Simulasi upload rekaman `.wav` dan citra foto bawah laut ke bucket Supabase Storage.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    {audioName}
                  </span>
                  <span className="text-xs text-slate-500">(12 Foto Otomatis Terdeteksi)</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Catatan Observasi Lapangan:</label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Deskripsikan kondisi tutupan karang, kesehatan biota, atau kendala perangkat..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
              >
                Simpan & Ajukan ke Validator Data
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DATA VALIDATION (QA/QC PORTAL) */}
      {activeSubTab === 'validation' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Data Quality Assurance (QA/QC Portal)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pemeriksaan kualitas, kelengkapan informasi, dan kelayakan data sebelum disetujui untuk dipublikasikan.
              </p>
            </div>

            {!isValidator && !isAdmin && (
              <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Peringatan: Hak validasi hanya dimiliki oleh <strong>Validator Data</strong> (Prinsip Pemisahan Tugas).</span>
              </div>
            )}
          </div>

          {/* Validation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID Data</th>
                  <th className="py-3 px-4">Stasiun</th>
                  <th className="py-3 px-4">Operator Pengunggah</th>
                  <th className="py-3 px-4">Parameter Lapangan</th>
                  <th className="py-3 px-4">Status Saat Ini</th>
                  <th className="py-3 px-4 text-right">Aksi Validator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {observations.map(obs => (
                  <tr key={obs.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{obs.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{obs.station_id}</td>
                    <td className="py-3 px-4 text-slate-300">{obs.operator_name}</td>
                    <td className="py-3 px-4 text-slate-400">
                      Depth: {obs.depth_m}m · SST: {obs.water_temp_c}°C · Tutupan: {obs.live_coral_cover_pct}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        obs.validation_status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : obs.validation_status === 'Pending Validation'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {obs.validation_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedObsToValidate(obs)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
                      >
                        Periksa Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Validation Inspector Modal */}
          {selectedObsToValidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      Pemeriksaan QA/QC Data
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedObsToValidate.id} - {selectedObsToValidate.station_id}</h3>
                  </div>
                  <button onClick={() => setSelectedObsToValidate(null)} className="text-slate-400 hover:text-white text-lg">×</button>
                </div>

                <div className="space-y-2 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <p><strong className="text-slate-400">Operator:</strong> {selectedObsToValidate.operator_name}</p>
                    <p><strong className="text-slate-400">Waktu Rekam:</strong> {selectedObsToValidate.date_time}</p>
                    <p><strong className="text-slate-400">Kedalaman:</strong> {selectedObsToValidate.depth_m} m</p>
                    <p><strong className="text-slate-400">Suhu Perairan:</strong> {selectedObsToValidate.water_temp_c} °C</p>
                    <p><strong className="text-slate-400">Kekeruhan:</strong> {selectedObsToValidate.turbidity_ntu} NTU</p>
                    <p><strong className="text-slate-400">Tutupan Karang:</strong> {selectedObsToValidate.live_coral_cover_pct}%</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-slate-400">Catatan Operator:</p>
                    <p className="text-slate-200 mt-0.5">{selectedObsToValidate.notes}</p>
                  </div>
                  {selectedObsToValidate.audio_file_name && (
                    <div className="pt-1 text-[11px] text-cyan-300 font-mono">
                      File Audio: {selectedObsToValidate.audio_file_name} ({selectedObsToValidate.audio_duration_sec}s)
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Catatan Validator / Alasan Keputusan:</label>
                  <textarea
                    rows={2}
                    value={validatorFeedback}
                    onChange={(e) => setValidatorFeedback(e.target.value)}
                    placeholder="Tuliskan catatan pemeriksaan kualitas data..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Validation Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleValidateAction('Approved')}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition"
                  >
                    Setujui (Approve)
                  </button>
                  <button
                    onClick={() => handleValidateAction('Returned')}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
                  >
                    Kembalikan (Revisi)
                  </button>
                  <button
                    onClick={() => handleValidateAction('Rejected')}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: SCIENTIFIC REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Generator Laporan Ilmiah
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Scientific Reports & Publication Export</h3>
              <p className="text-xs text-slate-400">
                Penyusunan laporan saintifik terpadu berdasarkan data observasi bioakustik, optik, dan parameter oseanografi.
              </p>
            </div>

            <button
              onClick={() => alert('Mengunduh Laporan Ilmiah REEFSIGHT Pulau Tunda dalam format PDF...')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
            >
              <FileDown className="w-4 h-4" /> Download PDF Report
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400">REEFSIGHT-REP-2026-TUNDA-01</span>
              <h4 className="text-sm font-bold text-white mt-1">
                Laporan Hasil Pemantauan Bioakustik dan Dinamika Tutupan Karang Pulau Tunda (Kuartal IV 2026)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Disusun oleh: Tim Peneliti Ekologi REEFSIGHT · Diverifikasi oleh: Dr. Ilham (Validator Data)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Stasiun Tervalidasi</span>
                <span className="text-base font-bold text-white mt-0.5 block">12 Titik Stasiun</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Rerata ACI Bioakustik</span>
                <span className="text-base font-bold text-cyan-400 mt-0.5 block">0.68 (Kompleksitas Baik)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tutupan Karang Hidup</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">49.4% (Kategori Sedang)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Ringkasan Eksekutif:</strong> Pemantauan menggunakan prototipe EchoVision selama periode pengamatan menunjukkan bahwa zona perairan utara Pulau Tunda mempertahankan tutupan karang hidup yang stabil di atas 58%. Namun, zona timur (RFS-STA-002 dan STA-007) memerlukan perhatian konservasi akibat kenaikan suhu permukaan laut dan gangguan mekanik perahu nelayan. Rekomendasi pengelolaan mencakup pemasangan mooring buoy dan pembatasan zona ekowisata.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: LOGBOOK */}
      {activeSubTab === 'logbook' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Research Logbook Internal</h3>
              <p className="text-xs text-slate-400">Catatan aktivitas lapangan, pemasangan sensor, dan pemeliharaan alat.</p>
            </div>
            <button
              onClick={() => alert('Formulir entri logbook baru dibuka.')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Catatan Log
            </button>
          </div>

          <div className="space-y-3">
            {logbooks.map(log => (
              <div key={log.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">{log.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">{log.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{log.content}</p>
                <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500">
                  <span>Penulis: <strong className="text-slate-400">{log.author}</strong> · Kategori: {log.category}</span>
                  <span className="text-emerald-400">Telah Disetujui Publik</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ENVIRONMENTAL DATA */}
      {activeSubTab === 'env' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-200 space-y-4">
          <h3 className="text-sm font-bold text-white">Environmental Data Records</h3>
          <p className="text-xs text-slate-400">Kompilasi parameter oseanografi per stasiun Pulau Tunda.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Stasiun</th>
                  <th className="py-2.5 px-3">SST (°C)</th>
                  <th className="py-2.5 px-3">Salinitas (PSU)</th>
                  <th className="py-2.5 px-3">pH</th>
                  <th className="py-2.5 px-3">DO (mg/L)</th>
                  <th className="py-2.5 px-3">Kekeruhan (NTU)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PULAU_TUNDA_STATIONS.map(st => (
                  <tr key={st.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">{st.id} ({st.position_label})</td>
                    <td className="py-2.5 px-3 font-mono">{st.temperature_c}°C</td>
                    <td className="py-2.5 px-3 font-mono">{st.salinity_psu}</td>
                    <td className="py-2.5 px-3 font-mono">{st.ph}</td>
                    <td className="py-2.5 px-3 font-mono">{st.dissolved_oxygen_mg_l}</td>
                    <td className="py-2.5 px-3 font-mono">{st.turbidity_ntu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
