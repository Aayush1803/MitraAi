'use client';

import { motion } from 'framer-motion';
import { MapPin, AlertCircle } from 'lucide-react';
import { ContextAnalysis as ContextAnalysisType } from '@/lib/types';

interface ContextAnalysisProps {
  data: ContextAnalysisType;
}

export default function ContextAnalysis({ data }: ContextAnalysisProps) {
  const sensitivityLevel = data.sensitivity.startsWith('HIGH')
    ? 'high'
    : data.sensitivity.startsWith('MEDIUM')
    ? 'medium'
    : 'low';

  const sensitivityConfig = {
    high: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
    low: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-400' },
  }[sensitivityLevel];

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Context Analysis</h3>
        <span
          className="ml-1 text-xs rounded px-2 py-0.5"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}
        >
          India-specific
        </span>
      </div>

      <div className="space-y-3">
        {/* Regional context */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-cyan-500 uppercase tracking-wide mb-1.5">Regional Context</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.regional}</p>
            </div>
          </div>
        </motion.div>

        {/* Cultural context */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs">🇮🇳</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1.5">Cultural Framing</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.cultural}</p>
            </div>
          </div>
        </motion.div>

        {/* Sensitivity alert */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 border rounded-xl ${sensitivityConfig.bg}`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${sensitivityConfig.color}`} />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className={`text-xs font-semibold uppercase tracking-wide ${sensitivityConfig.color}`}>
                  Sensitivity Assessment
                </p>
                <div className={`w-1.5 h-1.5 rounded-full ${sensitivityConfig.dot} animate-pulse`} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.sensitivity}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
