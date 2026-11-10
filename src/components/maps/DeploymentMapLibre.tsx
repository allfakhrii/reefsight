'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PULAU_TUNDA_STATIONS } from '@/data/mockData';
import { StationData } from '@/types/reefsight';
import { Compass, Waves, Thermometer, Droplets, Volume2, ShieldAlert, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface Props {
  selectedStationId?: string | null;
  onSelectStation?: (station: StationData | null) => void;
}

export default function DeploymentMapLibre({
  selectedStationId,
  onSelectStation
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeStation, setActiveStation] = useState<StationData | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

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
      zoom: 13.6,
      pitch: 35,
      bearing: -15
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      // Add Station Buoy Markers
      PULAU_TUNDA_STATIONS.forEach((station) => {
        const el = document.createElement('div');
        el.className = 'station-marker-wrapper group cursor-pointer';

        const isDegraded = station.health_status === 'Degradasi';
        const isBleaching = station.health_status === 'Bleaching';
        const ringColor = isDegraded ? 'border-red-500 bg-red-500/30' : isBleaching ? 'border-amber-400 bg-amber-400/30' : 'border-cyan-400 bg-cyan-400/30';
        const dotColor = isDegraded ? 'bg-red-500' : isBleaching ? 'bg-amber-400' : 'bg-cyan-400';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full border-2 ${ringColor} animate-ping opacity-60"></span>
            <div class="w-6 h-6 rounded-full border-2 border-white/90 ${dotColor} shadow-lg flex items-center justify-center text-[9px] font-black text-slate-950">
              ${station.id.split('-').pop()}
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          setActiveStation(station);
          if (onSelectStation) onSelectStation(station);
          map.flyTo({
            center: [station.longitude, station.latitude],
            zoom: 15,
            pitch: 45,
            essential: true
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([station.longitude, station.latitude])
          .addTo(map);

        markersRef.current[station.id] = marker;
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Handle external selection
  const handleSelectStation = (station: StationData) => {
    setActiveStation(station);
    if (onSelectStation) onSelectStation(station);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [station.longitude, station.latitude],
        zoom: 15,
        pitch: 45,
        essential: true
      });
    }
  };

  const resetMap = () => {
    if (!mapRef.current) return;
    setActiveStation(null);
    if (onSelectStation) onSelectStation(null);
    mapRef.current.flyTo({
      center: [106.274, -5.813],
      zoom: 13.6,
      pitch: 35,
      bearing: -15,
      essential: true
    });
  };

  return (
    <div className="relative w-full h-[620px] lg:h-[720px] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-slate-950">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Station Selector Sidebar (Left) */}
      <div className="absolute top-4 left-4 z-10 max-w-[280px] w-full hidden md:block">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3 shadow-2xl max-h-[580px] flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Titik Penempatan Buoy</h3>
              <p className="text-[11px] text-slate-400">12 Stasiun Aktif Pulau Tunda</p>
            </div>
            <button
              onClick={resetMap}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md"
            >
              Reset
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto pr-1">
            {PULAU_TUNDA_STATIONS.map((st) => {
              const isActive = activeStation?.id === st.id;
              const isBleach = st.health_status === 'Bleaching';
              const isDegrade = st.health_status === 'Degradasi';
              const statusColor = isDegrade ? 'text-red-400' : isBleach ? 'text-amber-400' : 'text-emerald-400';

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(st)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-cyan-500/20 border border-cyan-400/40 text-white font-semibold'
                      : 'bg-slate-800/40 hover:bg-slate-800 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-md bg-slate-700/80 font-mono text-[10px] flex items-center justify-center font-bold text-cyan-300">
                      {st.id.split('-').pop()}
                    </span>
                    <span className="truncate">{st.position_label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${statusColor}`}>{st.health_status}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Active Station Inspector (Bottom / Modal) */}
      {activeStation && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 max-w-md w-auto bg-slate-900/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-4 text-white shadow-2xl z-20 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                  {activeStation.id}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeStation.health_status === 'Sehat'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : activeStation.health_status === 'Bleaching'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  Status: {activeStation.health_status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1.5">{activeStation.name}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {activeStation.latitude.toFixed(6)}°S, {activeStation.longitude.toFixed(6)}°E
              </p>
            </div>
            <button
              onClick={() => setActiveStation(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3.5">
            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <Waves className="w-3 h-3 text-cyan-400" /> Kedalaman
              </span>
              <span className="text-sm font-bold text-white mt-0.5 block">{activeStation.depth_m} m</span>
            </div>

            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <Thermometer className="w-3 h-3 text-amber-400" /> Suhu Air (SST)
              </span>
              <span className="text-sm font-bold text-amber-300 mt-0.5 block">{activeStation.temperature_c}°C</span>
            </div>

            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <Volume2 className="w-3 h-3 text-purple-400" /> Akustik
              </span>
              <span className="text-sm font-bold text-purple-300 mt-0.5 block">{activeStation.sound_level_db} dB</span>
            </div>

            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <Droplets className="w-3 h-3 text-emerald-400" /> Salinitas
              </span>
              <span className="text-sm font-bold text-white mt-0.5 block">{activeStation.salinity_psu} PSU</span>
            </div>

            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 font-medium">Kekeruhan</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{activeStation.turbidity_ntu} NTU</span>
            </div>

            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 font-medium">Dissolved O₂</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{activeStation.dissolved_oxygen_mg_l} mg/L</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Hardware: <strong className="text-cyan-300">{activeStation.prototype_id}</strong></span>
            <span>Sinkronisasi: {activeStation.last_sync}</span>
          </div>
        </div>
      )}
    </div>
  );
}
