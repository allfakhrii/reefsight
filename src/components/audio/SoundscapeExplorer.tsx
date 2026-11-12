'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Activity, Radio, Waves, Info, ShieldCheck } from 'lucide-react';

interface SoundSample {
  id: string;
  name: string;
  station: string;
  condition: string;
  aciScore: number;
  description: string;
  frequencyRange: string;
}

const SAMPLES: SoundSample[] = [
  {
    id: 'healthy-sta01',
    name: 'RFS-STA-001: Terumbu Sehat (Snapping Shrimp & Ikan Karang)',
    station: 'Stasiun 01 (Barat)',
    condition: 'Sehat',
    aciScore: 0.78,
    description: 'Aktivitas akustik tinggi dengan bunyi retakan udang pistol (snapping shrimp) frekuensi tinggi dan suara komunikasi ikan famili Pomacentridae.',
    frequencyRange: '1.5 kHz – 18.0 kHz'
  },
  {
    id: 'bleached-sta02',
    name: 'RFS-STA-002: Pemutihan Karang (Silent Reef)',
    station: 'Stasiun 02 (Barat Laut)',
    condition: 'Bleaching',
    aciScore: 0.29,
    description: 'Suara latar belakang hening dengan penurunan frekuensi biogenik hingga 65% akibat berkurangnya invertebrata dan keanekaragaman ikan karang.',
    frequencyRange: '100 Hz – 3.2 kHz'
  },
  {
    id: 'anthro-sta07',
    name: 'RFS-STA-007: Gangguan Mesin Perahu Nelayan (Boat Noise)',
    station: 'Stasiun 07 (Timur)',
    condition: 'Degradasi / Noise',
    aciScore: 0.54,
    description: 'Derau antropogenik kuat pada frekuensi rendah (100–1200 Hz) dari baling-baling mesin perahu, menutupi sinyal bioakustik alami biota laut.',
    frequencyRange: '50 Hz – 2.0 kHz'
  }
];

