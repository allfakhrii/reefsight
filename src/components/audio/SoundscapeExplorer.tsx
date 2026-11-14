'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Activity,
  Radio,
  Waves,
  Eye,
  X,
  Cpu,
  BarChart2,
  Sparkles,
} from 'lucide-react';

interface SoundSample {
  id: string;
  key: 'very_high' | 'high' | 'low_moderate' | 'very_low';
  name: string;
  station: string;
  condition: 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah';
  aciScore: number;
  audioUrl: string;
  duration: string;
  rmsDb: number;
  peakDb: number;
  snapsCount: number;
  fishSoundsTotal: number;
  fishSoundsDetail: { pop: number; knock: number; grunt: number; scrape: number };
  benthicDetail: { click: number; crunch: number };
  description: string;
}

const SAMPLES: SoundSample[] = [
  {
    id: 'act-very-high',
    key: 'very_high',
    name: 'Aktivitas Akustik Sangat Tinggi (Very High)',
    station: 'Stasiun ASIK-01 (Barat Karang)',
    condition: 'Sangat Tinggi',
    aciScore: 0.88,
    audioUrl: '/soundscape/reef_activity_very_high.wav',
    duration: '45.0s · 48 kHz / 24-bit',
    rmsDb: -27.0,
    peakDb: -1.0,
    snapsCount: 170,
    fishSoundsTotal: 228,
    fishSoundsDetail: { pop: 90, knock: 60, grunt: 50, scrape: 28 },
    benthicDetail: { click: 100, crunch: 30 },
    description:
      'Spektrum akustik terumbu sangat aktif dengan 170 letupan udang pistol (Alpheidae) berfrekuensi tinggi (2–16 kHz), serta 228 vokalisasi ikan (pop, knock, grunt) dan 130 gesekan bentik.',
  },
  {
    id: 'act-high',
    key: 'high',
    name: 'Aktivitas Akustik Tinggi (High Activity)',
    station: 'Stasiun ASIK-04 (Utara Pulau Tunda)',
    condition: 'Tinggi',
    aciScore: 0.74,
    audioUrl: '/soundscape/reef_activity_high.wav',
    duration: '45.0s · 48 kHz / 24-bit',
    rmsDb: -26.9,
    peakDb: -1.7,
    snapsCount: 85,
    fishSoundsTotal: 94,
    fishSoundsDetail: { pop: 38, knock: 24, grunt: 20, scrape: 12 },
    benthicDetail: { click: 45, crunch: 12 },
    description:
      'Komunitas terumbu sehat dengan 85 letupan diskret udang pistol, 94 panggilan vokal ikan famili Pomacentridae & Chaetodontidae, serta 57 gesekan organisme pemakan alga substrat.',
  },
  {
    id: 'act-low-moderate',
    key: 'low_moderate',
    name: 'Aktivitas Rendah–Sedang (Low to Moderate)',
    station: 'Stasiun ASIK-08 (Timur Laut)',
    condition: 'Sedang',
    aciScore: 0.48,
    audioUrl: '/soundscape/reef_activity_low_moderate.wav',
    duration: '45.0s · 48 kHz / 24-bit',
    rmsDb: -27.8,
    peakDb: -1.0,
    snapsCount: 28,
    fishSoundsTotal: 20,
    fishSoundsDetail: { pop: 10, knock: 5, grunt: 3, scrape: 2 },
    benthicDetail: { click: 14, crunch: 2 },
    description:
      'Aktivitas bioakustik sedang dengan 28 letupan udang pistol, frekuensi biogenik menurun pada pita 4–12 kHz, mengindikasikan zona terumbu dengan tutupan karang sedang atau masa pasang tenang.',
  },
  {
    id: 'act-very-low',
    key: 'very_low',
    name: 'Aktivitas Sangat Rendah (Very Low Activity)',
    station: 'Stasiun ASIK-11 (Selatan Terdegradasi)',
    condition: 'Rendah',
    aciScore: 0.22,
    audioUrl: '/soundscape/reef_activity_very_low.wav',
    duration: '45.0s · 48 kHz / 24-bit',
    rmsDb: -28.4,
    peakDb: -1.0,
    snapsCount: 7,
    fishSoundsTotal: 2,
    fishSoundsDetail: { pop: 2, knock: 0, grunt: 0, scrape: 0 },
    benthicDetail: { click: 3, crunch: 0 },
    description:
      'Kondisi terumbu senyap (silent reef) dengan hanya 7 letupan udang pistol dan 2 suara ikan. Menunjukkan depresi ekologis, tutupan karang hidup rendah (<15%), atau pasca-pemutihan massal.',
  },
];

