'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, AlertCircle, Check, Loader2, Zap,
} from 'lucide-react';

const FEATURES = [
  { icon: '🔍', title: '9-Step AI Pipeline', desc: 'Claims extraction, verification & trust scoring' },
  { icon: '🌐', title: '23 Languages', desc: 'All 23 official Indian languages supported' },
  { icon: '⚡', title: 'Real-time Analysis', desc: 'Results in under 5 seconds' },
  { icon: '🛡️', title: 'India-First Context', desc: 'Tuned for regional misinformation patterns' },
];

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect authenticated users directly to analyzer
  useEffect(() => {
    if (status === 'authenticated') router.push('/analyze');
  }, [status, router]);

  const update = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
  };

  const validateForm = () => {
    if (!form.email || !form.password) return 'Email and password are required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (mode === 'signup') {
      if (!form.name.trim()) return 'Please enter your name.';
      if (form.password !== form.confirm) return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      name: form.name,
      email: form.email,
      password: form.password,
      mode,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(mode === 'signup' ? 'Account created! Redirecting...' : 'Welcome back! Redirecting...');
      setTimeout(() => router.push('/analyze'), 1000);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/analyze' });
  };

  const passwordStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'][strength];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4F8EFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL — Branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#4F8EFF]/8 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#7C3AED]/8 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Mitra <span className="text-[#4F8EFF]">AI</span></span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              Fight<br />
              <span className="gradient-text">misinformation</span>
              <br />with AI.
            </h1>
            <p className="text-[#8A8AA0] text-lg leading-relaxed max-w-sm">
              India&apos;s most advanced multimodal fact-checking platform. Analyze claims in seconds.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#111118] border border-[#1E1E2E] flex items-center justify-center text-xl flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-[#4A4A60] text-xs mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          {[['23', 'Languages'], ['9-Step', 'AI pipeline'], ['<5s', 'Avg. response']].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-black gradient-text">{v}</div>
              <div className="text-xs text-[#4A4A60] mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Auth Form ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 bg-[#0D0D14]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4F8EFF]/4 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Mitra <span className="text-[#4F8EFF]">AI</span></span>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-[#111118] border border-[#1E1E2E] rounded-2xl p-1 mb-8">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white shadow-lg'
                    : 'text-[#8A8AA0] hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-7">
                <h2 className="text-2xl font-black text-white">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-sm text-[#8A8AA0] mt-1.5">
                  {mode === 'login'
                    ? 'Sign in to access your analysis history and saved reports.'
                    : 'Start fact-checking misinformation across India — for free.'}
                </p>
              </div>

              {/* Google button */}
              <button
                id="google-signin-btn"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3.5 rounded-xl transition-all duration-200 mb-5 shadow-lg shadow-black/20 disabled:opacity-70"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#1E1E2E]" />
                <span className="text-xs text-[#4A4A60] font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-[#1E1E2E]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InputField
                        id="name-input"
                        icon={<User className="w-4 h-4" />}
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={v => update('name', v)}
                        autoComplete="name"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField
                  id="email-input"
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={v => update('email', v)}
                  autoComplete="email"
                />

                <div className="space-y-1.5">
                  <InputField
                    id="password-input"
                    icon={<Lock className="w-4 h-4" />}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password (min. 8 characters)"
                    value={form.password}
                    onChange={v => update('password', v)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    suffix={
                      <button type="button" onClick={() => setShowPass(!showPass)} className="text-[#4A4A60] hover:text-[#8A8AA0] transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  {mode === 'signup' && form.password && (
                    <div className="flex items-center gap-2 px-1">
                      <div className="flex gap-1 flex-1">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? strengthColor : '#1E1E2E' }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium" style={{ color: strengthColor || '#4A4A60' }}>
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InputField
                        id="confirm-input"
                        icon={<Lock className="w-4 h-4" />}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={form.confirm}
                        onChange={v => update('confirm', v)}
                        autoComplete="new-password"
                        suffix={
                          form.confirm && form.password === form.confirm
                            ? <Check className="w-4 h-4 text-green-400" />
                            : null
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" className="text-xs text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <p className="text-sm text-green-400">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F8EFF] via-[#5B6EF7] to-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {mode === 'signup' && (
                <p className="text-xs text-[#4A4A60] text-center mt-4 leading-relaxed">
                  By creating an account you agree to our{' '}
                  <Link href="/about" className="text-[#4F8EFF]">Terms of Service</Link> and{' '}
                  <Link href="/about" className="text-[#4F8EFF]">Privacy Policy</Link>.
                </p>
              )}

              <p className="text-xs text-[#4A4A60] text-center mt-6">
                Learn more about Mitra AI —{' '}
                <Link href="/how-it-works" className="text-[#4F8EFF] hover:text-[#6BA3FF]">How it works</Link>
                {' · '}
                <Link href="/about" className="text-[#4F8EFF] hover:text-[#6BA3FF]">About</Link>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({
  id, icon, type, placeholder, value, onChange, autoComplete, suffix,
}: {
  id: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`flex items-center gap-3 bg-[#0A0A0F] border rounded-xl px-4 py-3.5 transition-all duration-200 ${
        focused ? 'border-[#4F8EFF] ring-1 ring-[#4F8EFF]/20' : 'border-[#1E1E2E] hover:border-[#2A2A3E]'
      }`}
    >
      <span className={`flex-shrink-0 transition-colors duration-200 ${focused ? 'text-[#4F8EFF]' : 'text-[#4A4A60]'}`}>
        {icon}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent text-sm text-white placeholder-[#4A4A60] focus:outline-none"
      />
      {suffix}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4F8EFF] animate-spin" />
      </div>
    }>
      <HomeInner />
    </Suspense>
  );
}
