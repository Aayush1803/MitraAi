'use client';

import { motion } from 'framer-motion';
import { CheckSquare, ExternalLink } from 'lucide-react';
import { FactVerification as FactVerificationType } from '@/lib/types';

interface FactVerificationProps {
  data: FactVerificationType;
}

const LOGO_COLORS: Record<string, string> = {
  R: '#FF8C00', P: '#1E40AF', A: '#16A34A', W: '#0EA5E9',
  B: '#DC2626', S: '#7C3AED', F: '#059669', I: '#2563EB',
};

export default function FactVerification({ data }: FactVerificationProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
          <CheckSquare className="w-4 h-4 text-green-400" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Fact Verification</h3>
      </div>

      {/* Corrected fact */}
      <div className="p-4 border border-green-500/20 rounded-xl mb-5 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600 rounded-l-xl" />
        <div className="pl-3">
          <p className="text-xs font-semibold text-green-500 mb-2 uppercase tracking-wide">Verified Information</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.correctedFact}</p>
        </div>
      </div>

      {/* Sources */}
      <div>
        <p className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Trusted Sources</p>
        <div className="grid grid-cols-2 gap-3">
          {data.sources.map((source, i) => (
            <motion.a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,142,255,0.4)'; e.currentTarget.style.background = 'rgba(79,142,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: LOGO_COLORS[source.logo] || '#4F8EFF' }}
              >
                {source.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium transition-colors truncate" style={{ color: 'var(--text-primary)' }}>
                  {source.name}
                </p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{source.url.replace('https://', '').split('/')[0]}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-[#4F8EFF] transition-colors" style={{ color: 'var(--text-muted)' }} />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