export default function SoundscapeExplorer() {
  const [selectedSample, setSelectedSample] = useState<SoundSample>(SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);

  const canvasWaveRef = useRef<HTMLCanvasElement>(null);
  const canvasSpecRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Web Audio Synth for realistic sound generation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const syncGainLevel = (nextMuted: boolean, nextVol: number) => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        nextMuted ? 0 : nextVol * 0.15,
        audioCtxRef.current.currentTime
      );
    }
  };

  const stopAudio = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(selectedSample);
    }
  };

  const startAudio = (sampleToPlay: SoundSample = selectedSample) => {
    try {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as any).stop();
        } catch (e) {}
        noiseNodeRef.current = null;
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Create procedural sound texture depending on sample
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Synthesize ocean hum + shrimp clicks
      for (let i = 0; i < bufferSize; i++) {
        // base water hum
        let val = (Math.random() * 2 - 1) * 0.04;

        if (sampleToPlay.condition === 'Sehat') {
          // Snapping shrimp sharp clicks
          if (Math.random() < 0.003) {
            val += (Math.random() * 2 - 1) * 0.8;
          }
        } else if (sampleToPlay.condition.includes('Noise')) {
          // Boat engine low rumble
          val += Math.sin(i * 0.04) * 0.25;
        }
        data[i] = val;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;
      whiteNoise.connect(gain);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;

      isPlayingRef.current = true;
      setIsPlaying(true);
    } catch (e) {
      console.error('Audio init error:', e);
      isPlayingRef.current = true;
      setIsPlaying(true); // fallback visual
    }
  };

  useEffect(() => {
    if (isPlayingRef.current) {
      startAudio(selectedSample);
    }
  }, [selectedSample]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Handle Canvas Visualizer Animation
  useEffect(() => {
    const waveCanvas = canvasWaveRef.current;
    const specCanvas = canvasSpecRef.current;
    if (!waveCanvas || !specCanvas) return;

    const waveCtx = waveCanvas.getContext('2d');
    const specCtx = specCanvas.getContext('2d');
    if (!waveCtx || !specCtx) return;

    let offset = 0;

    const draw = () => {
      offset += isPlaying ? 0.08 : 0.01;
      const w = waveCanvas.width;
      const h = waveCanvas.height;

      // 1. Draw Waveform
      waveCtx.fillStyle = '#061726';
      waveCtx.fillRect(0, 0, w, h);

      // Grid Lines
      waveCtx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
      waveCtx.lineWidth = 1;
      waveCtx.beginPath();
      waveCtx.moveTo(0, h / 2);
      waveCtx.lineTo(w, h / 2);
      waveCtx.stroke();

      // Wave line
      waveCtx.strokeStyle = selectedSample.condition === 'Sehat' ? '#10b981' : selectedSample.condition === 'Bleaching' ? '#f59e0b' : '#38bdf8';
      waveCtx.lineWidth = 2;
      waveCtx.beginPath();

      const sliceWidth = w / 120;
      let x = 0;

      for (let i = 0; i < 120; i++) {
        let amp = isPlaying ? 0.35 : 0.05;
        if (selectedSample.condition === 'Sehat' && isPlaying) {
          // Add shrimp spikes
          if (Math.sin(i * 3 + offset * 4) > 0.8) amp *= 2.2;
        }

        const v = Math.sin(i * 0.18 + offset) * Math.cos(i * 0.05 + offset * 0.7) * (h * 0.38) * amp;
        const y = h / 2 + v;

        if (i === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
        x += sliceWidth;
      }
      waveCtx.stroke();

      // 2. Draw FFT Spectrogram waterfall
      const sw = specCanvas.width;
      const sh = specCanvas.height;

      // Shift existing spectrogram left
      specCtx.drawImage(specCanvas, -2, 0);

      // Draw new column at right edge
      const colX = sw - 2;
      const bins = 40;
      const binHeight = sh / bins;

      for (let b = 0; b < bins; b++) {
        let intensity = 0;
        if (isPlaying) {
          if (selectedSample.condition === 'Sehat') {
            // High frequency energy (udang) + mid freq
            intensity = Math.sin(b * 0.3 + offset * 2) * 0.5 + 0.5;
            if (b < 10) intensity *= 0.6; // less low freq
          } else if (selectedSample.condition.includes('Noise')) {
            // Intense low frequency boat noise
            intensity = b > 25 ? (Math.random() * 0.9 + 0.1) : (Math.random() * 0.2);
          } else {
            // Silent / Bleached
            intensity = Math.random() * 0.2;
          }
        } else {
          intensity = 0.05;
        }

        // Color gradient based on intensity
        const r = Math.floor(intensity * 255);
        const g = Math.floor((1 - Math.abs(intensity - 0.5) * 2) * 200);
        const bCol = Math.floor((1 - intensity) * 220);

        specCtx.fillStyle = `rgb(${r}, ${g}, ${bCol})`;
        specCtx.fillRect(colX, b * binHeight, 2, binHeight);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, selectedSample]);

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Acoustic Intelligence & Bioacoustics
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Underwater Soundscape Explorer</h3>
          <p className="text-xs text-slate-400">
            Mendengarkan & Menganalisis Spektrum Suara Bawah Laut Hydrophone di Sekitar Pulau Tunda
          </p>
        </div>

        {/* Play & Volume Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              syncGainLevel(nextMuted, volume);
            }}
            aria-label={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>
          <input
            type="range"
            aria-label="Volume audio"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const nextVol = parseFloat(e.target.value);
              setVolume(nextVol);
              setIsMuted(nextVol === 0);
              syncGainLevel(nextVol === 0, nextVol);
            }}
            className="w-20 sm:w-24 accent-cyan-400 cursor-pointer"
          />
          <button
            type="button"
            onClick={togglePlay}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Hentikan Audio' : 'Dengarkan Rekaman'}
          </button>
        </div>
      </div>

      {/* Sample Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-4">
        {SAMPLES.map((sample) => {
          const isSelected = selectedSample.id === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => setSelectedSample(sample)}
              className={`min-h-[44px] p-3.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-300 truncate">{sample.station}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sample.condition === 'Sehat'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : sample.condition === 'Bleaching'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  {sample.condition}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{sample.name}</p>
            </button>
          );
        })}
      </div>

      {/* Visualizer Screens (Waveform & Spectrogram) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Waveform Canvas */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Waveform Gelombang Akustik
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Time-Domain</span>
          </div>
          <canvas
            ref={canvasWaveRef}
            width={450}
            height={130}
            className="w-full h-[120px] rounded-lg bg-slate-950"
          />
        </div>

        {/* FFT Spectrogram Canvas */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-purple-400" /> Spektrogram Frekuensi (FFT)
            </span>
            <span className="text-[10px] font-mono text-purple-400">{selectedSample.frequencyRange}</span>
          </div>
          <canvas
            ref={canvasSpecRef}
            width={450}
            height={130}
            className="w-full h-[120px] rounded-lg bg-slate-950"
          />
        </div>
      </div>

      {/* Bioacoustics Scientific Metrics Footer */}
      <div className="mt-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
            Analisis Ekologis
          </span>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {selectedSample.description}
          </p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-700 pt-3 md:pt-0 md:pl-5">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Acoustic Complexity Index (ACI):</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-2xl font-black font-mono ${
                selectedSample.aciScore > 0.6
                  ? 'text-emerald-400'
                  : selectedSample.aciScore > 0.4
                  ? 'text-cyan-400'
                  : 'text-amber-400'
              }`}>
                {selectedSample.aciScore}
              </span>
              <span className="text-xs text-slate-400">/ 1.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
