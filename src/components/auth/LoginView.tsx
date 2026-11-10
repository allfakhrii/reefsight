'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types/reefsight';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Activity,
  User,
  Building,
  Phone,
  AlertCircle,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';

interface LoginViewProps {
  onSuccess: (role: UserRole) => void;
  onBackToPublic: () => void;
  currentRole?: UserRole;
  initialMode?: 'login' | 'register';
}

export default function LoginView({
  onSuccess,
  onBackToPublic,
  currentRole = 'admin',
  initialMode = 'login'
}: LoginViewProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');

  // Sign In state
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [usernameOrEmail, setUsernameOrEmail] = useState('reza.gading@reefsight.id');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstitution, setRegInstitution] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('peneliti_ekologi');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRoleClick = (role: UserRole, email: string) => {
    setSelectedRole(role);
    setUsernameOrEmail(email);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(selectedRole);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan kata sandi.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password minimal harus 6 karakter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda wajib menyetujui Kaidah Etika Penelitian REEFSIGHT.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          username: regUsername || regEmail.split('@')[0],
          email: regEmail,
          institution: regInstitution,
          role: regRole,
          password: regPassword
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Gagal mendaftarkan akun.');
      }

      setSuccessMessage('Pendaftaran berhasil! Akun Anda telah terdaftar di Supabase Cloud.');
      setTimeout(() => {
        // Auto-switch to login or directly log user in with newly registered role
        onSuccess(regRole);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi gangguan jaringan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden animate-fadeIn">
      {/* ======================================================== */}
      {/* LEFT COLUMN: 54% Full-Bleed Underwater Coral Reef Hero    */}
      {/* Exactly matching image1.jpeg                              */}
      {/* ======================================================== */}
      <div className="relative hidden lg:flex lg:w-[54%] h-full bg-slate-950 flex-col justify-end p-12 xl:p-16 text-white overflow-hidden select-none">
        {/* Full Bleed High-Res Coral Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 hover:scale-105"
          style={{
            backgroundImage: `url('/images/login_hero_bg.jpeg')`
          }}
        />

        {/* Gentle Ambient Overlay Gradient for Sunlight Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />

        {/* Typography from image1.jpeg */}
        <div className="relative z-10 max-w-xl space-y-4 drop-shadow-md">
          {/* Coral Orange Accent Bar */}
          <div className="w-16 h-1.5 bg-orange-500 rounded-full shadow-sm" />

          {/* Heading */}
          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-none">
            REEFSIGHT
          </h1>

          {/* Subtitle */}
          <p className="text-lg xl:text-xl font-bold text-slate-100 leading-snug">
            Pengembangan Platform Kecerdasan Ekologis untuk Ekosistem Terumbu Karang Pulau Tunda
          </p>

          {/* Italic Scientific Description */}
          <p className="text-xs xl:text-sm text-slate-200/90 italic leading-relaxed pt-2 border-t border-white/20">
            Integrated marine ecological intelligence for understanding coral reef dynamics through acoustic, optical, spatial, and environmental data.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 46% Crisp Clean White Form Canvas           */}
      {/* Exactly matching image1.jpeg                              */}
      {/* ======================================================== */}
      <div className="flex-1 w-full lg:w-[46%] h-full bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 overflow-y-auto scrollbar-thin">
        {/* Top bar with back and close button */}
        <div className="flex items-center justify-between mb-4 w-full">
          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Public Workspace</span>
          </button>

          <button
            onClick={onBackToPublic}
            aria-label="Tutup Halaman"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-5">
          {/* Brand Header with Clean Emblem from image1.jpeg */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs flex-shrink-0">
              <img
                src="/brand/reefsight-icon.svg"
                alt="REEFSIGHT Coral Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                REEFSIGHT
              </span>
              <span className="text-xs text-slate-500 font-medium leading-normal mt-0.5">
                Ecological Intelligence Platform
              </span>
            </div>
          </div>

          {/* Mode Header */}
          {!isRegisterMode ? (
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sign in to access your REEFSIGHT workspace.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles size={11} /> Pendaftaran Peneliti & Mitra
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Buat Akun Baru
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Daftarkan akun untuk berkolaborasi dalam penelitian terumbu karang Pulau Tunda.
              </p>
            </div>
          )}

          {/* Alert / Feedback message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="flex-shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB A: SIGN IN FORM                                      */}
          {/* ======================================================== */}
          {!isRegisterMode && (
            <>
              {/* Quick RBAC Role Selector Pills matching image1.jpeg */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Akses Pengguna (RBAC)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleRoleClick('admin', 'reza.gading@reefsight.id')}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all flex items-center gap-2 ${
                      selectedRole === 'admin'
                        ? 'border-orange-500 bg-orange-50/80 text-orange-800 shadow-xs ring-1 ring-orange-500/30'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Shield size={14} className={selectedRole === 'admin' ? 'text-orange-600' : 'text-slate-400'} />
                    <span className="truncate">Administrator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleClick('peneliti_ekologi', 'aulia.rahma@reefsight.id')}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all flex items-center gap-2 ${
                      selectedRole === 'peneliti_ekologi'
                        ? 'border-orange-500 bg-orange-50/80 text-orange-800 shadow-xs ring-1 ring-orange-500/30'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Activity size={14} className={selectedRole === 'peneliti_ekologi' ? 'text-orange-600' : 'text-slate-400'} />
                    <span className="truncate">Peneliti Ekologi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleClick('operator_lapangan', 'dimas.p@reefsight.id')}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all flex items-center gap-2 ${
                      selectedRole === 'operator_lapangan'
                        ? 'border-orange-500 bg-orange-50/80 text-orange-800 shadow-xs ring-1 ring-orange-500/30'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Camera size={14} className={selectedRole === 'operator_lapangan' ? 'text-orange-600' : 'text-slate-400'} />
                    <span className="truncate">Operator Lapangan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleClick('validator_data', 'sinta.n@reefsight.id')}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all flex items-center gap-2 ${
                      selectedRole === 'validator_data'
                        ? 'border-orange-500 bg-orange-50/80 text-orange-800 shadow-xs ring-1 ring-orange-500/30'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 size={14} className={selectedRole === 'validator_data' ? 'text-orange-600' : 'text-slate-400'} />
                    <span className="truncate">Validator Data</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Username or Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="Enter your username or email"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <span className="font-medium">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Fitur pemulihan kata sandi: Silakan hubungi Administrator REEFSIGHT di admin@reefsight.id untuk reset akun.')}
                    className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F05A28] to-[#EA580C] hover:from-[#ea501d] hover:to-[#d84e09] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <span>Sign In to REEFSIGHT</span>
                </button>
              </form>

              {/* Toggle to Register Form */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Belum memiliki akun terdaftar?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setIsRegisterMode(true);
                    }}
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Daftar Akun Baru
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB B: REGISTER ACCOUNT FORM                             */}
          {/* ======================================================== */}
          {isRegisterMode && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Nama Lengkap & Gelar</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Dr. Budi Santoso S.Kel"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Username</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="budi.santoso"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Email Instansi / Resmi</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="budi@brin.go.id"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Institusi / Universitas / Komunitas</label>
                <div className="relative">
                  <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regInstitution}
                    onChange={(e) => setRegInstitution(e.target.value)}
                    placeholder="e.g. Pusat Riset Kelautan BRIN / Universitas Pendidikan Indonesia"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Role Requested Selection */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Fungsi / Peran dalam Platform</label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {[
                    { role: 'peneliti_ekologi', label: 'Peneliti Ekologi', desc: 'Analisis & Bioakustik' },
                    { role: 'operator_lapangan', label: 'Operator Lapangan', desc: 'Pengumpulan Data Buoy' },
                    { role: 'validator_data', label: 'Validator Data', desc: 'Pemeriksaan QA/QC' }
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRegRole(r.role as UserRole)}
                      className={`p-2 rounded-xl border text-left font-medium transition-all ${
                        regRole === r.role
                          ? 'border-orange-500 bg-orange-50 text-orange-900 ring-1 ring-orange-500/30'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold leading-tight">{r.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Konfirmasi Kata Sandi</label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                  />
                  <span>
                    Saya menyetujui Kaidah Etika Penelitian & Integritas Data Ekologis Terumbu Karang Pulau Tunda (Separation of Duties).
                  </span>
                </label>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F05A28] to-[#EA580C] hover:from-[#ea501d] hover:to-[#d84e09] text-white font-bold text-xs shadow-md shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Mendaftarkan ke Supabase...</span>
                  </>
                ) : (
                  <span>Daftar Akun REEFSIGHT</span>
                )}
              </button>

              {/* Back to Login Toggle */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Sudah memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setIsRegisterMode(false);
                    }}
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Masuk ke Workspace
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Back Link to Public Workspace */}
        <div className="pt-5 text-center border-t border-slate-100 mt-5">
          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={16} className="text-slate-500 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Public Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
