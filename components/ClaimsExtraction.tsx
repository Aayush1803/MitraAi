'use client';

import { motion } from 'framer-motion';
import { List, CheckCircle2, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { Claim, ClaimStatus } from '@/lib/types';

interface ClaimsExtractionProps {
  claims: Claim[];
}

const STATUS_CONFIG: Record<ClaimStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  barColor: string;
}> = {
  True: {
    label: 'TRUE',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.30)',
    barColor: '#22C55E',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  False: {
    label: 'FALSE',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.30)',
    barColor: '#EF4444',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  Misleading: {
    label: 'MISLEADING',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.30)',
    barColor: '#F59E0B',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  Opinion: {
    label: 'OPINION',
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.10)',
    border: 'rgba(129,140,248,0.30)',
    barColor: '#818CF8',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
  },
};

// Confidence label
function confidenceLabel(confidence: number): string {
  if (confidence >= 90) return 'Very High';
  if (confidence >= 75) return 'High';
  if (confidence >= 60) return 'Moderate';
  if (confidence >= 40) return 'Low';
  return 'Very Low';
}

export default function ClaimsExtraction({ claims }: ClaimsExtractionProps) {
  const counts = claims.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; },
    {} as Record<ClaimStatus, number>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[#4F8EFF]/20 flex items-center justify-center">
          <List className="w-4 h-4 text-[#4F8EFF]" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Claims Extracted</h3>
        <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {claims.length} claim{claims.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.keys(counts) as ClaimStatus[]).map(status => {
          const cfg = STATUS_CONFIG[status];
          return (
            <motion.span
              key={status}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {cfg.icon}
              {counts[status]} {status}
            </motion.span>
          );
        })}
      </div>

      {/* Claims list */}
      <div className="space-y-3">
        {claims.map((claim, i) => {
          const cfg        = STATUS_CONFIG[claim.status];
          const confidence = claim.confidence ?? 70;

          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: 'easeOut' }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid var(--bg-border)`,
              }}
            >
              {/* Top accent bar — full-width, thin */}
              <motion.div
                className="h-0.5"
                style={{ background: cfg.color, opacity: 0.7, transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: 'easeOut' }}
              />

              <div className="p-4">
                {/* Row 1: number + badge + claim text */}
                <div className="flex gap-3 mb-3">
                  {/* Index */}
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {i + 1}
                  </div>

                  {/* Claim text */}
                  <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {claim.text}
                  </p>

                  {/* Status badge */}
                  <div
                    className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg self-start whitespace-nowrap"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    <span style={{ color: cfg.color }}>{cfg.icon}</span>
                    {cfg.label}
                  </div>
                </div>

                {/* Row 2: Confidence bar */}
                <div className="pl-9">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span style={{ color: 'var(--text-muted)' }}>
                      AI Confidence
                    </span>
                    <span className="font-mono font-bold" style={{ color: cfg.color }}>
                      {confidence}% &nbsp;
                      <span className="font-normal opacity-70">{confidenceLabel(confidence)}</span>
                    </span>
                  </div>

                  {/* Bar track */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-border)' }}>
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{
                        background: `linear-gradient(90deg, ${cfg.color}70, ${cfg.color})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{
                        duration: 1.0,
                        delay: i * 0.08 + 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-y-0 w-8 right-0"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${cfg.color}60, transparent)`,
                        }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: i * 0.08 + 1.2, duration: 0.6 }}
                      />
                    </motion.div>
                  </div>

                  {/* Confidence ticks */}
                  <div className="flex justify-between mt-1">
                    {[0, 25, 50, 75, 100].map(tick => (
                      <span key={tick} className="text-[9px] font-mono" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                        {tick === 0 || tick === 100 ? tick : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
