'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, Cpu } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import ClaimsExtraction from './ClaimsExtraction';
import TrustScore from './TrustScore';
import FactVerification from './FactVerification';
import Explanation from './Explanation';
import ViralityRisk from './ViralityRisk';
import ContextAnalysis from './ContextAnalysis';
import CounterMessage from './CounterMessage';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const SECTION_LABELS: Record<string, string> = {
  claims: '01 · Claims',
  trust: '02 · Trust',
  fact: '03 · Verification',
  explanation: '04 · Explanation',
  virality: '05 · Virality',
  context: '06 · Context',
  counter: '07 · Counter',
};

function SectionCard({
  id,
  label,
  children,
  delay = 0,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="glass rounded-2xl p-6 card-hover"
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>{label}</div>
      {children}
    </motion.div>
  );
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const topRef = useRef<HTMLDivElement>(null);

  const trustColor =
    result.trustScore >= 70 ? '#22C55E' : result.trustScore >= 40 ? '#F59E0B' : '#EF4444';

  const trustLabel =
    result.trustScore >= 70 ? 'Credible' : result.trustScore >= 40 ? 'Questionable' : 'Misinformation';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-24" ref={topRef}>
      {/* Results header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: trustColor, boxShadow: `0 0 8px ${trustColor}` }}
              />
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Analysis Complete</h2>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: `${trustColor}22`,
                  color: trustColor,
                  border: `1px solid ${trustColor}44`,
                }}
              >
                {trustLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{(result.processingTime / 1000).toFixed(1)}s processing time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3" />
                <span className="font-mono">{result.modelVersion}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="uppercase font-semibold">{result.language}</span>
                <span>·</span>
                <span className="capitalize">{result.inputType}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              id="reset-btn"
              className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--bg-border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
            >
              <RotateCcw className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Original input preview */}
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Analyzed Input</p>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{result.originalInput}</p>
        </div>
      </motion.div>

      {/* Top summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: 'Trust Score',
            value: `${result.trustScore}/100`,
            sub: trustLabel,
            color: trustColor,
          },
          {
            label: 'Claims Found',
            value: result.claims.length.toString(),
            sub: `${result.claims.filter(c => c.status === 'False' || c.status === 'Misleading').length} flagged`,
            color: '#4F8EFF',
          },
          {
            label: 'Virality Risk',
            value: result.viralityRisk.level,
            sub: `Score: ${result.viralityRisk.score}/100`,
            color: result.viralityRisk.level === 'High' ? '#EF4444' : result.viralityRisk.level === 'Medium' ? '#F59E0B' : '#22C55E',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4"
            style={{ border: '1px solid var(--glass-border)' }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard id="section-claims" label={SECTION_LABELS.claims} delay={0.1}>
          <ClaimsExtraction claims={result.claims} />
        </SectionCard>

        <SectionCard id="section-trust" label={SECTION_LABELS.trust} delay={0.15}>
          <TrustScore score={result.trustScore} />
        </SectionCard>

        <SectionCard id="section-fact" label={SECTION_LABELS.fact} delay={0.2}>
          <FactVerification data={result.factVerification} />
        </SectionCard>

        <SectionCard id="section-explanation" label={SECTION_LABELS.explanation} delay={0.25}>
          <Explanation data={result.explanation} />
        </SectionCard>

        <SectionCard id="section-virality" label={SECTION_LABELS.virality} delay={0.3}>
          <ViralityRisk data={result.viralityRisk} />
        </SectionCard>

        <SectionCard id="section-context" label={SECTION_LABELS.context} delay={0.35}>
          <ContextAnalysis data={result.contextAnalysis} />
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard id="section-counter" label={SECTION_LABELS.counter} delay={0.4}>
            <CounterMessage data={result.counterMessage} />
          </SectionCard>
        </div>
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Analysis powered by <span className="text-[#4F8EFF]">mitra-v2.1.0-multimodal</span> · Results are AI-generated and should be independently verified · Not legal advice
      </motion.div>
    </div>
  );
}
