'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Minus, AlertOctagon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrustScoreProps {
  score: number;
}

function getConfig(score: number) {
  if (score >= 70) return {
    stroke: '#22C55E', glow: 'rgba(34,197,94,0.35)',
    text: '#22C55E', bg: 'rgba(34,197,94,0.10)',
    label: 'High Credibility', sublabel: 'Content is likely trustworthy',
    icon: <TrendingUp className="w-4 h-4" />,
    gradient: ['#22C55E', '#15803D'],
    tier: 'HIGH',
  };
  if (score >= 40) return {
    stroke: '#F59E0B', glow: 'rgba(245,158,11,0.35)',
    text: '#F59E0B', bg: 'rgba(245,158,11,0.10)',
    label: 'Moderate Risk', sublabel: 'Verify before sharing',
    icon: <Minus className="w-4 h-4" />,
    gradient: ['#F59E0B', '#B45309'],
    tier: 'MED',
  };
  return {
    stroke: '#EF4444', glow: 'rgba(239,68,68,0.35)',
    text: '#EF4444', bg: 'rgba(239,68,68,0.10)',
    label: 'Low Credibility', sublabel: 'High misinformation risk',
    icon: <TrendingDown className="w-4 h-4" />,
    gradient: ['#EF4444', '#991B1B'],
    tier: 'LOW',
  };
}

// Animated number counter
function Counter({ target, delay = 0.3 }: { target: number; delay?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        start = Math.min(start + step, target);
        setDisplay(Math.round(start));
        if (start >= target) clearInterval(interval);
      }, 16);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, delay]);

  return <>{display}</>;
}

export default function TrustScore({ score }: TrustScoreProps) {
  const cfg         = getConfig(score);
  const radius      = 72;
  const strokeW     = 10;
  const size        = (radius + strokeW) * 2 + 4;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (score / 100) * circumference;

  // Sub-metrics derived from trust score
  const metrics = [
    { label: 'Source Reliability',  value: Math.min(99, score + 5),             color: cfg.stroke },
    { label: 'Factual Accuracy',    value: Math.min(99, score - 3),             color: cfg.stroke },
    { label: 'Context Integrity',   value: Math.min(99, Math.max(5, score - 8)), color: cfg.stroke },
    { label: 'Emotional Language',  value: Math.min(99, Math.max(5, 95 - score)), color: score < 40 ? '#EF4444' : '#22C55E' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${cfg.stroke}20` }}>
          <Shield className="w-4 h-4" style={{ color: cfg.stroke }} />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Trust Score</h3>
        <span
          className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest"
          style={{ background: cfg.bg, color: cfg.text }}
        >
          {cfg.tier}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">

        {/* ── Radial meter ───────────────────────────────────────── */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>

          {/* Outer glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: cfg.glow, filter: 'blur(18px)' }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.92, 1.04, 0.92] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <svg width={size} height={size} className="-rotate-90" style={{ position: 'relative', zIndex: 1 }}>
            <defs>
              <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor={cfg.gradient[0]} />
                <stop offset="100%" stopColor={cfg.gradient[1]} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Track */}
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="var(--bg-border)" strokeWidth={strokeW}
            />

            {/* Segment ticks */}
            {[0, 40, 70].map((pct, i) => {
              const angle  = (pct / 100) * 2 * Math.PI - Math.PI / 2;
              const x1 = size / 2 + (radius - strokeW / 2 - 2) * Math.cos(angle);
              const y1 = size / 2 + (radius - strokeW / 2 - 2) * Math.sin(angle);
              const x2 = size / 2 + (radius + strokeW / 2 + 2) * Math.cos(angle);
              const y2 = size / 2 + (radius + strokeW / 2 + 2) * Math.sin(angle);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="var(--bg-primary)" strokeWidth="2" />
              );
            })}

            {/* Progress arc */}
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="url(#trustGrad)" strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              filter="url(#glow)"
            />
          </svg>

          {/* Center display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <motion.div
              className="text-5xl font-black tabular-nums"
              style={{ color: cfg.text }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'backOut' }}
            >
              <Counter target={score} delay={0.5} />
            </motion.div>
            <span className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>/&nbsp;100</span>
            <motion.span
              className="text-[9px] font-bold uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-full"
              style={{ background: cfg.bg, color: cfg.text }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {cfg.tier}
            </motion.span>
          </div>
        </div>

        {/* ── Right side: label + bars ────────────────────────────── */}
        <div className="flex-1 w-full space-y-4">

          {/* Status label */}
          <motion.div
            className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: cfg.bg, border: `1px solid ${cfg.stroke}30` }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span style={{ color: cfg.text }}>{cfg.icon}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: cfg.text }}>{cfg.label}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{cfg.sublabel}</p>
            </div>
          </motion.div>

          {/* Sub-metric bars */}
          <div className="space-y-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span className="font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-border)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${m.color}99, ${m.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1.2, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Danger banner for very low scores */}
          {score < 35 && (
            <motion.div
              className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#EF4444' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Do not share — high misinformation risk detected</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
