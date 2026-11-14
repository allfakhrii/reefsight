'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { PROJECTION_EXTENTS } from '@/data/coralExtents';
import {
  Compass,
  Sparkles,
  Calendar,
  TrendingUp,
  Layers,
  Check
} from 'lucide-react';

interface CoralProjectionMapProps {
  period: 5 | 10 | 15;
  onSelectPeriod?: (period: 5 | 10 | 15) => void;
  scenario?: 'baseline' | 'high_pressure' | 'recovery';
  className?: string;
}

interface HoveredFeatureInfo {
  id: string;
  habitatType: string;
  zone: string;
  areaHa: number;
  prob: number;
  color: string;
}

const STATS_MAP: Record<5 | 10 | 15, {
  year: number;
  hcHa: number;
  hcPct: number;
  scHa: number;
  scPct: number;
  dcHa: number;
  dcPct: number;
  totalHa: number;
  deltaHc: string;
  deltaDc: string;
}> = {
  5: {
    year: 2031,
    hcHa: 115.42,
    hcPct: 39.51,
    scHa: 43.88,
    scPct: 15.03,
    dcHa: 24.71,
    dcPct: 8.46,
    totalHa: 184.01,
    deltaHc: '+2.68 ha (+2.38%)',
    deltaDc: '-3.12 ha (-11.21%)'
  },
  10: {
    year: 2036,
    hcHa: 118.10,
    hcPct: 40.39,
    scHa: 42.15,
    scPct: 14.42,
    dcHa: 22.30,
    dcPct: 7.63,
    totalHa: 182.55,
    deltaHc: '+5.36 ha (+4.75%)',
    deltaDc: '-5.53 ha (-19.87%)'
  },
  15: {
    year: 2041,
    hcHa: 121.05,
    hcPct: 41.40,
    scHa: 40.70,
    scPct: 13.92,
    dcHa: 20.18,
    dcPct: 6.90,
    totalHa: 181.93,
    deltaHc: '+8.31 ha (+7.37%)',
    deltaDc: '-7.65 ha (-27.49%)'
  }
};

