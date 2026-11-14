'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PULAU_TUNDA_STATIONS } from '@/data/mockData';
import { StationData } from '@/types/reefsight';
import {
  Compass,
  Waves,
  Thermometer,
  Droplets,
  Volume2,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  X,
  Layers,
  Calendar,
  Cpu,
  MapPin,
  Clock,
  Radio
} from 'lucide-react';

interface Props {
  selectedStationId?: string | null;
  onSelectStation?: (station: StationData | null) => void;
}

export default function DeploymentMapLibre({
  selectedStationId,
  onSelectStation
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const directoryRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeStation, setActiveStation] = useState<StationData>(PULAU_TUNDA_STATIONS[5]); // Default ASIK-06
  const [showMobileLegend, setShowMobileLegend] = useState<boolean>(false);
  const [showDirectory, setShowDirectory] = useState<boolean>(false);
  const [showExtendedTelemetry, setShowExtendedTelemetry] = useState<boolean>(false);
  const [showReefContour, setShowReefContour] = useState<boolean>(true);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  // Sync reef contour layer visibility with state
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer('lyzenga-reef-fill')) {
      map.setLayoutProperty('lyzenga-reef-fill', 'visibility', showReefContour ? 'visible' : 'none');
    }
    if (map.getLayer('lyzenga-reef-border')) {
      map.setLayoutProperty('lyzenga-reef-border', 'visibility', showReefContour ? 'visible' : 'none');
    }
  }, [showReefContour]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Pulau Tunda coordinates
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
            attribution: '© Esri, Maxar, Earthstar Geographics'
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
      pitch: 30,
      bearing: -10
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      // Create GeoJSON LineString connecting all 12 stations in an elliptical loop around Pulau Tunda
      const loopCoordinates = [
        ...PULAU_TUNDA_STATIONS.map((s) => [s.longitude, s.latitude]),
        [PULAU_TUNDA_STATIONS[0].longitude, PULAU_TUNDA_STATIONS[0].latitude]
      ];

      map.addSource('deployment-loop-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Jalur Lingkaran Deployment' },
          geometry: {
            type: 'LineString',
            coordinates: loopCoordinates
          }
        }
      });

      // Outer glow for deployment line
      map.addLayer({
        id: 'deployment-loop-glow',
        type: 'line',
        source: 'deployment-loop-source',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 6,
          'line-opacity': 0.35,
          'line-blur': 3
        }
      });

      // Core crisp line
      map.addLayer({
        id: 'deployment-loop-line',
        type: 'line',
        source: 'deployment-loop-source',
        paint: {
          'line-color': '#FBBF24',
          'line-width': 2.5,
          'line-opacity': 0.95
        }
      });

      // Lyzenga 2026 benthic habitat GeoJSON layer
      map.addSource('lyzenga-habitat-source', {
        type: 'geojson',
        data: '/data/gis/lyzenga_2026.geojson'
      });

      map.addLayer(
        {
          id: 'lyzenga-reef-fill',
          type: 'fill',
          source: 'lyzenga-habitat-source',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.28
          }
        },
        'deployment-loop-glow'
      );

      map.addLayer(
        {
          id: 'lyzenga-reef-border',
          type: 'line',
          source: 'lyzenga-habitat-source',
          paint: {
            'line-color': '#059669',
            'line-width': 1.5,
            'line-opacity': 0.7
          }
        },
        'deployment-loop-glow'
      );

      // Add Buoy Station Pins matching image4.jpeg
      PULAU_TUNDA_STATIONS.forEach((station, index) => {
        const el = document.createElement('div');
        el.className = 'station-pin group cursor-pointer';

        const stationCode = `ASIK-${String(index + 1).padStart(2, '0')}`;
        const isSelected = activeStation?.id === station.id;

        el.innerHTML = `
          <div class="relative flex flex-col items-center">
            <div class="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold shadow-md border border-slate-700 mb-1 whitespace-nowrap">
              ${stationCode}
            </div>
            <div class="relative flex items-center justify-center">
              <span class="absolute w-7 h-7 rounded-full bg-amber-400/40 animate-ping"></span>
              <div class="w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          setActiveStation(station);
          if (onSelectStation) onSelectStation(station);
          map.flyTo({
            center: [station.longitude, station.latitude],
            zoom: 14.5,
            pitch: 35,
            essential: true
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([station.longitude, station.latitude])
          .addTo(map);

        markersRef.current[station.id] = marker;
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  const handleSelectStationFromDirectory = (station: StationData) => {
    setActiveStation(station);
    if (onSelectStation) onSelectStation(station);
    mapRef.current?.flyTo({
      center: [station.longitude, station.latitude],
      zoom: 14.5,
      pitch: 35,
      essential: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Panoramic Banner matching image4.jpeg */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-200 shadow-md">
        <div
          className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: `url('/images/coral-surveys/tunda_transect_11.jpg')` }}
        />
        <div className="relative z-10 p-6 sm:p-8 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
            <span className="w-4 h-0.5 bg-orange-400" />
            Spatial Deployment Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Mapping the REEFSIGHT Monitoring Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
            Explore the planned and documented deployment locations of REEFSIGHT monitoring prototypes around Pulau Tunda, and discover how each station contributes to ecological observation.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                mapContainer.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                mapRef.current?.flyTo({ center: [106.274, -5.813], zoom: 13.8, pitch: 30, essential: true });
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Compass size={14} />
              Explore Deployment Map
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDirectory((prev) => {
                  const next = !prev;
                  if (next) {
                    setTimeout(() => directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
                  }
                  return next;
                });
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-all"
            >
              <Layers size={14} />
              {showDirectory ? 'Sembunyikan Direktori' : 'View Location Directory'}
            </button>
            <button
              type="button"
              onClick={() => setShowReefContour((prev) => !prev)}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-semibold text-xs border flex items-center gap-2 transition-all ${
                showReefContour
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <Layers size={14} className="text-emerald-400 shrink-0" />
              {showReefContour ? 'Overlay Kontur Karang 2026: ON' : 'Overlay Kontur Karang 2026: OFF'}
            </button>
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-4 flex items-center gap-1.5">
            <MapPin size={13} className="text-orange-400" />
            PULAU TUNDA · KABUPATEN SERANG · BANTEN
          </p>
        </div>
      </div>

      {/* Expandable 12-Station Directory Grid */}
      {showDirectory && (
        <div
          ref={directoryRef}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Direktori 12 Stasiun Mooring Pulau Tunda (Klik untuk Fokus Peta)
            </h3>
            <button
              type="button"
              onClick={() => setShowDirectory(false)}
              aria-label="Tutup direktori stasiun"
              className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {PULAU_TUNDA_STATIONS.map((station, idx) => {
              const code = `ASIK-${String(idx + 1).padStart(2, '0')}`;
              const isSelected = activeStation.id === station.id;
              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => handleSelectStationFromDirectory(station)}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-mono font-bold text-xs">{code}</div>
                  <div className="text-[10px] text-slate-500 truncate">{station.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Map (Left) & Station Detail Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm h-[380px] sm:h-[460px] lg:h-[540px] min-w-0">
          <div ref={mapContainer} className="w-full h-full" />

          {/* Mobile Legenda Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileLegend((prev) => !prev)}
            className="sm:hidden absolute bottom-3 left-3 z-10 min-h-[44px] px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-bold text-slate-800 flex items-center gap-2"
          >
            <Layers size={14} className="text-amber-500" />
            <span>{showMobileLegend ? 'Tutup Legenda' : 'Legenda Peta'}</span>
          </button>

          {/* Floating Legenda matching image4.jpeg */}
          <div
            className={`${
              showMobileLegend ? 'block' : 'hidden'
            } sm:block absolute bottom-16 left-3 sm:bottom-4 sm:left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-slate-200 text-xs text-slate-700 w-[min(17rem,calc(100%-1.5rem))] space-y-2`}
          >
            <div className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center justify-between gap-2">
              <span>Legenda</span>
              <span className="text-[10px] text-slate-400 font-normal">Pulau Tunda</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-xs flex-shrink-0" />
                <span>Lokasi Prototipe (EchoVision)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-amber-400 rounded-full flex-shrink-0" />
                <span>Jalur Lingkaran (Deployment)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 flex-shrink-0" />
                <span>Daratan (Pulau Tunda)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-blue-500 flex-shrink-0" />
                <span>Perairan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-300 flex-shrink-0" />
                <span>Area Terumbu Karang (Estimasi)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Station Details & Deployment Overview matching image4.jpeg */}
        <div className="space-y-5">
          {/* Active Station Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {`ASIK-${String(PULAU_TUNDA_STATIONS.findIndex((s) => s.id === activeStation.id) + 1).padStart(2, '0')}`}
                </h3>
                <p className="text-xs text-slate-500 font-medium">EchoVision v1.0</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>

            {/* Buoy Monitoring Field Image */}
            <div className="h-40 rounded-2xl bg-slate-900 border border-slate-100 flex items-center justify-center relative overflow-hidden">
              <img
                src="/images/coral-surveys/tunda_transect_08.jpg"
                alt="EchoVision Buoy Mooring Location"
                className="w-full h-full object-cover filter drop-shadow-md"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                Dokumentasi Bawah Air ASIK
              </span>
            </div>

            {/* Station Telemetry Data */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-500" />
                  Koordinat
                </span>
                <span className="font-semibold text-slate-800">
                  {`S ${Math.abs(activeStation.latitude).toFixed(4)}°, E ${activeStation.longitude.toFixed(4)}°`}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Waves size={13} className="text-slate-500" />
                  Kedalaman
                </span>
                <span className="font-semibold text-slate-800">{activeStation.depth_m} m</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Cpu size={13} className="text-slate-500" />
                  ID Perangkat
                </span>
                <span className="font-semibold text-slate-800">{`EV-${activeStation.id}`}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-500" />
                  Penempatan
                </span>
                <span className="font-semibold text-slate-800">10 Okt 2026</span>
              </div>
            </div>

            {/* Live Measurements */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Suhu Permukaan</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">{activeStation.temperature_c}°C</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Salinitas</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">{activeStation.salinity_psu} PSU</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowExtendedTelemetry((prev) => !prev)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{showExtendedTelemetry ? 'Sembunyikan Detail Telemetri' : 'View Details'}</span>
              <ChevronRight size={14} className={showExtendedTelemetry ? 'rotate-90 transition-transform' : 'transition-transform'} />
            </button>

            {showExtendedTelemetry && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-slate-500">pH Laut</span>
                  <span className="font-bold text-slate-800">{activeStation.ph}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-slate-500">Oksigen Terlarut</span>
                  <span className="font-bold text-slate-800">{activeStation.dissolved_oxygen_mg_l} mg/L</span>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-slate-500">Turbiditas / Kedalaman</span>
                  <span className="font-bold text-cyan-700">
                    {activeStation.turbidity_ntu} NTU ({activeStation.depth_m} m)
                  </span>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-slate-500">Akustik / Status</span>
                  <span className="font-bold text-emerald-700">
                    {activeStation.sound_level_db} dB ({activeStation.status})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Deployment Overview stats matching image4.jpeg */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deployment Overview
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="text-lg font-black text-blue-700">12</div>
                <div className="text-[10px] text-slate-500 font-medium">Total Stasiun</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="text-lg font-black text-emerald-700">10</div>
                <div className="text-[10px] text-slate-500 font-medium">Operational</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="text-lg font-black text-amber-700">2</div>
                <div className="text-[10px] text-slate-500 font-medium">Planned</div>
              </div>
              <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                <div className="text-lg font-black text-purple-700">1</div>
                <div className="text-[10px] text-slate-500 font-medium">Jenis Perangkat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
