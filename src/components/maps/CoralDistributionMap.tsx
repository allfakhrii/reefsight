'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Sliders, Info, TrendingDown, ArrowRightLeft, Eye } from 'lucide-react';

export default function CoralDistributionMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // States
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [isSwipeMode, setIsSwipeMode] = useState<boolean>(false);
  const [swipePosition, setSwipePosition] = useState<number>(50); // percentage 0 - 100
  const [selectedCondition, setSelectedCondition] = useState<string>('Semua');
  const [selectedPolygonInfo, setSelectedPolygonInfo] = useState<any | null>(null);

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
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // 1. Add Source 2023
      map.addSource('coral-2023-source', {
        type: 'geojson',
        data: '/data/coral_tunda_2023.geojson'
      });

      // 2. Add Source 2020
      map.addSource('coral-2020-source', {
        type: 'geojson',
        data: '/data/coral_tunda_2020.geojson'
      });

      // Layer 2023 Fill
      map.addLayer({
        id: 'coral-2023-fill',
        type: 'fill',
        source: 'coral-2023-source',
        paint: {
          'fill-color': [
            'match',
            ['get', 'kondisi'],
            'Sehat', '#10b981',
            'Bleaching', '#f59e0b',
            'Degradasi', '#ef4444',
            '#06b6d4'
          ],
          'fill-opacity': 0.65
        }
      });

      // Layer 2023 Outline
      map.addLayer({
        id: 'coral-2023-line',
        type: 'line',
        source: 'coral-2023-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      // Layer 2020 Fill (Hidden initially or used for swipe)
      map.addLayer({
        id: 'coral-2020-fill',
        type: 'fill',
        source: 'coral-2020-source',
        layout: {
          visibility: 'none'
        },
        paint: {
          'fill-color': [
            'match',
            ['get', 'kondisi'],
            'Sehat', '#10b981',
            'Bleaching', '#f59e0b',
            'Degradasi', '#ef4444',
            '#06b6d4'
          ],
          'fill-opacity': 0.65
        }
      });

      map.addLayer({
        id: 'coral-2020-line',
        type: 'line',
        source: 'coral-2020-source',
        layout: {
          visibility: 'none'
        },
        paint: {
          'line-color': '#93c5fd',
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      // Click Event on Polygons
      map.on('click', 'coral-2023-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        setSelectedPolygonInfo(e.features[0].properties);
      });

      map.on('mouseenter', 'coral-2023-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'coral-2023-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update Year Visibility
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    if (selectedYear === 2023) {
      mapRef.current.setLayoutProperty('coral-2023-fill', 'visibility', 'visible');
      mapRef.current.setLayoutProperty('coral-2023-line', 'visibility', 'visible');
      mapRef.current.setLayoutProperty('coral-2020-fill', 'visibility', 'none');
      mapRef.current.setLayoutProperty('coral-2020-line', 'visibility', 'none');
    } else {
      mapRef.current.setLayoutProperty('coral-2023-fill', 'visibility', 'none');
      mapRef.current.setLayoutProperty('coral-2023-line', 'visibility', 'none');
      mapRef.current.setLayoutProperty('coral-2020-fill', 'visibility', 'visible');
      mapRef.current.setLayoutProperty('coral-2020-line', 'visibility', 'visible');
    }
  }, [selectedYear]);

  // Update Condition Filter
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    const filter = selectedCondition === 'Semua' 
      ? null 
      : ['==', ['get', 'kondisi'], selectedCondition];

    mapRef.current.setFilter('coral-2023-fill', filter as any);
    mapRef.current.setFilter('coral-2023-line', filter as any);
    mapRef.current.setFilter('coral-2020-fill', filter as any);
    mapRef.current.setFilter('coral-2020-line', filter as any);
  }, [selectedCondition]);

  return (
    <div className="relative w-full h-[640px] lg:h-[740px] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-slate-950">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Control Bar (Top Left) */}
      <div className="absolute top-4 left-4 z-10 max-w-sm w-[calc(100vw-32px)] md:w-80">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">WebGIS ArcGIS Layer</span>
              <h3 className="text-sm font-bold text-white">Distribusi Terumbu Karang</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Pulau Tunda
            </span>
          </div>

          {/* Year Switcher */}
          <div className="mb-3">
            <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Pilih Tahun Pengamatan:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedYear(2023)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedYear === 2023
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Tahun 2023 (Terkini)
              </button>
              <button
                onClick={() => setSelectedYear(2020)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedYear === 2020
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Tahun 2020 (Baseline)
              </button>
            </div>
          </div>

          {/* Condition Filter */}
          <div className="mb-3">
            <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Filter Kondisi Karang:</label>
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              {['Semua', 'Sehat', 'Bleaching', 'Degradasi'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`py-1 rounded-lg font-medium transition ${
                    selectedCondition === cond
                      ? 'bg-slate-700 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Karang Sehat (&gt;50% cover)
              </span>
              <span className="font-mono text-slate-400">182.8 Ha</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" /> Stres / Bleaching (30-50%)
              </span>
              <span className="font-mono text-slate-400">39.8 Ha</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500" /> Degradasi (&lt;30%)
              </span>
              <span className="font-mono text-slate-400">35.7 Ha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coral Change Analysis Summary (Top Right) */}
      <div className="absolute top-4 right-4 z-10 hidden lg:block max-w-xs">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3.5 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-200">Coral Change Analysis (2020 vs 2023)</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Rerata tutupan karang Pulau Tunda mengalami penurunan <span className="text-amber-400 font-bold">-7.4%</span> dalam 3 tahun terakhir, terutama akibat kenaikan suhu di zona timur dan tekanan jangkar nelayan.
          </p>
          <div className="mt-2.5 p-2 bg-slate-800/60 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Luas Terumbu:</span>
            <span className="font-bold text-cyan-300">260.3 Hektar</span>
          </div>
        </div>
      </div>

      {/* Selected Polygon Detail Card (Bottom Left / Center) */}
      {selectedPolygonInfo && (
        <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-sm bg-slate-900/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-4 text-white shadow-2xl z-20 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Polygon {selectedPolygonInfo.id}
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">{selectedPolygonInfo.zona}</h3>
            </div>
            <button
              onClick={() => setSelectedPolygonInfo(null)}
              className="text-slate-400 hover:text-white text-lg p-1"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="p-2 bg-slate-800/60 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Tutupan Karang</span>
              <span className="text-base font-bold text-cyan-300 mt-0.5 block">
                {selectedPolygonInfo.tutupan_pct}%
              </span>
            </div>

            <div className="p-2 bg-slate-800/60 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Kondisi Ekologis</span>
              <span className={`text-base font-bold mt-0.5 block ${
                selectedPolygonInfo.kondisi === 'Sehat'
                  ? 'text-emerald-400'
                  : selectedPolygonInfo.kondisi === 'Bleaching'
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}>
                {selectedPolygonInfo.kondisi}
              </span>
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs text-slate-300">
            <p><strong className="text-slate-400">Bentuk Dominan:</strong> {selectedPolygonInfo.life_form}</p>
            <p><strong className="text-slate-400">Estimasi Luas:</strong> {selectedPolygonInfo.luas_ha} Hektar</p>
            <p><strong className="text-slate-400">Kekayaan Spesies Ikan:</strong> {selectedPolygonInfo.fish_richness || 45} Spesies</p>
          </div>
        </div>
      )}
    </div>
  );
}
