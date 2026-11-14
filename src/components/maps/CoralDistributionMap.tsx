'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { CORAL_LYZENGA_EXTENTS } from '@/data/coralExtents';
import {
  Layers,
  TrendingUp,
  ArrowRightLeft,
  Download,
  Calendar,
  Compass,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Thermometer,
  Waves,
  Eye,
  Sparkles,
} from 'lucide-react';

export type GisLayerType = 'lyzenga' | 'sst' | 'chl';
export type GisYear = 2022 | 2023 | 2024 | 2025 | 2026;

interface LayerConfig {
  id: GisLayerType;
  title: string;
  badge: string;
  unit: string;
  description: string;
  resolution: string;
  source: string;
}

const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: 'lyzenga',
    title: 'Lyzenga Bentik & Tutupan Karang',
    badge: 'Habitat Benthic Model',
    unit: 'Hektar (ha)',
    description:
      'Klasifikasi dasar perairan terumbu karang menggunakan algoritma koreksi kolom air Lyzenga pada citra Sentinel-2/Landsat-8.',
    resolution: '10 m / piksel',
    source: 'Sentinel-2 Level-2A (ESA) & Algoritma Lyzenga',
  },
  {
    id: 'sst',
    title: 'Sea Surface Temperature (SST)',
    badge: 'Ocean Thermal Metric',
    unit: '°C (Derajat Celcius)',
    description:
      'Distribusi spasial anomali suhu permukaan laut harian perairan Pulau Tunda yang mempengaruhi bleaching karang.',
    resolution: '1 km / piksel',
    source: 'NOAA Coral Reef Watch (CRW) Daily 5km SST Blended',
  },
  {
    id: 'chl',
    title: 'Klorofil-a (CHL & Fitoplankton)',
    badge: 'Biochemical Metric',
    unit: 'mg/m³',
    description:
      'Konsentrasi klorofil-a sebagai indikator biomassa fitoplankton, produktivitas primer laut, dan kejernihan air.',
    resolution: '300 m / piksel',
    source: 'MODIS-Aqua / Sentinel-3 OLCI Ocean Color',
  },
];

const ANNUAL_STATS: Record<
  GisLayerType,
  Record<
    GisYear,
    {
      primaryValue: string;
      primaryUnit: string;
      secondaryLabel: string;
      secondaryValue: string;
      trendNote: string;
      classBreakdown: { label: string; pct: number; color: string }[];
    }
  >
