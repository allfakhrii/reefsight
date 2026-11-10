'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Sliders,
  Info,
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
  Eye,
  Download,
  Calendar,
  Compass,
  FileCode,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export default function CoralDistributionMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // States matching image5.jpeg
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isSwipeMode, setIsSwipeMode] = useState<boolean>(false);
  const [swipePosition, setSwipePosition] = useState<number>(50); // percentage 0 - 100
  const [activeLayer, setActiveLayer] = useState<{ [key: string]: boolean }>({
    distribusi: true,
    batasPulau: false,
    zonaDangkal: false,
    citraDasar: true
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    const initialCenter: [number, number] = [106.274, -5.813];

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri, Maxar'
          }
        },
        layers: [
          {
            id: 'satellite-basemap',
            type: 'raster',
            source: 'esri-satellite'
          }
        ]
      },
      center: initialCenter,
      zoom: 13.5,
      pitch: 20
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    map.on('load', () => {
      // 1. Add Source 2023 / 2024
      map.addSource('coral-2023-source', {
        type: 'geojson',
        data: '/data/coral_tunda_2023.geojson'
      });

      // 2. Add Source 2020
      map.addSource('coral-2020-source', {
        type: 'geojson',
        data: '/data/coral_tunda_2020.geojson'
      });

      // Layer 2024 Fill (Matching image5.jpeg colors: Red for HC, Orange for SC, Yellow for DC, Purple for Sand, Blue for Water)
      map.addLayer({
        id: 'coral-2023-fill',
        type: 'fill',
        source: 'coral-2023-source',
        paint: {
          'fill-color': [
            'match',
            ['get', 'kondisi'],
            'Sehat', '#EF4444', // Karang Keras (HC) in mockup is red
            'Sedang', '#F97316', // Karang Lunak (SC) is orange
            'Bleaching', '#EAB308', // Karang Mati (DC) is yellow
            'Degradasi', '#A855F7', // Pasir is purple
            '#3B82F6' // Perairan is blue
          ],
          'fill-opacity': 0.75
        }
      });

      // Layer Outline
      map.addLayer({
        id: 'coral-2023-line',
        type: 'line',
        source: 'coral-2023-source',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.2,
          'line-opacity': 0.7
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  const handleDownload = (format: string) => {
    alert(`Mengunduh data spasial tutupan karang Pulau Tunda (${format}). Berkas siap diproses.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner matching image5.jpeg */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
        <div
          className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: `url('/images/image5.jpeg')` }}
        />
        <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
            <span className="w-4 h-0.5 bg-orange-400" />
            Spatial Coral Reef Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Mapping the Coral Reef Distribution of Pulau Tunda
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
            Explore the spatial distribution of coral reef areas through interpreted mapping results, spatial classification, and multi-temporal analysis derived from available ArcGIS datasets.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all">
              <Compass size={14} />
              Explore Coral Map
            </button>
            <button
              onClick={() => setIsSwipeMode(!isSwipeMode)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-all"
            >
              <ArrowRightLeft size={14} />
              Compare Observation Years
            </button>
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-4 flex items-center gap-1.5">
            <Info size={13} className="text-orange-400" />
            Pulau Tunda, Kabupaten Serang, Banten
          </p>
        </div>
      </div>

      {/* Main Grid: WebGIS Map (Left) & Area/Change Analytics (Right) matching image5.jpeg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm h-[540px]">
          {/* Top Map Toolbar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs font-semibold text-slate-800">
              <Calendar size={14} className="text-orange-500" />
              <span>Tahun Pengamatan</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={2024}>2024 (Terkini)</option>
                <option value={2022}>2022</option>
                <option value={2020}>2020 (Baseline)</option>
              </select>
            </div>
          </div>

          {/* Interactive MapLibre canvas */}
          <div ref={mapContainer} className="w-full h-full" />

          {/* Floating Layer & Legend Box matching image5.jpeg */}
          <div className="absolute top-4 right-14 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200 text-xs text-slate-700 w-64 space-y-3">
            <div className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center gap-2">
              <Layers size={14} className="text-blue-600" />
              <span>Layer & Legend</span>
            </div>

            {/* Checkbox Layers */}
            <div className="space-y-1.5 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={activeLayer.distribusi}
                  onChange={(e) =>
                    setActiveLayer({ ...activeLayer, distribusi: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Distribusi Terumbu Karang</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={activeLayer.batasPulau}
                  onChange={(e) =>
                    setActiveLayer({ ...activeLayer, batasPulau: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Batas Pulau Tunda</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={activeLayer.zonaDangkal}
                  onChange={(e) =>
                    setActiveLayer({ ...activeLayer, zonaDangkal: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Zona Perairan Dangkal</span>
              </label>
            </div>

            {/* Classification Color Legend */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
              <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-1">
                Legenda Klasifikasi
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#EF4444] flex-shrink-0" />
                <span>Karang Keras (HC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#F97316] flex-shrink-0" />
                <span>Karang Lunak (SC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#EAB308] flex-shrink-0" />
                <span>Karang Mati (DC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#A855F7] flex-shrink-0" />
                <span>Pasir (Sand)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#3B82F6] flex-shrink-0" />
                <span>Perairan (Water)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donut Chart & Coral Change Analytics */}
        <div className="space-y-5">
          {/* Card: Luas Area per Kelas (2024) matching image5.jpeg */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Luas Area per Kelas (2024)</span>
              <span className="text-[10px] font-semibold text-slate-400">Sentinel-2 10m</span>
            </h3>

            {/* Circular Donut Diagram Display */}
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="3.8"
                  />
                  {/* Segments */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="4"
                    strokeDasharray="38.58 61.42"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#F97316"
                    strokeWidth="4"
                    strokeDasharray="15.81 84.19"
                    strokeDashoffset="-38.58"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#EAB308"
                    strokeWidth="4"
                    strokeDasharray="9.90 90.10"
                    strokeDashoffset="-54.39"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#A855F7"
                    strokeWidth="4"
                    strokeDasharray="28.80 71.20"
                    strokeDashoffset="-64.29"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">
                    Total
                  </span>
                  <span className="text-xs font-black text-slate-900 leading-tight">
                    292,36 ha
                  </span>
                </div>
              </div>

              {/* Class Metric Breakdown */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="text-[11px]">Karang Keras (HC)</span>
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">112,74 ha (38,58%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                    <span className="text-[11px]">Karang Lunak (SC)</span>
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">46,21 ha (15,81%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                    <span className="text-[11px]">Karang Mati (DC)</span>
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">28,95 ha (9,90%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                    <span className="text-[11px]">Pasir (Sand)</span>
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">84,17 ha (28,80%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                    <span className="text-[11px]">Perairan</span>
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">20,29 ha (6,94%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Coral Change Analysis (Perubahan 2020 - 2024) matching image5.jpeg */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" />
                Coral Change Analysis
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold">
                Perubahan 2020 – 2024
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-black text-emerald-700">+6,21 ha</div>
                <div className="text-[10px] font-semibold text-emerald-800">Karang Keras</div>
                <div className="text-[9px] text-emerald-600 font-medium mt-0.5">(+5,83%)</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <div className="text-xs font-black text-rose-700">-4,17 ha</div>
                <div className="text-[10px] font-semibold text-rose-800">Karang Lunak</div>
                <div className="text-[9px] text-rose-600 font-medium mt-0.5">(-8,27%)</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                <div className="text-xs font-black text-amber-700">-2,63 ha</div>
                <div className="text-[10px] font-semibold text-amber-800">Karang Mati</div>
                <div className="text-[9px] text-amber-600 font-medium mt-0.5">(-8,33%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row matching image5.jpeg: Map Swipe, Classification Methodology, Dataset & Metadata, Export Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Map Swipe Slider */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ArrowRightLeft size={14} className="text-blue-600" />
            Map Swipe — Perbandingan
          </h4>
          <div className="relative h-28 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 group">
            <img
              src="/images/image5.jpeg"
              alt="Swipe Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
              <div className="px-3 py-1 rounded-full bg-white/95 text-slate-900 font-bold text-xs shadow-md flex items-center gap-2">
                <span>2020</span>
                <span className="text-orange-500 font-black">⮂</span>
                <span>2024</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Baseline 2020</span>
            <input
              type="range"
              min="0"
              max="100"
              value={swipePosition}
              onChange={(e) => setSwipePosition(Number(e.target.value))}
              className="w-24 accent-orange-500 cursor-pointer"
            />
            <span>Terkini 2024</span>
          </div>
        </div>

        {/* Card 2: Classification Methodology */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5 text-xs text-slate-600">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sliders size={14} className="text-orange-600" />
            Classification Methodology
          </h4>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400">Metode</span>
              <span className="font-semibold text-slate-800">Supervised SVM</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400">Citra Satelit</span>
              <span className="font-semibold text-slate-800">Sentinel-2 MSI (10m)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400">Pra-pengolahan</span>
              <span className="font-semibold text-slate-800">DOS Atmospheric</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Overall Accuracy</span>
              <span className="font-bold text-emerald-600">87,42%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Dataset & Metadata */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5 text-xs text-slate-600">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Info size={14} className="text-purple-600" />
            Dataset & Metadata
          </h4>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400">Sumber Data</span>
              <span className="font-semibold text-slate-800">ESA Copernicus</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400">Tahun Observasi</span>
              <span className="font-semibold text-slate-800">2020, 2022, 2024</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400">Sistem Koordinat</span>
              <span className="font-semibold text-slate-800">WGS 84 / UTM 48S</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tanggal Olah</span>
              <span className="font-semibold text-slate-800">12 Okt 2026</span>
            </div>
          </div>
        </div>

        {/* Card 4: Export Data matching image5.jpeg */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Download size={14} className="text-orange-500" />
            Export Data
          </h4>
          <p className="text-[11px] text-slate-500 leading-snug">
            Unduh hasil klasifikasi, peta, atau tabel luas area untuk keperluan analisis lebih lanjut.
          </p>
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => handleDownload('Shapefile .shp')}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-between transition-colors"
            >
              <span>Shapefile (.shp)</span>
              <Download size={12} className="text-slate-400" />
            </button>
            <button
              onClick={() => handleDownload('GeoJSON .geojson')}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-between transition-colors"
            >
              <span>GeoJSON (.geojson)</span>
              <Download size={12} className="text-slate-400" />
            </button>
            <button
              onClick={() => handleDownload('Tabel Area .csv')}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-between transition-colors"
            >
              <span>Tabel Area (.csv)</span>
              <Download size={12} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
