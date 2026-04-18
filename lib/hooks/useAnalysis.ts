// Phase 4 — @react-patterns skill
// Extract complex multi-state logic into a custom hook.
// Rule: "Container components hold heavy state — extract into useX hooks for reuse + testability."
// This hook owns the entire analysis lifecycle: idle → processing → results → error.

'use client';

import { useState, useCallback, useRef } from 'react';
import { AnalysisResult, InputType } from '@/lib/types';

type AppState = 'idle' | 'processing' | 'results' | 'error';

const TOTAL_STEPS = 8;
const STEP_DURATION = 400;

interface UseAnalysisReturn {
  appState: AppState;
  currentStep: number;
  result: AnalysisResult | null;
  error: string | null;
  handleSubmit: (input: string, type: InputType) => Promise<void>;
  handleReset: () => void;
}

/**
 * useAnalysis — owns the full analysis pipeline state machine.
 * @react-patterns: extracts complex state + async logic out of the page component.
 */
export function useAnalysis(): UseAnalysisReturn {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stepTimer = useRef<NodeJS.Timeout | null>(null);

  // ── Step animation ─────────────────────────────────────────────────────────
  const startStepAnimation = useCallback(() => {
    setCurrentStep(0);
    let step = 0;
    const tick = () => {
      step += 1;
      setCurrentStep(step);
      if (step < TOTAL_STEPS - 1) {
        const delay = step < 6 ? STEP_DURATION : 1200;
        stepTimer.current = setTimeout(tick, delay);
      }
    };
    stepTimer.current = setTimeout(tick, STEP_DURATION);
  }, []);

  const stopStepAnimation = useCallback(() => {
    if (stepTimer.current) clearTimeout(stepTimer.current);
  }, []);

  // ── Main submit handler ────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (input: string, type: InputType) => {
    setAppState('processing');
    setError(null);
    setResult(null);
    startStepAnimation();
    window.scrollTo({ top: window.innerHeight * 0.3, behavior: 'smooth' });

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, type, language: 'en' }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Analysis failed (${res.status})`);
      }

      stopStepAnimation();
      setCurrentStep(TOTAL_STEPS);

      setTimeout(() => {
        setResult(data as AnalysisResult);
        setAppState('results');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
      }, 600);
    } catch (err) {
      stopStepAnimation();
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setAppState('error');
    }
  }, [startStepAnimation, stopStepAnimation]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    stopStepAnimation();
    setAppState('idle');
    setResult(null);
    setError(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopStepAnimation]);

  return { appState, currentStep, result, error, handleSubmit, handleReset };
}
