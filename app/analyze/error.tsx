'use client';
// Phase 1 — @nextjs-best-practices skill
// error.tsx catches runtime errors in the /analyze route segment without crashing the whole app.
// Must be a Client Component because it uses browser event handlers (reset).

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnalyzeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error tracking service in production
    console.error('[Mitra AI] /analyze error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl border border-red-500/20 p-10 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
          {error.message || 'An unexpected error occurred in the analysis pipeline.'}
        </p>
        {error.digest && (
          <p className="text-xs font-mono mt-1 mb-5" style={{ color: 'var(--text-muted)' }}>
            Error ID: {error.digest}
          </p>
        )}

        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
