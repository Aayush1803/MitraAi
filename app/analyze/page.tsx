'use client';
// Phase 4 — @react-patterns skill
// Rule: "Extract complex state + async logic into a custom hook."
// The page is now a thin orchestrator — all analysis state lives in useAnalysis.

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ProcessingState from '@/components/ProcessingState';
import ResultsDashboard from '@/components/ResultsDashboard';
import { useAnalysis } from '@/lib/hooks/useAnalysis';

export default function AnalyzePage() {
  const { status } = useSession();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);

  // Phase 4 — @react-patterns: all analysis state + async logic in one hook
  const { appState, currentStep, result, error, handleSubmit, handleReset } = useAnalysis();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4F8EFF] animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <main className="relative min-h-screen">
      <NavBar />

      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Hero onSubmit={handleSubmit} isLoading={false} />
          </motion.div>
        )}

        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                Running <span className="gradient-text">9-Step Analysis</span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Our multimodal AI pipeline is dissecting your content...</p>
            </motion.div>
            <ProcessingState isVisible={true} currentStep={currentStep} />
          </motion.div>
        )}

        {appState === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={resultRef}
            className="min-h-screen pt-24 pb-16"
          >
            <div className="max-w-5xl mx-auto px-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Analysis <span className="gradient-text">Report</span>
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Mitra AI has completed the 9-step multimodal fact-check pipeline
                </p>
              </motion.div>
            </div>
            <ResultsDashboard result={result} onReset={handleReset} />
          </motion.div>
        )}

        {appState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 pt-24"
          >
            <div className="glass rounded-2xl border border-red-500/20 p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Analysis Failed</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#4F8EFF] text-white font-semibold hover:bg-[#6BA3FF] transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4F8EFF 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>
    </main>
  );
}
