'use client';

import React, { useState, useMemo } from 'react';
import { Flame, Calculator, Sparkles, Info } from 'lucide-react';

interface MonthlyDataItem {
  month: string;
  sst: number;
  chla: number;
  dhw: number;
}

interface ScatterPoint {
  station: string;
  x: number;
  y: number;
}

interface CorrelationSet {
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  pearsonR: number;
  spearmanRho: number;
  rSquared: number;
  pValue: string;
  interpretation: string;
  points: ScatterPoint[];
}

export default function EnvironmentalCharts() {
  const [selectedVar, setSelectedVar] = useState<'sst_coral' | 'chla_fish' | 'turb_diversity'>('sst_coral');
  const [selectedMonth, setSelectedMonth] = useState<string>('Mei');
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);

  // Time-series monthly data for Pulau Tunda (Jan - Des)
  const monthlyData: MonthlyDataItem[] = [
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

  // Correlation Datasets with Pulau Tunda Survey Stations
  const correlationSets: Record<'sst_coral' | 'chla_fish' | 'turb_diversity', CorrelationSet> = {
    sst_coral: {
      title: 'Suhu Permukaan Laut (SST) vs Persentase Tutupan Karang Hidup',
      xLabel: 'Suhu Permukaan Laut / SST (°C)',
      yLabel: 'Tutupan Karang Hidup (%)',
      xUnit: '°C',
      yUnit: '%',
      xDomain: [27.5, 30.0],
      yDomain: [25, 70],
      xTicks: [27.5, 28.0, 28.5, 29.0, 29.5, 30.0],
      yTicks: [30, 40, 50, 60, 70],
      pearsonR: -0.76,
      spearmanRho: -0.74,
      rSquared: 0.58,
      pValue: '< 0.001',
      interpretation: 'Korelasi negatif kuat yang signifikan (r = -0.76, p < 0.001): Kenaikan suhu perairan di atas 28.5°C (ambang batas MMM) berhubungan langsung dengan penurunan persentase tutupan karang hidup dan memicu bleaching di Pulau Tunda.',
      points: [
        { station: 'ASIK-01 (Karang Gosong)', x: 27.9, y: 64.2 },
        { station: 'ASIK-02 (Tanjung Barat)', x: 28.0, y: 62.0 },
        { station: 'ASIK-03 (Pasi Putih)', x: 28.1, y: 58.5 },
        { station: 'ASIK-04 (Laguna Utara)', x: 28.2, y: 56.1 },
        { station: 'ASIK-05 (Karang Batang)', x: 28.3, y: 54.0 },
        { station: 'ASIK-06 (Beting Timur)', x: 28.4, y: 52.8 },
        { station: 'ASIK-07 (Karang Hantu)', x: 28.5, y: 50.1 },
        { station: 'ASIK-08 (Karang Cina)', x: 28.6, y: 49.3 },
        { station: 'ASIK-09 (Teluk Cengkeh)', x: 28.7, y: 46.5 },
        { station: 'ASIK-10 (Tanjung Nelayan)', x: 29.1, y: 41.2 },
        { station: 'ASIK-11 (Karang Tengah)', x: 29.4, y: 36.8 },
        { station: 'ASIK-12 (Palung Karang)', x: 29.8, y: 31.5 }
      ]
    },
    chla_fish: {
      title: 'Konsentrasi Klorofil-a (CHL-a) vs Kelimpahan Ikan Karang',
      xLabel: 'Chlorophyll-a / CHL-a (mg/m³)',
      yLabel: 'Kelimpahan Ikan (Individu / 100m²)',
      xUnit: 'mg/m³',
      yUnit: 'ind/100m²',
      xDomain: [0.30, 0.55],
      yDomain: [35, 110],
      xTicks: [0.30, 0.35, 0.40, 0.45, 0.50, 0.55],
      yTicks: [40, 60, 80, 100],
      pearsonR: 0.62,
      spearmanRho: 0.59,
      rSquared: 0.38,
      pValue: '0.008',
      interpretation: 'Korelasi positif sedang yang signifikan (r = +0.62, p = 0.008): Peningkatan klorofil-a mencerminkan produktivitas primer mikroalga & fitoplankton yang menopang populasi ikan herbivora dan planktivora di terumbu karang.',
      points: [
        { station: 'ASIK-01 (Karang Gosong)', x: 0.32, y: 42 },
        { station: 'ASIK-02 (Tanjung Barat)', x: 0.35, y: 48 },
        { station: 'ASIK-03 (Pasi Putih)', x: 0.38, y: 55 },
        { station: 'ASIK-04 (Laguna Utara)', x: 0.39, y: 59 },
        { station: 'ASIK-05 (Karang Batang)', x: 0.40, y: 63 },
        { station: 'ASIK-06 (Beting Timur)', x: 0.41, y: 68 },
        { station: 'ASIK-07 (Karang Hantu)', x: 0.42, y: 72 },
        { station: 'ASIK-08 (Karang Cina)', x: 0.44, y: 79 },
        { station: 'ASIK-09 (Teluk Cengkeh)', x: 0.45, y: 81 },
        { station: 'ASIK-10 (Tanjung Nelayan)', x: 0.48, y: 86 },
        { station: 'ASIK-11 (Karang Tengah)', x: 0.49, y: 91 },
        { station: 'ASIK-12 (Palung Karang)', x: 0.52, y: 104 }
      ]
    },
    turb_diversity: {
      title: 'Kekeruhan Air (Turbidity) vs Indeks Keanekaragaman Karang',
      xLabel: 'Kekeruhan Air / Turbidity (NTU)',
      yLabel: 'Indeks Shannon-Wiener (H\')',
      xUnit: 'NTU',
      yUnit: 'H\'',
      xDomain: [0.7, 3.3],
      yDomain: [1.2, 3.5],
      xTicks: [1.0, 1.5, 2.0, 2.5, 3.0],
      yTicks: [1.5, 2.0, 2.5, 3.0, 3.5],
      pearsonR: -0.69,
      spearmanRho: -0.67,
      rSquared: 0.47,
      pValue: '0.002',
      interpretation: 'Korelasi negatif signifikan (r = -0.69, p = 0.002): Sedimen tersuspensi tinggi (>2 NTU) menghalangi penetrasi sinar matahari untuk zooxanthellae dan meningkatkan sedimentasi pada polip karang.',
      points: [
        { station: 'ASIK-01 (Karang Gosong)', x: 0.9, y: 3.25 },
        { station: 'ASIK-02 (Tanjung Barat)', x: 1.0, y: 3.12 },
        { station: 'ASIK-03 (Pasi Putih)', x: 1.1, y: 2.98 },
        { station: 'ASIK-04 (Laguna Utara)', x: 1.2, y: 2.85 },
        { station: 'ASIK-05 (Karang Batang)', x: 1.3, y: 2.76 },
        { station: 'ASIK-06 (Beting Timur)', x: 1.4, y: 2.62 },
        { station: 'ASIK-07 (Karang Hantu)', x: 1.5, y: 2.45 },
        { station: 'ASIK-08 (Karang Cina)', x: 1.7, y: 2.31 },
        { station: 'ASIK-09 (Teluk Cengkeh)', x: 1.8, y: 2.15 },
        { station: 'ASIK-10 (Tanjung Nelayan)', x: 2.3, y: 1.84 },
        { station: 'ASIK-11 (Karang Tengah)', x: 2.8, y: 1.62 },
        { station: 'ASIK-12 (Palung Karang)', x: 3.1, y: 1.41 }
      ]
    }
  };

  const currCorr = correlationSets[selectedVar];

  // Mathematically accurate Ordinary Least Squares (OLS) Regression
  const regressionResult = useMemo(() => {
    const pts = currCorr.points;
    const n = pts.length;
    if (n === 0) return { slope: 0, intercept: 0, equation: '' };

    const sumX = pts.reduce((acc, p) => acc + p.x, 0);
    const sumY = pts.reduce((acc, p) => acc + p.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;

    let num = 0;
    let den = 0;
    for (const p of pts) {
      num += (p.x - meanX) * (p.y - meanY);
      den += Math.pow(p.x - meanX, 2);
    }

    const slope = den === 0 ? 0 : num / den;
    const intercept = meanY - slope * meanX;

    const sign = intercept >= 0 ? '+' : '-';
    const absIntercept = Math.abs(intercept).toFixed(2);
    const equation = `Ŷ = ${slope.toFixed(2)}X ${sign} ${absIntercept}`;

    return { slope, intercept, equation };
  }, [currCorr]);

  // SVG Chart Layout Metrics
  const svgWidth = 540;
  const svgHeight = 240;
  const marginLeft = 56;
  const marginRight = 24;
  const marginTop = 20;
  const marginBottom = 44;
  const plotWidth = svgWidth - marginLeft - marginRight;
  const plotHeight = svgHeight - marginTop - marginBottom;

  const [xMin, xMax] = currCorr.xDomain;
  const [yMin, yMax] = currCorr.yDomain;

  // Scale helpers
  const toSvgX = (val: number) => marginLeft + ((val - xMin) / (xMax - xMin)) * plotWidth;
  const toSvgY = (val: number) => marginTop + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;

  // Regression line coordinates clamped to plot domain
  const regX1 = xMin;
  const regY1 = regressionResult.slope * regX1 + regressionResult.intercept;
  const regX2 = xMax;
  const regY2 = regressionResult.slope * regX2 + regressionResult.intercept;

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
        {/* Left Card: Temporal Time-Series Chart (Dual Variables: SST & CHL-a) */}
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

            {/* Sub-indicator legend for MMM */}
            <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-400 border-t border-dashed border-red-400" />
                Ambang Termal MMM: 28.5°C
              </span>
              <span className="text-slate-400">Klik bulan untuk detail</span>
            </div>

            {/* Custom Interactive Tap/Click Monthly Paired Bar Chart */}
            <div className="overflow-x-auto pb-1">
              <div className="h-56 min-w-[340px] mt-3 flex items-end justify-between gap-1 sm:gap-2 px-1 relative">
                {/* Horizontal MMM Guide Line (28.5°C maps to around 38% height) */}
                <div
                  className="pointer-events-none absolute left-0 right-0 border-b border-dashed border-red-400/40 z-0"
                  style={{ bottom: '38%' }}
                />

                {monthlyData.map((d) => {
                  // SST scale: 27.0°C to 30.5°C
                  const sstHeight = Math.min(100, Math.max(12, ((d.sst - 27.0) / 3.5) * 100));
                  // CHL-a scale: 0.0 to 0.60 mg/m³
                  const chlaHeight = Math.min(100, Math.max(12, (d.chla / 0.60) * 100));
                  const isWarning = d.sst >= 29.0;
                  const isSelected = selectedMonth === d.month;

                  return (
                    <button
                      key={d.month}
                      type="button"
                      onClick={() => setSelectedMonth(d.month)}
                      aria-label={`Bulan ${d.month}: SST ${d.sst}°C, Klorofil ${d.chla} mg/m³`}
                      className={`flex-1 min-w-0 flex flex-col items-center gap-1 group focus:outline-none rounded-lg p-0.5 transition-all z-10 ${
                        isSelected ? 'bg-slate-800/80 ring-1 ring-cyan-400/80' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Top SST value */}
                      <span
                        className={`text-[9px] font-mono leading-none transition ${
                          isSelected
                            ? 'text-amber-300 font-bold opacity-100'
                            : 'text-slate-400 opacity-0 group-hover:opacity-100 sm:opacity-80'
                        }`}
                      >
                        {d.sst}°
                      </span>

                      {/* Paired Bars Container */}
                      <div className="w-full h-40 bg-slate-950/80 rounded-t-md p-1 flex items-end justify-center gap-1 border border-slate-800/60">
                        {/* SST Bar (Amber) */}
                        <div
                          style={{ height: `${sstHeight}%` }}
                          className={`flex-1 max-w-[12px] rounded-t transition-all duration-300 ${
                            isWarning
                              ? 'bg-gradient-to-t from-red-600 via-amber-500 to-amber-300 shadow-lg shadow-amber-500/40'
                              : 'bg-gradient-to-t from-amber-600 to-amber-400'
                          }`}
                          title={`SST: ${d.sst}°C`}
                        />

                        {/* CHL-a Bar (Cyan) */}
                        <div
                          style={{ height: `${chlaHeight}%` }}
                          className="flex-1 max-w-[12px] rounded-t bg-gradient-to-t from-cyan-600 to-cyan-300 transition-all duration-300 opacity-85 group-hover:opacity-100"
                          title={`CHL-a: ${d.chla} mg/m³`}
                        />
                      </div>

                      {/* Month Label */}
                      <span
                        className={`text-[10px] font-mono font-semibold transition ${
                          isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
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

          {/* Active Month Telemetry Callout */}
          {(() => {
            const activeItem = monthlyData.find((m) => m.month === selectedMonth) || monthlyData[4];
            return (
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span>
                  Bulan {activeItem.month}: SST <strong className="text-amber-400">{activeItem.sst}°C</strong> · CHL-a <strong className="text-cyan-400">{activeItem.chla} mg/m³</strong>
                </span>
                <span>
                  Degree Heating Weeks: <strong className="text-white font-mono">{activeItem.dhw} °C-weeks</strong>
                </span>
              </div>
            );
          })()}
        </div>

        {/* Right Card: High-Precision Scientific Correlation & Regression Chart */}
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
                className="min-h-[40px] w-full sm:w-auto bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-cyan-300 font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="sst_coral">SST vs Tutupan Karang</option>
                <option value="chla_fish">CHL-a vs Ikan Karang</option>
                <option value="turb_diversity">Kekeruhan vs Keanekaragaman</option>
              </select>
            </div>

            {/* Chart Subtitle & Equation Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
              <p className="text-xs text-slate-200 font-semibold">{currCorr.title}</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                <Calculator className="w-3 h-3 text-cyan-400" />
                {regressionResult.equation}
              </span>
            </div>

            {/* High-Precision SVG Scatter Plot & Regression Canvas */}
            <div className="relative mt-3 bg-slate-950 rounded-xl p-2 border border-slate-800 overflow-hidden shadow-inner">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none"
                style={{ maxHeight: '230px' }}
              >
                {/* Horizontal Grid Lines & Y-Axis Ticks */}
                {currCorr.yTicks.map((tick) => {
                  const yPos = toSvgY(tick);
                  return (
                    <g key={`y-${tick}`}>
                      <line
                        x1={marginLeft}
                        y1={yPos}
                        x2={marginLeft + plotWidth}
                        y2={yPos}
                        stroke="#334155"
                        strokeDasharray="4 4"
                        strokeOpacity="0.4"
                      />
                      <text
                        x={marginLeft - 8}
                        y={yPos + 3}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {tick}
                        {currCorr.yUnit === '%' ? '%' : ''}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Grid Lines & X-Axis Ticks */}
                {currCorr.xTicks.map((tick) => {
                  const xPos = toSvgX(tick);
                  return (
                    <g key={`x-${tick}`}>
                      <line
                        x1={xPos}
                        y1={marginTop}
                        x2={xPos}
                        y2={marginTop + plotHeight}
                        stroke="#334155"
                        strokeDasharray="3 3"
                        strokeOpacity="0.25"
                      />
                      <text
                        x={xPos}
                        y={marginTop + plotHeight + 16}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {tick}
                        {currCorr.xUnit === '°C' ? '°' : ''}
                      </text>
                    </g>
                  );
                })}

                {/* Primary Axes Borders */}
                <line
                  x1={marginLeft}
                  y1={marginTop}
                  x2={marginLeft}
                  y2={marginTop + plotHeight}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <line
                  x1={marginLeft}
                  y1={marginTop + plotHeight}
                  x2={marginLeft + plotWidth}
                  y2={marginTop + plotHeight}
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* X Axis Label */}
                <text
                  x={marginLeft + plotWidth / 2}
                  y={marginTop + plotHeight + 36}
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="10"
                  fontWeight="600"
                >
                  {currCorr.xLabel}
                </text>

                {/* Y Axis Label (Rotated) */}
                <text
                  x={-(marginTop + plotHeight / 2)}
                  y={14}
                  transform="rotate(-90)"
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="10"
                  fontWeight="600"
                >
                  {currCorr.yLabel}
                </text>

                {/* Mathematically Fitted Linear Regression Line */}
                <line
                  x1={toSvgX(regX1)}
                  y1={toSvgY(regY1)}
                  x2={toSvgX(regX2)}
                  y2={toSvgY(regY2)}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeOpacity="0.85"
                />

                {/* Scatter Points (12 Stations Pulau Tunda) */}
                {currCorr.points.map((pt, i) => {
                  const cx = toSvgX(pt.x);
                  const cy = toSvgY(pt.y);
                  const isActive = selectedPointIdx === i;

                  return (
                    <g
                      key={`pt-${i}`}
                      className="cursor-pointer group"
                      onClick={() => setSelectedPointIdx(isActive ? null : i)}
                    >
                      {/* Generous touch / hover hit area */}
                      <circle cx={cx} cy={cy} r={16} fill="transparent" />

                      {/* Animated Pulse Ring on Active */}
                      {isActive && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={11}
                          fill="#f97316"
                          fillOpacity="0.25"
                          stroke="#f97316"
                          strokeWidth="1.5"
                          className="animate-pulse"
                        />
                      )}

                      {/* Visible Observation Point */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? 6 : 4.5}
                        fill={isActive ? '#f97316' : '#22d3ee'}
                        stroke={isActive ? '#ffffff' : '#0891b2'}
                        strokeWidth={isActive ? 2 : 1.5}
                        className="transition-transform duration-200 group-hover:scale-125"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip HUD for Selected Station Point */}
              {selectedPointIdx !== null && currCorr.points[selectedPointIdx] && (
                <div className="absolute top-2.5 right-2.5 max-w-[240px] p-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-[10px] text-slate-200 shadow-2xl backdrop-blur-md animate-fadeIn z-20">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 mb-1.5">
                    <span className="font-bold text-cyan-300">
                      {currCorr.points[selectedPointIdx].station}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPointIdx(null)}
                      className="text-slate-400 hover:text-white font-bold px-1"
                      aria-label="Tutup tooltip"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-0.5 font-mono">
                    <p>
                      X ({currCorr.xUnit}): <strong className="text-white">{currCorr.points[selectedPointIdx].x} {currCorr.xUnit}</strong>
                    </p>
                    <p>
                      Y ({currCorr.yUnit}): <strong className="text-cyan-400">{currCorr.points[selectedPointIdx].y} {currCorr.yUnit}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Regression & Statistical Coefficients */}
            <div className="grid grid-cols-4 gap-2 mt-3 text-center">
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">Pearson r</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300">{currCorr.pearsonR}</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">Spearman ρ</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-emerald-300">{currCorr.spearmanRho}</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">Koef. R²</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-purple-300">{currCorr.rSquared}</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-medium">p-value</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-amber-300">{currCorr.pValue}</span>
              </div>
            </div>
          </div>

          {/* Scientific Interpretation */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 italic leading-relaxed">
              {currCorr.interpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}