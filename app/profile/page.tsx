'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  LogOut, Shield, BarChart3, Calendar, Mail,
  CheckCircle2, XCircle, AlertTriangle, Zap, User, ArrowLeft
} from 'lucide-react';
import NavBar from '@/components/NavBar';

/* ── Inline SVG Check for the avatar badge (avoids importing lucide Check) ── */
function CheckBadge({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ── Mock history data ──────────────────────────────────────────────────── */
const MOCK_HISTORY = [
  {
    id: 'a1', date: '2026-04-17', type: 'text', lang: 'EN',
    preview: 'Scientists discovered that drinking hot water with lemon cures cancer in 3 days...',
    trustScore: 12, verdict: 'False',
  },
  {
    id: 'a2', date: '2026-04-16', type: 'url', lang: 'HI',
    preview: 'https://example.com/breaking-news-viral-claim',
    trustScore: 48, verdict: 'Misleading',
  },
  {
    id: 'a3', date: '2026-04-15', type: 'text', lang: 'EN',
    preview: 'According to a peer-reviewed study published in Nature, climate change is accelerating...',
    trustScore: 87, verdict: 'True',
  },
  {
    id: 'a4', date: '2026-04-14', type: 'media', lang: 'TA',
    preview: '[Video] Statement by Minister regarding infrastructure development policy.mp4',
    trustScore: 62, verdict: 'Opinion',
  },
];

const VERDICT_CONFIG = {
  True:       { color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  False:      { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   icon: <XCircle className="w-3.5 h-3.5" /> },
  Misleading: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  Opinion:    { color: '#818CF8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#4F8EFF]/30 border-t-[#4F8EFF] animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user!;
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? '?').toUpperCase();

  const joinDate = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const stats = [
    { label: 'Analyses Run', value: '4', icon: <BarChart3 className="w-4 h-4" />, color: '#4F8EFF' },
    { label: 'Claims Flagged', value: '11', icon: <XCircle className="w-4 h-4" />, color: '#EF4444' },
    { label: 'Verified True', value: '3', icon: <CheckCircle2 className="w-4 h-4" />, color: '#22C55E' },
    { label: 'Member Since', value: joinDate, icon: <Calendar className="w-4 h-4" />, color: '#818CF8' },
  ];

  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16">
        {/* Mesh background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-[#4F8EFF]/8 to-[#7C3AED]/8 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 text-sm text-[#8A8AA0] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to analyzer
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {user.image ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] blur-md opacity-50 scale-110" />
                  <Image
                    src={user.image}
                    alt={user.name ?? 'User'}
                    width={96}
                    height={96}
                    className="relative w-24 h-24 rounded-full ring-4 ring-[#4F8EFF]/30 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-[#0A0A0F] flex items-center justify-center">
                    <CheckBadge className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] blur-md opacity-50 scale-110" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center text-3xl font-black text-white ring-4 ring-[#4F8EFF]/30">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 border-2 border-[#0A0A0F] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Name + meta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-white">{user.name ?? 'Mitra User'}</h1>
                <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/25 px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#8A8AA0]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#4F8EFF]" />
                  Mitra AI Member
                </span>
              </div>
            </motion.div>

            {/* Sign out */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm text-[#8A8AA0] hover:text-red-400 border border-[#1E1E2E] hover:border-red-500/30 px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl border border-white/[0.06] p-5 card-hover"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.color}22`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-xl font-black text-white leading-tight">{stat.value}</p>
              <p className="text-xs text-[#4A4A60] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Analysis history ───────────────────────────────────────────── */}
        <div id="analyses">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Recent Analyses</h2>
            <Link
              href="/analyze"
              className="flex items-center gap-1.5 text-sm text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              New Analysis
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_HISTORY.map((item, i) => {
              const v = VERDICT_CONFIG[item.verdict as keyof typeof VERDICT_CONFIG];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="glass rounded-2xl border border-white/[0.06] p-5 card-hover flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Trust score circle */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center"
                      style={{ background: `${v.color}15`, border: `1px solid ${v.border}` }}
                    >
                      <span className="text-xl font-black" style={{ color: v.color }}>
                        {item.trustScore}
                      </span>
                      <span className="text-[8px] text-[#4A4A60] font-mono">/100</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ color: v.color, background: v.bg, border: `1px solid ${v.border}` }}
                      >
                        {v.icon}
                        {item.verdict.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#4A4A60] uppercase font-mono bg-[#111118] border border-[#1E1E2E] px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-[#4A4A60] font-mono">{item.lang}</span>
                    </div>
                    <p className="text-sm text-[#8A8AA0] truncate">{item.preview}</p>
                  </div>

                  {/* Date */}
                  <div className="flex-shrink-0 text-xs text-[#4A4A60] font-mono whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Account details ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass rounded-2xl border border-white/[0.06] p-6"
        >
          <h2 className="text-lg font-bold text-white mb-5">Account Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Display Name', value: user.name ?? '—' },
              { label: 'Email Address',  value: user.email ?? '—' },
              { label: 'Account Type', value: user.image ? 'Google Account' : 'Email & Password' },
              { label: 'Account Plan', value: 'Free — Hackathon Edition' },
            ].map(field => (
              <div key={field.label} className="p-4 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl">
                <p className="text-xs text-[#4A4A60] uppercase tracking-wide font-semibold mb-1.5">{field.label}</p>
                <p className="text-sm text-white font-medium">{field.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

