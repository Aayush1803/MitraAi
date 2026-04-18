'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Smile, ChevronDown } from 'lucide-react';
import { Explanation as ExplanationType } from '@/lib/types';

interface ExplanationProps {
  data: ExplanationType;
}

export default function Explanation({ data }: ExplanationProps) {
  const [eli10Open, setEli10Open] = useState(true);

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-indigo-400" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Explanation</h3>
      </div>

      <div className="space-y-4">
        {/* Detailed explanation */}
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#4F8EFF]" />
            <span className="text-xs font-semibold text-[#4F8EFF] uppercase tracking-wide">Detailed Analysis</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.detailed}</p>
        </div>

        {/* ELI10 collapsible */}
        <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl overflow-hidden">
          <button
            onClick={() => setEli10Open(!eli10Open)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Smile className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">ELI10 — Explain Like I&apos;m 10</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-yellow-400 transition-transform duration-200 ${eli10Open ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {eli10Open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="px-4 pb-4 border-t border-yellow-500/10">
                  <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>{data.eli10}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