export default function CoralProjectionMap({
  period = 5,
  onSelectPeriod,
  scenario = 'baseline',
  className = ''
}: CoralProjectionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);

  // Layer groups
  const extentGroupRef = useRef<any>(null);
  const habitatGroupRef = useRef<any>(null);
  const beaconsGroupRef = useRef<any>(null);

  const [hoveredFeature, setHoveredFeature] = useState<HoveredFeatureInfo | null>(null);
  const [showRedExtent, setShowRedExtent] = useState<boolean>(true);
  const [isLeafletReady, setIsLeafletReady] = useState<boolean>(false);

  const currentStats = STATS_MAP[period] || STATS_MAP[5];

  // Helper to build custom animated HTML Beacon Marker
  const createBeaconMarker = (L: any, lat: number, lng: number, label: string, areaHa: number) => {
    const icon = L.divIcon({
      className: 'bg-transparent border-none',
      iconSize: [220, 36],
      iconAnchor: [110, 18],
      html: `
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/90 border-2 border-red-500 shadow-2xl backdrop-blur-md text-white transition-all transform hover:scale-110">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span class="text-[11px] font-black tracking-tight text-red-100 whitespace-nowrap">${label}: ${areaHa.toFixed(2)} ha</span>
        </div>
      `
    });
    return L.marker([lat, lng], { icon });
  };

  // 1. Initialize Leaflet Map (Safe dynamic import for SSR)
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainer.current || mapRef.current || typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainer.current) return;
      leafletModuleRef.current = L;

      // Pulau Tunda geographical coordinates: Lat -5.813, Lng 106.274
      const center: [number, number] = [-5.813, 106.274];

      const map = L.map(mapContainer.current, {
        center,
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Esri World Imagery Satellite Tiles
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution: '© Esri, Maxar, Earthstar Geographics'
        }
      ).addTo(map);

      // Add Zoom Control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Initialize Layer Groups
      const extentGroup = L.layerGroup().addTo(map);
      const habitatGroup = L.layerGroup().addTo(map);
      const beaconsGroup = L.layerGroup().addTo(map);

      extentGroupRef.current = extentGroup;
      habitatGroupRef.current = habitatGroup;
      beaconsGroupRef.current = beaconsGroup;
      mapRef.current = map;

      setIsLeafletReady(true);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Render Red Spread Extent Envelope and Beacons when period or showRedExtent changes
  useEffect(() => {
    if (!isLeafletReady || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const extentGroup = extentGroupRef.current;
    const beaconsGroup = beaconsGroupRef.current;
    if (!extentGroup || !beaconsGroup) return;

    extentGroup.clearLayers();
    beaconsGroup.clearLayers();

    if (!showRedExtent) return;

    const extGeo = PROJECTION_EXTENTS[period] || PROJECTION_EXTENTS[5];
    const stats = STATS_MAP[period] || STATS_MAP[5];

    if (extGeo) {
      // Outer Glowing Line (Soft halo wash)
      const glowLayer = L.geoJSON(extGeo, {
        style: {
          color: '#f87171',
          weight: 12,
          opacity: 0.55,
          fillColor: '#ef4444',
          fillOpacity: 0.32,
          lineCap: 'round',
          lineJoin: 'round'
        }
      });
      extentGroup.addLayer(glowLayer);

      // Inner Core Crimson Boundary Line with dashed styling
      const lineLayer = L.geoJSON(extGeo, {
        style: {
          color: '#dc2626',
          weight: 4,
          dashArray: '8, 5',
          opacity: 1.0,
          fill: false,
          lineCap: 'round',
          lineJoin: 'round'
        }
      });
      extentGroup.addLayer(lineLayer);
    }

    // 4 Perimeter Radar Beacons (Pulau Tunda perimeter)
    const beaconCoords: [number, number, string][] = [
      [-5.798, 106.275, 'Batas Terumbu Utara'],
      [-5.813, 106.310, 'Tubir Karang Timur'],
      [-5.824, 106.275, 'Paparan Karang Selatan'],
      [-5.812, 106.244, 'Karang Tepi Barat']
    ];

    beaconCoords.forEach(([lat, lng, label]) => {
      const beaconMarker = createBeaconMarker(L, lat, lng, label, stats.totalHa);
      beaconsGroup.addLayer(beaconMarker);
    });
  }, [isLeafletReady, period, showRedExtent]);

  // 3. Fetch and Render Projected Coral Habitat Polygons
  useEffect(() => {
    if (!isLeafletReady || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const habitatGroup = habitatGroupRef.current;
    if (!habitatGroup) return;

    habitatGroup.clearLayers();

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    fetch(`${origin}/data/gis/projection_${period}yr.geojson`)
      .then((res) => (res.ok ? res.json() : null))
      .then((geo) => {
        if (!geo) return;

        const habitatLayer = L.geoJSON(geo, {
          style: (feature: any) => {
            const code = feature?.properties?.class_code;
            let fillColor = '#10b981';
            let strokeColor = '#059669';

            if (code === 1) {
              fillColor = '#10b981'; // Hard Coral (Emerald)
              strokeColor = '#059669';
            } else if (code === 2) {
              fillColor = '#06b6d4'; // Soft Coral (Cyan)
              strokeColor = '#0891b2';
            } else if (code === 3) {
              fillColor = '#f43f5e'; // Dead Coral (Rose / Red)
              strokeColor = '#e11d48';
            } else if (code === 4) {
              fillColor = '#f59e0b'; // Sand & Rubble (Amber)
              strokeColor = '#d97706';
            }

            return {
              fillColor,
              fillOpacity: 0.78,
              color: strokeColor,
              weight: 1.5,
              opacity: 0.95
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const p = feature?.properties || {};
            layer.on({
              mouseover: (e: any) => {
                const target = e.target;
                target.setStyle({
                  weight: 3,
                  color: '#ffffff',
                  fillOpacity: 0.95
                });
                target.bringToFront();

                setHoveredFeature({
                  id: p.id || 'N/A',
                  habitatType: p.habitat_type || 'Hard Coral',
                  zone: p.zone || 'Pulau Tunda',
                  areaHa: p.area_ha || 0,
                  prob: p.transition_prob || 0.85,
                  color: p.color || '#10b981'
                });
              },
              mouseout: (e: any) => {
                habitatLayer.resetStyle(e.target);
                setHoveredFeature(null);
              }
            });
          }
        });

        habitatGroup.addLayer(habitatLayer);
      })
      .catch((err) => console.warn('Could not load projection geojson in Leaflet:', err));
  }, [isLeafletReady, period]);

  // Handle Reset View
  const handleResetView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([-5.813, 106.274], 14, { duration: 1 });
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md select-none ${className}`}>
      {/* Leaflet Map Canvas */}
      <div ref={mapContainer} className="w-full h-[430px] sm:h-[490px] lg:h-[530px] z-0" />

      {/* Floating Header Badges */}
      <div className="absolute top-3 left-3 right-14 sm:right-auto flex flex-wrap items-center gap-2 pointer-events-auto z-[400]">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white text-xs font-bold shadow-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>Proyeksi Sebaran Karang: +{period} Tahun ({currentStats.year})</span>
        </div>

        <div className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-blue-950/80 backdrop-blur-md border border-blue-500/40 text-blue-200 text-xs font-semibold shadow-lg items-center gap-1.5">
          <Sparkles size={13} className="text-blue-400" />
          <span>Cellular Automata (CA) · R² = 0.87 · Leaflet Engine</span>
        </div>
      </div>

      {/* Interactive Quick Period Selector & Red Extent Toggle Directly On Map */}
      <div className="absolute top-14 left-3 flex flex-wrap items-center gap-1.5 pointer-events-auto z-[400]">
        {[5, 10, 15].map((yr) => (
          <button
            key={yr}
            type="button"
            onClick={() => onSelectPeriod?.(yr as 5 | 10 | 15)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md ${
              period === yr
                ? 'bg-orange-500 text-white border border-orange-400 scale-105 ring-2 ring-orange-400/50'
                : 'bg-slate-900/85 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Calendar size={13} className={period === yr ? 'text-white' : 'text-orange-400'} />
            <span>+{yr} Tahun</span>
          </button>
        ))}

        {/* Toggle Red Spread Perimeter */}
        <button
          type="button"
          onClick={() => setShowRedExtent(!showRedExtent)}
          aria-pressed={showRedExtent}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md border ${
            showRedExtent
              ? 'bg-red-950/90 text-red-200 border-red-500 ring-2 ring-red-500/40'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-white'
          }`}
          title="Tampilkan / Sembunyikan Garis Merah Batas Luas Sebaran Terumbu Karang"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${showRedExtent ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
          <span>Batas Sebaran (Merah)</span>
        </button>
      </div>

      {/* Main Floating Telemetry Stats Card */}
      <div className="absolute bottom-3 left-3 max-w-[280px] sm:max-w-xs w-full bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl border border-slate-700/70 shadow-2xl z-[400] pointer-events-auto space-y-2.5 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
          <div className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
            <TrendingUp size={13} />
            <span>Luas Sebaran (+{period} Thn):</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            Tahun {currentStats.year}
          </span>
        </div>

        {/* Red Spread Envelope Summary Badge */}
        <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-red-200 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <span>Total Envelope Sebaran:</span>
          </div>
          <span className="text-xs font-mono font-black text-red-300">
            {currentStats.totalHa.toFixed(2)} ha
          </span>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
            <span className="flex items-center gap-1.5 font-medium text-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              HC (Hard Coral)
            </span>
            <span className="font-mono font-bold text-emerald-300">
              {currentStats.hcHa.toFixed(2)} ha ({currentStats.hcPct.toFixed(2)}%)
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
            <span className="flex items-center gap-1.5 font-medium text-cyan-200">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
              SC (Soft Coral)
            </span>
            <span className="font-mono font-bold text-cyan-300">
              {currentStats.scHa.toFixed(2)} ha ({currentStats.scPct.toFixed(2)}%)
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30">
            <span className="flex items-center gap-1.5 font-medium text-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
              DC (Dead Coral)
            </span>
            <span className="font-mono font-bold text-rose-300">
              {currentStats.dcHa.toFixed(2)} ha ({currentStats.dcPct.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Delta Net vs Baseline */}
        <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Pertumbuhan HC:</span>
          <span className="font-bold text-emerald-400">{currentStats.deltaHc}</span>
        </div>
      </div>

      {/* Hovered Feature Tooltip */}
      {hoveredFeature && (
        <div className="absolute top-3 right-14 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-700 shadow-xl z-[400] pointer-events-none text-xs space-y-1 animate-fadeIn max-w-[220px]">
          <div className="flex items-center gap-1.5 font-bold" style={{ color: hoveredFeature.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredFeature.color }} />
            <span>{hoveredFeature.habitatType}</span>
          </div>
          <p className="text-[11px] text-slate-300">{hoveredFeature.zone}</p>
          <div className="pt-1 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
            <span>Estimasi Luas:</span>
            <span className="font-mono font-bold text-white">{hoveredFeature.areaHa} ha</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Probabilitas CA:</span>
            <span className="font-mono font-bold text-emerald-400">{(hoveredFeature.prob * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Floating Controls (Reset view) */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-[400] pointer-events-auto">
        <button
          type="button"
          onClick={handleResetView}
          title="Fokus Ulang ke Pulau Tunda"
          aria-label="Fokus Ulang Peta"
          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Compass size={18} className="text-orange-400" />
        </button>
      </div>
    </div>
  );
}
