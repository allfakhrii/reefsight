'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('REEFSIGHT runtime boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 shadow-lg p-6 sm:p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle size={26} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Terjadi Kendala Pada Tampilan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Halaman mengalami gangguan sementara saat memuat komponen interaktif. Data utama tetap aman dan Anda dapat memuat ulang tampilan ini.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <RotateCcw size={16} />
            <span>Coba Muat Ulang</span>
          </button>
          <Link
            href="/"
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Home size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