> = {
  lyzenga: {
    2022: {
      primaryValue: '1.877,85',
      primaryUnit: 'ha',
      secondaryLabel: 'Tutupan Karang Hidup',
      secondaryValue: '48,2%',
      trendNote: 'Kondisi stabil pra-gelombang panas laut.',
      classBreakdown: [
        { label: 'Substrat Terumbu & Karang Keras', pct: 48.2, color: '#10B981' },
        { label: 'Pasir & Laguna Dangkal', pct: 51.8, color: '#0EA5E9' },
      ],
    },
    2023: {
      primaryValue: '1.833,92',
      primaryUnit: 'ha',
      secondaryLabel: 'Tutupan Karang Hidup',
      secondaryValue: '46,1%',
      trendNote: 'Penurunan marginal akibat anomali termal lokal.',
      classBreakdown: [
        { label: 'Substrat Terumbu & Karang Keras', pct: 46.1, color: '#10B981' },
        { label: 'Pasir & Laguna Dangkal', pct: 53.9, color: '#0EA5E9' },
      ],
    },
    2024: {
      primaryValue: '581,23',
      primaryUnit: 'ha',
      secondaryLabel: 'Tutupan Terumbu Zona Inti',
      secondaryValue: '52,4%',
      trendNote: 'Fokus pemetaan zona konservasi inti (marine protected zone).',
      classBreakdown: [
        { label: 'Zona Inti Karang Sehat', pct: 52.4, color: '#10B981' },
        { label: 'Substrat Transisi & Runtuhan', pct: 47.6, color: '#0EA5E9' },
      ],
    },
    2025: {
      primaryValue: '581,23',
      primaryUnit: 'ha',
      secondaryLabel: 'Tutupan Terumbu Zona Inti',
      secondaryValue: '54,1%',
      trendNote: 'Tren pemulihan terumbu di stasiun pengamatan barat laut.',
      classBreakdown: [
        { label: 'Zona Inti Karang Sehat', pct: 54.1, color: '#10B981' },
        { label: 'Substrat Transisi & Runtuhan', pct: 45.9, color: '#0EA5E9' },
      ],
    },
    2026: {
      primaryValue: '875,61',
      primaryUnit: 'ha',
      secondaryLabel: 'Tutupan Terumbu Re-analisis',
      secondaryValue: '59,8%',
      trendNote: 'Ekspansi restorasi substrat buatan dan rekrutmen karang muda.',
      classBreakdown: [
        { label: 'Substrat Terumbu & Karang Keras', pct: 59.8, color: '#10B981' },
        { label: 'Pasir & Laguna Dangkal', pct: 40.2, color: '#0EA5E9' },
      ],
    },
  },
  sst: {
    2022: {
      primaryValue: '28,9',
      primaryUnit: '°C',
      secondaryLabel: 'Anomali Rata-rata',
      secondaryValue: '+0,2 °C',
      trendNote: 'Suhu optimal untuk fotosintesis zooxanthellae.',
      classBreakdown: [
        { label: '< 28,5 °C (Sejuk)', pct: 22, color: '#06B6D4' },
        { label: '28,5–29,0 °C (Normal)', pct: 58, color: '#3B82F6' },
        { label: '29,0–29,8 °C (Hangat)', pct: 20, color: '#EAB308' },
      ],
    },
    2023: {
      primaryValue: '29,4',
      primaryUnit: '°C',
      secondaryLabel: 'Anomali Rata-rata',
      secondaryValue: '+0,7 °C',
      trendNote: 'Peningkatan termal musiman El Niño lemah.',
      classBreakdown: [
        { label: '< 29,0 °C (Optimal)', pct: 30, color: '#3B82F6' },
        { label: '29,0–29,6 °C (Waspada)', pct: 50, color: '#EAB308' },
        { label: '> 29,6 °C (Stres Termal)', pct: 20, color: '#F97316' },
      ],
    },
    2024: {
      primaryValue: '29,8',
      primaryUnit: '°C',
      secondaryLabel: 'Anomali Rata-rata',
      secondaryValue: '+1,1 °C',
      trendNote: 'Bulan terpanas Mei 2024 mencapai 30,2 °C di laguna timur.',
      classBreakdown: [
        { label: '29,0–29,5 °C (Sedang)', pct: 25, color: '#EAB308' },
        { label: '29,5–30,0 °C (Kritis)', pct: 55, color: '#F97316' },
        { label: '> 30,0 °C (Bleaching Watch)', pct: 20, color: '#EF4444' },
      ],
    },
    2025: {
      primaryValue: '29,1',
      primaryUnit: '°C',
      secondaryLabel: 'Anomali Rata-rata',
      secondaryValue: '+0,4 °C',
      trendNote: 'Penurunan suhu pasca puncak fase panas.',
      classBreakdown: [
        { label: '< 28,8 °C (Sejuk)', pct: 35, color: '#06B6D4' },
        { label: '28,8–29,3 °C (Normal)', pct: 45, color: '#3B82F6' },
        { label: '> 29,3 °C (Hangat)', pct: 20, color: '#EAB308' },
      ],
    },
    2026: {
      primaryValue: '28,7',
      primaryUnit: '°C',
      secondaryLabel: 'Anomali Rata-rata',
      secondaryValue: 'Baseline',
      trendNote: 'Suhu laut sangat stabil, mendukung percepatan kalsifikasi.',
      classBreakdown: [
        { label: '< 28,5 °C (Optimal)', pct: 42, color: '#06B6D4' },
        { label: '28,5–29,0 °C (Ideal)', pct: 50, color: '#3B82F6' },
        { label: '> 29,0 °C (Maksimal)', pct: 8, color: '#EAB308' },
      ],
    },
  },
  chl: {
    2022: {
      primaryValue: '0,38',
      primaryUnit: 'mg/m³',
      secondaryLabel: 'Status Tropik',
      secondaryValue: 'Mesotrofik',
      trendNote: 'Produktivitas perairan seimbang untuk rantai makanan karang.',
      classBreakdown: [
        { label: '0,1–0,2 mg/m³ (Oligotrofik)', pct: 30, color: '#0284C7' },
        { label: '0,2–0,4 mg/m³ (Optimal)', pct: 55, color: '#10B981' },
        { label: '> 0,4 mg/m³ (Tinggi)', pct: 15, color: '#84CC16' },
      ],
    },
    2023: {
      primaryValue: '0,42',
      primaryUnit: 'mg/m³',
      secondaryLabel: 'Status Tropik',
      secondaryValue: 'Mesotrofik',
      trendNote: 'Peningkatan klorofil di perairan selat akibat upwelling angin timur.',
      classBreakdown: [
        { label: '0,1–0,3 mg/m³', pct: 28, color: '#0284C7' },
        { label: '0,3–0,5 mg/m³', pct: 52, color: '#10B981' },
        { label: '> 0,5 mg/m³', pct: 20, color: '#84CC16' },
      ],
    },
    2024: {
      primaryValue: '0,31',
      primaryUnit: 'mg/m³',
      secondaryLabel: 'Status Tropik',
      secondaryValue: 'Oligotrofik-Meso',
      trendNote: 'Kejernihan air tinggi, penetrasi sinar fotosintesis optimal.',
      classBreakdown: [
        { label: '< 0,25 mg/m³ (Jernih)', pct: 40, color: '#0284C7' },
        { label: '0,25–0,40 mg/m³', pct: 48, color: '#10B981' },
        { label: '> 0,40 mg/m³', pct: 12, color: '#84CC16' },
      ],
    },
    2025: {
      primaryValue: '0,35',
      primaryUnit: 'mg/m³',
      secondaryLabel: 'Status Tropik',
      secondaryValue: 'Mesotrofik',
      trendNote: 'Distribusi fitoplankton merata di paparan laguna selatan.',
      classBreakdown: [
        { label: '< 0,3 mg/m³', pct: 38, color: '#0284C7' },
        { label: '0,3–0,45 mg/m³', pct: 50, color: '#10B981' },
        { label: '> 0,45 mg/m³', pct: 12, color: '#84CC16' },
      ],
    },
    2026: {
      primaryValue: '0,33',
      primaryUnit: 'mg/m³',
      secondaryLabel: 'Status Tropik',
      secondaryValue: 'Optimal',
      trendNote: 'Nilai standar ideal untuk ekosistem terumbu karang kepulauan.',
      classBreakdown: [
        { label: '0,1–0,3 mg/m³ (Jernih)', pct: 45, color: '#0284C7' },
        { label: '0,3–0,45 mg/m³ (Subur)', pct: 45, color: '#10B981' },
        { label: '> 0,45 mg/m³ (Tinggi)', pct: 10, color: '#84CC16' },
      ],
    },
  },
};

