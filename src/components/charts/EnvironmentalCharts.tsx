'use client';

import React, { useState } from 'react';
import { Thermometer, Droplets, LineChart, TrendingDown, Info, Calculator, Flame } from 'lucide-react';

export default function EnvironmentalCharts() {
  const [selectedVar, setSelectedVar] = useState<'sst_coral' | 'chla_fish' | 'turb_diversity'>('sst_coral');
  const [selectedMonth, setSelectedMonth] = useState<string>('Mei');
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);

  // Time-series monthly data for Pulau Tunda (Jan - Des)
  const monthlyData = [
    { month: 'Jan', sst: 28.1, chla: 0.38, dhw: 0.2 },
    { month: 'Feb', sst: 28.3, chla: 0.42, dhw: 0.5 },
    { month: 'Mar', sst: 28.6, chla: 0.45, dhw: 1.1 },
    { month: 'Apr', sst: 29.1, chla: 0.39, dhw: 2.2 },
    { month: 'Mei', sst: 29.8, chla: 0.32, dhw: 3.8 }, // Peak thermal stress
    { month: 'Jun', sst: 29.4, chla: 0.35, dhw: 3.4 },
    { month: 'Jul', sst: 28.7, chla: 0.41, dhw: 2.1 },
    { month: 'Agu', sst: 28.2, chla: 0.48, dhw: 1.0 },
    { month: 'Sep', sst: 27.9, chla: 0.52, dhw: 0.4 },
    { month: 'Okt', sst: 28.0, chla: 0.49, dhw: 0.2 },
    { month: 'Nov', sst: 28.4, chla: 0.44, dhw: 0.3 },
    { month: 'Des', sst: 28.2, chla: 0.40, dhw: 0.2 },
  ];

  // Correlation Scatter Points
  const correlationSets = {
    sst_coral: {
      title: 'Suhu Permukaan Laut (SST) vs Persentase Tutupan Karang Hidup',
      xLabel: 'Sea Surface Temperature (°C)',
      yLabel: 'Live Coral Cover (%)',
      pearsonR: -0.76,
      spearmanRho: -0.74,
      rSquared: 0.58,
      pValue: '< 0.001',
      interpretation: 'Korelasi negatif kuat yang signifikan: Kenaikan suhu perairan di atas 28.5°C (ambang MMM) berhubungan langsung dengan penurunan tutupan karang hidup dan peningkatan kejadian bleaching di Pulau Tunda.',
      points: [
        { x: 27.9, y: 64.2 }, { x: 28.0, y: 62.0 }, { x: 28.1, y: 58.5 },
        { x: 28.2, y: 56.1 }, { x: 28.3, y: 54.0 }, { x: 28.4, y: 52.8 },
        { x: 28.6, y: 49.3 }, { x: 28.7, y: 46.5 }, { x: 29.1, y: 41.2 },
        { x: 29.4, y: 36.8 }, { x: 29.8, y: 31.5 }, { x: 28.5, y: 50.1 }
      ]
    },
    chla_fish: {
      title: 'Konsentrasi Klorofil-a (CHL-a) vs Kelimpahan Ikan Karang',
      xLabel: 'Chlorophyll-a (mg/m³)',
      yLabel: 'Individu Ikan / 100m²',
      pearsonR: 0.62,
      spearmanRho: 0.59,
      rSquared: 0.38,
      pValue: '0.008',
      interpretation: 'Korelasi positif sedang: Peningkatan klorofil-a mencerminkan produktivitas primer plankton yang mendukung kelimpahan ikan planktivora dan herbivora, namun kadar yang terlalu tinggi berisiko memicu ledakan alga.',
      points: [
        { x: 0.32, y: 42 }, { x: 0.35, y: 48 }, { x: 0.38, y: 55 },
        { x: 0.39, y: 59 }, { x: 0.40, y: 63 }, { x: 0.41, y: 68 },
        { x: 0.42, y: 72 }, { x: 0.44, y: 79 }, { x: 0.48, y: 86 },
        { x: 0.49, y: 91 }, { x: 0.52, y: 104 }, { x: 0.45, y: 81 }
      ]
    },
    turb_diversity: {
      title: 'Kekeruhan Air (Turbidity) vs Indeks Keanekaragaman Karang',
      xLabel: 'Turbidity (NTU)',
      yLabel: 'Indeks Shannon-Wiener (H\')',
      pearsonR: -0.69,
      spearmanRho: -0.67,
      rSquared: 0.47,
      pValue: '0.002',
      interpretation: 'Korelasi negatif: Sedimen tersuspensi menghambat penetrasi sinar matahari yang dibutuhkan zooxanthellae untuk fotosintesis, serta menutupi polip karang.',
      points: [
        { x: 0.9, y: 3.25 }, { x: 1.0, y: 3.12 }, { x: 1.1, y: 2.98 },
        { x: 1.2, y: 2.85 }, { x: 1.3, y: 2.76 }, { x: 1.4, y: 2.62 },
        { x: 1.5, y: 2.45 }, { x: 1.7, y: 2.31 }, { x: 2.3, y: 1.84 },
        { x: 2.8, y: 1.62 }, { x: 3.1, y: 1.41 }, { x: 1.8, y: 2.15 }
      ]
    }
  };

  const currCorr = correlationSets[selectedVar];

  return (
    <div className="space-y-6">
      {/* Top Banner: Coral Thermal Stress Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Coral Thermal Stress Monitoring (NOAA Methodology)
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Status Tekanan Termal Karang Pulau Tunda</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Perbandingan SST aktual terhadap ambang batas Maximum Monthly Mean (MMM = 28.5°C).
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center justify-between sm:justify-start gap-4 bg-slate-950/80 p-3 rounded-xl border border-amber-500/20">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Degree Heating Weeks:</span>
              <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">3.8 °C-weeks</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Status NOAA:</span>
              <span className="inline-block mt-0.5 text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
                Bleaching Watch
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Temporal Charts & Correlation Scatter Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temporal Time-Series Chart */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Deret Waktu Bulanan</span>
                <h4 className="text-sm font-bold text-white">SST & Klorofil-a Pulau Tunda</h4>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> SST (°C)
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> CHL-a (mg/m³)
                </span>
              </div>
            </div>

            {/* Custom Interactive Tap/Click Monthly Bar Chart */}
            <div className="overflow-x-auto pb-1">
              <div className="h-56 min-w-[300px] mt-5 flex items-end justify-between gap-1 sm:gap-1.5 px-1">
                {monthlyData.map((d) => {
                  const sstHeight = ((d.sst - 27) / 3.2) * 100;
                  const isWarning = d.sst >= 29.0;
                  const isSelected = selectedMonth === d.month;
                  return (
                    <button
                      key={d.month}
                      type="button"
                      onClick={() => setSelectedMonth(d.month)}
                      aria-label={`Bulan ${d.month}: SST ${d.sst} derajat Celsius, Klorofil ${d.chla}`}
                      className="flex-1 min-w-0 flex flex-col items-center gap-1 group focus:outline-none"
                    >
                      <span
                        className={`text-[9px] font-mono transition ${
                          isSelected
                            ? 'text-cyan-300 font-bold opacity-100'
                            : 'text-slate-400 opacity-0 group-hover:opacity-100 sm:opacity-70'
                        }`}
                      >
                        {d.sst}°
                      </span>
                      <div
                        className={`w-full flex items-end justify-center h-44 bg-slate-950 rounded-t-md p-0.5 sm:p-1 transition-all ${
                          isSelected ? 'ring-1 ring-cyan-400/70' : ''
                        }`}
                      >
                        <div
                          style={{ height: `${Math.max(15, sstHeight)}%` }}
                          className={`w-full rounded-t transition-all duration-300 ${
                            isWarning
                              ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/30'
                              : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          isSelected ? 'text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        {d.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {(() => {
            const activeItem = monthlyData.find((m) => m.month === selectedMonth) || monthlyData[4];
            return (
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span>
                  {activeItem.month}: <strong className="text-amber-400">{activeItem.sst}°C</strong> · CHL-a <strong className="text-cyan-400">{activeItem.chla} mg/m³</strong>
                </span>
                <span>DHW: <strong className="text-white">{activeItem.dhw} °C-w</strong></span>
              </div>
            );
          })()}
        </div>

        {/* Scientific Correlation Scatter Plot */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Analisis Statistik Ilmiah</span>
                <h4 className="text-sm font-bold text-white">Korelasi Lingkungan & Ekologi</h4>
              </div>

              {/* Selector */}
              <select
                aria-label="Pilih pasangan variabel korelasi"
                value={selectedVar}
                onChange={(e) => {
                  setSelectedVar(e.target.value as any);
                  setSelectedPointIdx(null);
                }}
                className="min-h-[40px] w-full sm:w-auto bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="sst_coral">SST vs Tutupan Karang</option>
                <option value="chla_fish">CHL-a vs Ikan Karang</option>
                <option value="turb_diversity">Kekeruhan vs Keanekaragaman</option>
              </select>
            </div>

            <p className="text-xs text-slate-300 font-semibold mt-2.5">{currCorr.title}</p>

            {/* Scatter Canvas Simulator */}
            <div className="relative h-48 mt-3 bg-slate-950 rounded-xl p-3 border border-slate-800 overflow-hidden">
              {/* Axes & Grid */}
              <div className="absolute inset-3 border-b border-l border-slate-800" />

              {/* Render Scatter Dots (Interactive Click/Tap) */}
              {currCorr.points.map((pt, i) => {
                const minX = Math.min(...currCorr.points.map(p => p.x));
                const maxX = Math.max(...currCorr.points.map(p => p.x));
                const minY = Math.min(...currCorr.points.map(p => p.y));
                const maxY = Math.max(...currCorr.points.map(p => p.y));

                const posX = ((pt.x - minX) / (maxX - minX)) * 84 + 8;
                const posY = 90 - ((pt.y - minY) / (maxY - minY)) * 80;
                const isActive = selectedPointIdx === i;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedPointIdx(isActive ? null : i)}
                    aria-label={`Titik observasi X=${pt.x}, Y=${pt.y}`}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-all focus:outline-none ${
                      isActive ? 'scale-125' : ''
                    }`}
                    title={`X: ${pt.x}, Y: ${pt.y}`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-orange-400 ring-4 ring-orange-400/30'
                          : 'bg-cyan-400 shadow-md shadow-cyan-400/50 hover:scale-125'
                      }`}
                    />
                  </button>
                );
              })}

              {selectedPointIdx !== null && currCorr.points[selectedPointIdx] && (
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/95 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow">
                  X: {currCorr.points[selectedPointIdx].x} · Y: {currCorr.points[selectedPointIdx].y}
                </div>
              )}

              {/* Trendline Indicator */}
              <div
                style={{
                  top: selectedVar === 'chla_fish' ? '80%' : '18%',
                  transform: selectedVar === 'chla_fish' ? 'rotate(-18deg)' : 'rotate(18deg)',
                  width: '90%'
                }}
                className="pointer-events-none absolute left-[5%] h-0.5 bg-dashed bg-cyan-500/40 border-t border-dashed border-cyan-400"
              />
            </div>

            {/* Coefficients */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">Pearson r</span>
                <span className="text-sm font-bold font-mono text-cyan-300">{currCorr.pearsonR}</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">Spearman ρ</span>
                <span className="text-sm font-bold font-mono text-emerald-300">{currCorr.spearmanRho}</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">Koef. R²</span>
                <span className="text-sm font-bold font-mono text-purple-300">{currCorr.rSquared}</span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-400 italic leading-relaxed">
            * {currCorr.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
}
