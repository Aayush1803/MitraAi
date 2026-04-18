'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Brain, Waves, Eye, Database, Search, Shield, Zap } from 'lucide-react';

interface ProcessingStateProps {
  isVisible: boolean;
  currentStep: number;
}

const STEPS = [
  { id: 0, label: 'Input Preprocessing', sublabel: 'Tokenizing & normalizing content...', icon: <Zap className="w-4 h-4" />, color: '#4F8EFF' },
  { id: 1, label: 'Extracting Audio Track', sublabel: 'Separating audio from media stream...', icon: <Waves className="w-4 h-4" />, color: '#22D3EE' },
  { id: 2, label: 'Spectrogram Analysis', sublabel: 'Running audio fingerprint detection...', icon: <Waves className="w-4 h-4" />, color: '#6366F1' },
  { id: 3, label: 'Vision Transformer Pass', sublabel: 'Analyzing image & video frames for manipulation...', icon: <Eye className="w-4 h-4" />, color: '#8B5CF6' },
  { id: 4, label: 'NLP Claims Extraction', sublabel: 'Decomposing text into verifiable assertions...', icon: <Brain className="w-4 h-4" />, color: '#EC4899' },
  { id: 5, label: 'Querying Trusted Sources', sublabel: 'Cross-referencing Reuters, PTI, WHO databases...', icon: <Database className="w-4 h-4" />, color: '#F59E0B' },
  { id: 6, label: 'Virality Risk Modeling', sublabel: 'Computing social propagation score...', icon: <Search className="w-4 h-4" />, color: '#EF4444' },
  { id: 7, label: 'Generating Report', sublabel: 'Composing analysis & counter-narrative...', icon: <Shield className="w-4 h-4" />, color: '#22C55E' },
];

export default function ProcessingState({ isVisible, currentStep }: ProcessingStateProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-3xl mx-auto px-4"
        >
          <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
            {/* Header */}
            <div className="border-b border-white/5 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 rounded-full border-2 border-[#4F8EFF]/30 border-t-[#4F8EFF] animate-spin" />
                  </div>
                  Deep Analysis Running
                </h3>
                <p className="text-xs text-[#8A8AA0] mt-1 font-mono">mitra-v2.1.0-multimodal · Processing{dots}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black gradient-text">{Math.round((currentStep / STEPS.length) * 100)}%</div>
                <div className="text-xs text-[#4A4A60]">complete</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-0.5 bg-[#1E1E2E]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED]"
                animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* Steps grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEPS.map((step, i) => {
                const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      status === 'active'
                        ? 'bg-[#4F8EFF]/10 border border-[#4F8EFF]/20'
                        : status === 'done'
                        ? 'bg-white/[0.02] border border-white/5'
                        : 'bg-transparent border border-transparent opacity-40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        status === 'done'
                          ? 'bg-green-500/20'
                          : status === 'active'
                          ? 'bg-[#4F8EFF]/20 animate-pulse'
                          : 'bg-white/5'
                      }`}
                    >
                      {status === 'done' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : status === 'active' ? (
                        <Loader2 className="w-4 h-4 text-[#4F8EFF] animate-spin" />
                      ) : (
                        <div className="w-4 h-4 flex items-center justify-center text-[#4A4A60]">{step.icon}</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        status === 'done' ? 'text-[#8A8AA0] line-through decoration-[#4A4A60]' : status === 'active' ? 'text-white' : 'text-[#4A4A60]'
                      }`}>
                        {step.label}
                      </p>
                      {status === 'active' && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-[#4F8EFF] mt-0.5 truncate"
                        >
                          {step.sublabel}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 px-6 py-4 flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-3 rounded-full bg-[#4F8EFF] processing-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-xs text-[#4A4A60] font-mono">
                Estimated time: <span className="text-[#8A8AA0]">~{Math.max(1, 5 - Math.floor(currentStep * 0.6))}s remaining</span>
              </p>
            </div>
          </div>


        </motion.div>
      )}
    </AnimatePresence>
  );
}