export default function SoundscapeExplorer() {
  const [selectedSample, setSelectedSample] = useState<SoundSample>(SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [showSpectrogramModal, setShowSpectrogramModal] = useState<boolean>(false);

  const canvasWaveRef = useRef<HTMLCanvasElement>(null);
  const canvasSpecRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio elements
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const syncGain = (muted: boolean, vol: number) => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        muted ? 0 : vol,
        audioCtxRef.current.currentTime
      );
    }
  };

  const initAudioNodes = () => {
    if (!audioElemRef.current) return;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      gainNodeRef.current = gain;

      try {
        const source = ctx.createMediaElementSource(audioElemRef.current);
        source.connect(analyser);
        analyser.connect(gain);
        gain.connect(ctx.destination);
      } catch {
        // Fallback if media element already bound
      }
    }
  };

  const playCurrentAudio = async () => {
    try {
      initAudioNodes();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      if (audioElemRef.current) {
        audioElemRef.current.volume = isMuted ? 0 : volume;
        await audioElemRef.current.play();
        isPlayingRef.current = true;
        setIsPlaying(true);
      }
    } catch {
      // Audio element play error or autoplay policy
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  };

  const stopCurrentAudio = () => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopCurrentAudio();
    } else {
      playCurrentAudio();
    }
  };

  // Change sample
  const handleSelectSample = (sample: SoundSample) => {
    const wasPlaying = isPlaying;
    stopCurrentAudio();
    setSelectedSample(sample);
    if (audioElemRef.current) {
      audioElemRef.current.src = sample.audioUrl;
      audioElemRef.current.load();
    }
    if (wasPlaying) {
      setTimeout(() => {
        playCurrentAudio();
      }, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const audio = new Audio(selectedSample.audioUrl);
    audio.loop = true;
    audioElemRef.current = audio;

    return () => {
      audio.pause();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Visualizer Canvas Animation (Waveform and Live FFT waterfall)
  useEffect(() => {
    const waveCanvas = canvasWaveRef.current;
    const specCanvas = canvasSpecRef.current;
    if (!waveCanvas || !specCanvas) return;

    const waveCtx = waveCanvas.getContext('2d');
    const specCtx = specCanvas.getContext('2d');
    if (!waveCtx || !specCtx) return;

    const dataArray = new Uint8Array(128);
    let offset = 0;

    const draw = () => {
      offset += isPlaying ? 0.08 : 0.01;
      const w = waveCanvas.width;
      const h = waveCanvas.height;

      // Read real FFT data if available, else simulate with sample metrics
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        const factor =
          selectedSample.condition === 'Sangat Tinggi'
            ? 0.9
            : selectedSample.condition === 'Tinggi'
            ? 0.7
            : selectedSample.condition === 'Sedang'
            ? 0.4
            : 0.15;
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.floor(
            (Math.sin(i * 0.2 + offset * 3) * 0.4 + 0.6) * 255 * factor * (isPlaying ? 1 : 0.08)
          );
        }
      }

      // 1. Draw Waveform
      waveCtx.fillStyle = '#061726';
      waveCtx.fillRect(0, 0, w, h);

      // Centerline
      waveCtx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
      waveCtx.lineWidth = 1;
      waveCtx.beginPath();
      waveCtx.moveTo(0, h / 2);
      waveCtx.lineTo(w, h / 2);
      waveCtx.stroke();

      // Waveform line
      waveCtx.strokeStyle =
        selectedSample.condition === 'Sangat Tinggi'
          ? '#22c55e'
          : selectedSample.condition === 'Tinggi'
          ? '#06b6d4'
          : selectedSample.condition === 'Sedang'
          ? '#f59e0b'
          : '#f43f5e';
      waveCtx.lineWidth = 2;
      waveCtx.beginPath();

      const sliceWidth = w / 120;
      let x = 0;

      for (let i = 0; i < 120; i++) {
        const freqVal = (dataArray[i % dataArray.length] / 255) * (isPlaying ? 1 : 0.1);
        let snapPeak = 0;
        if (isPlaying && selectedSample.snapsCount > 30) {
          if (Math.sin(i * 4 + offset * 6) > 0.85) {
            snapPeak = (selectedSample.snapsCount / 170) * (h * 0.35);
          }
        }
        const v =
          Math.sin(i * 0.2 + offset) * (h * 0.25) * freqVal +
          (Math.random() - 0.5) * 4 * (isPlaying ? 1 : 0.1) +
          snapPeak;
        const y = h / 2 + v;

        if (i === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
        x += sliceWidth;
      }
      waveCtx.stroke();

      // 2. Draw Waterfall FFT Spectrogram
      const sw = specCanvas.width;
      const sh = specCanvas.height;

      // Shift existing spectrogram left 2 pixels
      specCtx.drawImage(specCanvas, -2, 0);

      const colX = sw - 2;
      const bins = 40;
      const binHeight = sh / bins;

      for (let b = 0; b < bins; b++) {
        const binIndex = Math.floor((b / bins) * dataArray.length);
        const intensity = dataArray[binIndex] / 255;

        // Biological oceanic color ramp (dark navy -> cyan -> emerald -> yellow/red peaks)
        const r = Math.floor(intensity > 0.7 ? (intensity - 0.7) * 3.33 * 255 : 0);
        const g = Math.floor(intensity * 220);
        const bCol = Math.floor((1 - intensity * 0.7) * 240);

        specCtx.fillStyle = `rgb(${r}, ${g}, ${bCol})`;
        specCtx.fillRect(colX, (bins - 1 - b) * binHeight, 2, binHeight);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, selectedSample]);

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-4 sm:p-6 text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Acoustic Intelligence · Pulau Tunda Fleet
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            Underwater Hydrophone Soundscape Explorer
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Pemrosesan rekaman bioakustik 48 kHz / 24-bit dari hydrophone mooring ASIK. Mendeteksi
            letupan snapping shrimp, komunikasi vocal karang famili Pomacentridae, dan indeks ACI.
          </p>
        </div>

        {/* Play, Volume, & Spectrogram Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSpectrogramModal(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Lihat Spektrogram 4 Kanal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              syncGain(nextMuted, volume);
            }}
            aria-label={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            )}
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
              syncGain(nextVol === 0, nextVol);
            }}
            className="w-20 sm:w-24 accent-cyan-400 cursor-pointer"
          />

          <button
            type="button"
            onClick={togglePlay}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/50'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 ring-2 ring-cyan-400/50'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Hentikan Audio' : 'Putar Audio Lapangan'}</span>
          </button>
        </div>
      </div>

      {/* 4 Sample Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {SAMPLES.map((sample) => {
          const isSelected = selectedSample.id === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`min-h-[44px] p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-xl shadow-cyan-950/60 ring-1 ring-cyan-400/40'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-xs text-cyan-300 truncate">
                  {sample.condition}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    sample.condition === 'Sangat Tinggi'
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700'
                      : sample.condition === 'Tinggi'
                      ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-700'
                      : sample.condition === 'Sedang'
                      ? 'bg-amber-950/90 text-amber-300 border border-amber-700'
                      : 'bg-rose-950/90 text-rose-300 border border-rose-700'
                  }`}
                >
                  ACI {sample.aciScore}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                {sample.name}
              </h4>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{sample.station}</span>
                <span className="font-mono text-cyan-400">{sample.snapsCount} snaps</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visualizer Screens (Time-Domain Waveform & Live Spectrogram Waterfall) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Waveform Canvas */}
        <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800/90 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Waveform Gelombang Akustik (Domain Waktu)</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {isPlaying ? '● REALTIME' : 'STANDBY'}
            </span>
          </div>
          <canvas
            ref={canvasWaveRef}
            width={480}
            height={130}
            className="w-full h-[125px] rounded-xl bg-slate-950 block"
          />
        </div>

        {/* FFT Waterfall Spectrogram Canvas */}
        <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800/90 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-purple-400" />
              <span>Spektrogram Frekuensi FFT (Waterfall)</span>
            </span>
            <span className="text-[10px] font-mono text-purple-400">20 Hz – 20 kHz</span>
          </div>
          <canvas
            ref={canvasSpecRef}
            width={480}
            height={130}
            className="w-full h-[125px] rounded-xl bg-slate-950 block"
          />
        </div>
      </div>

      {/* Real Acoustic Metrics & Breakdown from reefsight_metadata.json */}
      <div className="mt-4 p-4 sm:p-5 bg-slate-800/50 rounded-2xl border border-slate-700/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/50 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Parameter Fisik Rekaman Audio
              </span>
              <span className="text-[10px] font-mono text-slate-400">{selectedSample.duration}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {selectedSample.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 block uppercase font-medium">RMS dBFS</span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {selectedSample.rmsDb} dB
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 block uppercase font-medium">Peak dBFS</span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {selectedSample.peakDb} dB
              </span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-center">
              <span className="text-[9px] text-cyan-400 block uppercase font-medium">ACI Score</span>
              <span className="text-sm font-mono font-black text-cyan-200">
                {selectedSample.aciScore}
              </span>
            </div>
          </div>
        </div>

        {/* Acoustic Sound Source Categorical Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Letupan Udang Pistol (Snaps)</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {selectedSample.snapsCount}{' '}
              <span className="text-xs font-normal text-slate-400">snaps / 45s</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Frekuensi tinggi (2–16 kHz) penanda habitat terumbu terkolonisasi.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Vokalisasi Ikan Karang</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {selectedSample.fishSoundsTotal}{' '}
              <span className="text-xs font-normal text-slate-400">panggilan</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {selectedSample.fishSoundsDetail.pop} pop, {selectedSample.fishSoundsDetail.knock} knock,{' '}
              {selectedSample.fishSoundsDetail.grunt} grunt, {selectedSample.fishSoundsDetail.scrape} scrape.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Biota Bentik & Substrat</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {selectedSample.benthicDetail.click + selectedSample.benthicDetail.crunch}{' '}
              <span className="text-xs font-normal text-slate-400">suara bentik</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {selectedSample.benthicDetail.click} click, {selectedSample.benthicDetail.crunch} crunch
              (grazing bulu babi & siput karang).
            </p>
          </div>
        </div>
      </div>

      {/* Modal View for reef_spectrograms.png */}
      {showSpectrogramModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spektrogram Komprehensif Pulau Tunda"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowSpectrogramModal(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[90dvh] overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Waves className="w-5 h-5 text-cyan-400" />
                  <span>Spektrogram Bioakustik 4 Tingkat Aktivitas Terumbu Pulau Tunda</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Visualisasi Fourier Transform (FFT) dari 4 file audio WAV lapangan (0 Hz – 20 kHz).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSpectrogramModal(false)}
                aria-label="Tutup spektrogram"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src="/soundscape/reef_spectrograms.png"
                alt="REEFSIGHT Bioacoustic Spectrogram 4 Levels"
                width={1200}
                height={700}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-cyan-300">Catatan Analisis:</span> Spektrogram
              memperlihatkan kepadatan energi frekuensi tinggi pada kondisi <i>Very High</i> dan{' '}
              <i>High</i> yang dihasilkan dari jutaan micro-bubble snapping shrimp, serta pola garis
              harmonik vertikal pendek yang merupakan signature bioakustik famili ikan terumbu karang.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