export default function CoralDistributionMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);

  // Layer groups
  const extentGroupRef = useRef<any>(null);
  const gisGroupRef = useRef<any>(null);
  const beaconsGroupRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<GisLayerType>('lyzenga');
  const [selectedYear, setSelectedYear] = useState<GisYear>(2026);
  const [showMobileLegend, setShowMobileLegend] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [showRedExtent, setShowRedExtent] = useState<boolean>(true);
  const [isLeafletReady, setIsLeafletReady] = useState<boolean>(false);

  const currentStats = ANNUAL_STATS[activeLayer][selectedYear];
  const geojsonUrl = `/data/gis/${activeLayer}_${selectedYear}.geojson`;

  // Helper to build custom animated HTML Beacon Marker
  const createBeaconMarker = (L: any, lat: number, lng: number, label: string, areaLabel: string) => {
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
          <span class="text-[11px] font-black tracking-tight text-red-100 whitespace-nowrap">${label}: ${areaLabel}</span>
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

      // Pulau Tunda geographical coordinates: Lat -5.8125, Lng 106.2755
      const center: [number, number] = [-5.8125, 106.2755];

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
      const gisGroup = L.layerGroup().addTo(map);
      const beaconsGroup = L.layerGroup().addTo(map);

      extentGroupRef.current = extentGroup;
      gisGroupRef.current = gisGroup;
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

  // 2. Render Red Spread Extent Envelope and Beacons when selectedYear or showRedExtent changes
  useEffect(() => {
    if (!isLeafletReady || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const extentGroup = extentGroupRef.current;
    const beaconsGroup = beaconsGroupRef.current;
    if (!extentGroup || !beaconsGroup) return;

    extentGroup.clearLayers();
    beaconsGroup.clearLayers();

    if (!showRedExtent) return;

    const extGeo = CORAL_LYZENGA_EXTENTS[selectedYear] || CORAL_LYZENGA_EXTENTS[2026];
    const areaLabel = extGeo?.properties?.area_label || `${extGeo?.properties?.area_ha || 875.61} ha`;

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
      const beaconMarker = createBeaconMarker(L, lat, lng, label, areaLabel);
      beaconsGroup.addLayer(beaconMarker);
    });
  }, [isLeafletReady, selectedYear, showRedExtent]);

  // 3. Fetch and Render Active GIS Dataset Layer (Lyzenga, SST, CHL)
  useEffect(() => {
    if (!isLeafletReady || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const gisGroup = gisGroupRef.current;
    if (!gisGroup) return;

    gisGroup.clearLayers();

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    fetch(`${origin}/data/gis/${activeLayer}_${selectedYear}.geojson`)
      .then((res) => (res.ok ? res.json() : null))
      .then((geo) => {
        if (!geo) return;

        const gisLayer = L.geoJSON(geo, {
          style: (feature: any) => {
            const gridcode = feature?.properties?.gridcode;
            let fillColor = '#10B981';
            let strokeColor = '#059669';

            if (activeLayer === 'lyzenga') {
              fillColor = gridcode === 1 ? '#10B981' : '#0EA5E9';
              strokeColor = gridcode === 1 ? '#059669' : '#0284C7';
            } else if (activeLayer === 'sst') {
              const colors = ['#06B6D4', '#3B82F6', '#EAB308', '#F97316', '#EF4444'];
              fillColor = colors[(gridcode - 1) % colors.length] || '#3B82F6';
              strokeColor = '#ffffff';
            } else {
              // chl
              const colors = ['#0284C7', '#0D9488', '#10B981', '#84CC16', '#EAB308'];
              fillColor = colors[(gridcode - 1) % colors.length] || '#10B981';
              strokeColor = '#ffffff';
            }

            return {
              fillColor,
              fillOpacity: 0.72,
              color: strokeColor,
              weight: 1.0,
              opacity: 0.8
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const p = feature?.properties || {};
            layer.on({
              mouseover: (e: any) => {
                const target = e.target;
                target.setStyle({ weight: 2.5, color: '#ffffff', fillOpacity: 0.9 });
                target.bringToFront();

                const code = p?.gridcode;
                const area = p?.Shape_Area ? Math.round(p.Shape_Area) + ' m²' : '';
                setHoveredInfo(`Gridcode: ${code} · Luas: ${area}`);
              },
              mouseout: (e: any) => {
                gisLayer.resetStyle(e.target);
                setHoveredInfo(null);
              }
            });
          }
        });

        gisGroup.addLayer(gisLayer);
      })
      .catch((err) => console.warn('Could not load GIS dataset in Leaflet:', err));
  }, [isLeafletReady, activeLayer, selectedYear]);

  // Handle Reset View
  const handleResetView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([-5.8125, 106.2755], 14, { duration: 1 });
  };

  const handleDownloadGeoJson = () => {
    const a = document.createElement('a');
    a.href = geojsonUrl;
    a.download = `reefsight_${activeLayer}_${selectedYear}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadNotice(
      `File GeoJSON reefsight_${activeLayer}_${selectedYear}.geojson berhasil diunduh.`
    );
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Layer Controls */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
        <div
          className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_12.jpg')` }}
        />
        <div className="relative z-10 p-6 sm:p-8 max-w-3xl text-white">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
            <span className="w-4 h-0.5 bg-orange-400" />
            ArcGIS & Satellite Multi-Temporal Intelligence · Leaflet Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Mapping & Spatio-Temporal Analysis Pulau Tunda
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
            Akses dataset spasial multi-tahun (2022–2026) tutupan karang Lyzenga, dinamika Suhu
            Permukaan Laut (SST), dan sebaran konsentrasi Klorofil-a (CHL) terverifikasi berbasis Leaflet.
          </p>

          {/* Layer Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {LAYER_CONFIGS.map((cfg) => {
              const active = activeLayer === cfg.id;
              return (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => setActiveLayer(cfg.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                    active
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30 ring-2 ring-orange-400'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
                  }`}
                >
                  {cfg.id === 'lyzenga' ? (
                    <Layers size={14} />
                  ) : cfg.id === 'sst' ? (
                    <Thermometer size={14} />
                  ) : (
                    <Waves size={14} />
                  )}
                  <span>{cfg.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: WebGIS Map (Left) & Area/Change Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm h-[400px] sm:h-[480px] lg:h-[560px] min-w-0 select-none">
          {/* Top Map Toolbar: Year Selector (2022 to 2026) */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[400] flex flex-wrap items-center gap-2 max-w-[calc(100%-4rem)] pointer-events-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs font-bold text-slate-800">
              <Calendar size={14} className="text-orange-500 flex-shrink-0" />
              <span className="hidden sm:inline">Tahun:</span>
              <div className="flex items-center gap-1">
                {([2022, 2023, 2024, 2025, 2026] as GisYear[]).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`min-h-[30px] px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedYear === yr
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Red Spread Perimeter */}
            <button
              type="button"
              onClick={() => setShowRedExtent(!showRedExtent)}
              aria-pressed={showRedExtent}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md border ${
                showRedExtent
                  ? 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400/40'
                  : 'bg-white/95 text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
              title="Tampilkan / Sembunyikan Garis Merah Batas Luas Sebaran Terumbu Karang"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${showRedExtent ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Batas Sebaran (Merah)</span>
            </button>

            {hoveredInfo && (
              <div className="hidden sm:inline-flex items-center px-3 py-1.5 min-h-[40px] rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-cyan-300 text-xs font-mono shadow-md animate-fadeIn">
                {hoveredInfo}
              </div>
            )}
          </div>

          {/* Interactive Leaflet canvas */}
          <div ref={mapContainer} className="w-full h-full z-0" />

          {/* Mobile Legend Toggle (< md) */}
          <button
            type="button"
            onClick={() => setShowMobileLegend((prev) => !prev)}
            className="md:hidden absolute bottom-3 left-3 z-[400] min-h-[44px] px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-bold text-slate-800 flex items-center gap-2"
          >
            <Layers size={14} className="text-blue-600" />
            <span>{showMobileLegend ? 'Tutup Legenda' : 'Legenda Spasial'}</span>
          </button>

          {/* Floating Layer & Legend Box */}
          <div
            className={`${
              showMobileLegend ? 'block' : 'hidden'
            } md:block absolute bottom-16 left-3 md:bottom-auto md:left-auto md:top-4 md:right-14 z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 text-xs text-slate-700 w-[min(18rem,calc(100%-1.5rem))] space-y-2.5`}
          >
            <div className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1.5 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Layers size={14} className="text-blue-600" />
                <span>
                  Legenda: {activeLayer.toUpperCase()} ({selectedYear})
                </span>
              </span>
              <button
                type="button"
                onClick={() => setShowMobileLegend(false)}
                aria-label="Tutup legenda"
                className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            </div>

            {/* Dynamic Color Classes */}
            <div className="space-y-1.5 text-[11px]">
              {currentStats.classBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-md flex-shrink-0 border border-black/10"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800 flex-shrink-0">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>

            {/* Red Spread Perimeter Indicator */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-red-50 border border-red-200">
                <span className="flex items-center gap-1.5 font-medium text-red-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  Batas Luas Sebaran:
                </span>
                <span className="font-mono font-bold text-red-700">
                  {CORAL_LYZENGA_EXTENTS[selectedYear]?.properties?.area_label || `${CORAL_LYZENGA_EXTENTS[selectedYear]?.properties?.area_ha || 875.61} ha`}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Resolusi: {LAYER_CONFIGS.find((l) => l.id === activeLayer)?.resolution}</span>
              <span className="font-semibold text-slate-600">Leaflet Map</span>
            </div>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            title="Fokus Ulang ke Pulau Tunda"
            aria-label="Fokus Ulang Peta"
            className="absolute bottom-3 right-3 z-[400] w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 shadow-md flex items-center justify-center transition-all hover:scale-105 pointer-events-auto"
          >
            <Compass size={18} className="text-orange-500" />
          </button>
        </div>

        {/* Right Column: Dynamic Statistics Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Distribusi {activeLayer.toUpperCase()} ({selectedYear})
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {LAYER_CONFIGS.find((l) => l.id === activeLayer)?.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Sentinel-2 & NOAA
              </span>
            </div>

            {/* Key Stat Block */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Luas Terpetakan
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline justify-center gap-1.5">
                <span>{currentStats.primaryValue}</span>
                <span className="text-sm font-bold text-slate-500">
                  {currentStats.primaryUnit}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                62 polygon geometri spasial
              </p>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-medium">Substrat Terumbu & Karang</span>
                <span className="font-bold text-slate-900">
                  523,6 ha ({currentStats.classBreakdown[0]?.pct || 59.8}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentStats.classBreakdown[0]?.pct || 59.8}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-slate-600 pt-2">
                <span className="font-medium">Pasir & Laguna Dangkal</span>
                <span className="font-bold text-slate-900">
                  352,0 ha ({currentStats.classBreakdown[1]?.pct || 40.2}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentStats.classBreakdown[1]?.pct || 40.2}%` }}
                />
              </div>
            </div>
          </div>

          {/* Multi-Year Trend Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <span>Tren 5 Tahun (2022–2026)</span>
              </h4>
              <span className="text-[10px] text-slate-400">Multi-Temporal</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-1 text-center">
              {([2022, 2023, 2024, 2025, 2026] as GisYear[]).map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border border-orange-300 text-orange-900 font-bold scale-105 shadow-xs'
                        : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">{yr}</div>
                    <div className="text-xs font-extrabold mt-0.5">
                      {ANNUAL_STATS[activeLayer][yr].primaryValue}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {ANNUAL_STATS[activeLayer][yr].primaryUnit}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download GeoJSON Button */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Download size={14} className="text-blue-600" />
                <span>Unduh Dataset Spasial</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">• Ready</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadGeoJson}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileCode size={14} className="text-cyan-400" />
              <span>Unduh GeoJSON ({activeLayer}_{selectedYear}.geojson)</span>
            </button>

            {downloadNotice && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center animate-fadeIn">
                {downloadNotice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
