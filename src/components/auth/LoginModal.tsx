'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types/reefsight';
import { X, Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  activeRole,
  onSelectRole
}: LoginModalProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('admin');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRole(selectedDemoRole);
    onClose();
  };

  const handleDirectRolePick = (role: UserRole) => {
    setSelectedDemoRole(role);
    onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Container matching image1.jpeg split-screen layout */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-2">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Left Column: Visual Ocean Hero with Typography */}
        <div className="relative hidden md:flex flex-col justify-end p-8 lg:p-10 text-white overflow-hidden bg-slate-900">
          {/* Background Coral Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('/images/image1.jpeg')`
            }}
          />
          {/* Oceanic Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Typography matching image1.jpeg */}
          <div className="relative z-10 space-y-3">
            {/* Orange bar */}
            <div className="w-12 h-1.5 bg-orange-500 rounded-full" />
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              REEFSIGHT
            </h2>
            <p className="text-sm lg:text-base font-semibold text-slate-100 leading-snug">
              Pengembangan Platform Kecerdasan Ekologis untuk Ekosistem Terumbu Karang Pulau Tunda
            </p>
            <p className="text-xs text-slate-300 italic leading-relaxed pt-1 border-t border-white/20">
              Integrated marine ecological intelligence for understanding coral reef dynamics through acoustic, optical, spatial, and environmental data.
            </p>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="p-8 lg:p-10 flex flex-col justify-between bg-white text-slate-900">
          <div>
            {/* Logo & Platform Name */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 flex items-center justify-center text-white text-xl shadow-md shadow-orange-500/20">
                🪸
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  REEFSIGHT
                </h1>
                <p className="text-[11px] font-medium text-slate-500">
                  Ecological Intelligence Platform
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Welcome Back</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sign in to access your REEFSIGHT workspace.
              </p>
            </div>

            {/* Quick Demo Role Selector Pills */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pilih Akses Pengguna (RBAC)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { role: 'admin', label: 'Administrator', icon: Shield, color: 'border-purple-300 text-purple-700 bg-purple-50/50' },
                  { role: 'peneliti_ekologi', label: 'Peneliti Ekologi', icon: CheckCircle2, color: 'border-blue-300 text-blue-700 bg-blue-50/50' },
                  { role: 'operator_lapangan', label: 'Operator Lapangan', icon: CheckCircle2, color: 'border-amber-300 text-amber-700 bg-amber-50/50' },
                  { role: 'validator_data', label: 'Validator Data', icon: CheckCircle2, color: 'border-emerald-300 text-emerald-700 bg-emerald-50/50' }
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedDemoRole(item.role as UserRole)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-left font-medium transition-all ${
                      selectedDemoRole === item.role
                        ? 'border-orange-500 bg-orange-50/80 text-orange-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={14} className={selectedDemoRole === item.role ? 'text-orange-600' : 'text-slate-400'} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Enter your username or email"
                    defaultValue="reza.gading@reefsight.id"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    defaultValue="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Silakan hubungi Administrator REEFSIGHT untuk reset kata sandi akun.');
                  }}
                  className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-orange-500/30 hover:from-orange-600 hover:to-rose-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                Sign In to REEFSIGHT
              </button>
            </form>
          </div>

          {/* Footer Back Link */}
          <div className="pt-6 text-center border-t border-slate-100 mt-4">
            <button
              onClick={() => {
                onSelectRole('public');
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Public Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
