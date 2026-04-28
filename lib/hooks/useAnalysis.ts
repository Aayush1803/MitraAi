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
  handleSubmit: (input: string, type: InputType, file?: File) => Promise<void>;
  handleReset: () => void;
}

// ── JSON parser (3-tier) ───────────────────────────────────────────────────────
function parseGeminiJSON(raw: string): Record<string, unknown> {
  let text = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  try { return JSON.parse(text) as Record<string, unknown>; } catch { /* continue */ }

  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s !== -1 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) as Record<string, unknown>; } catch { /* continue */ }
  }

  const fixed = text.replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(fixed) as Record<string, unknown>; } catch { /* continue */ }

  throw new Error(`Cannot parse JSON from Gemini: ${text.slice(0, 200)}`);
}

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
  const handleSubmit = useCallback(async (input: string, type: InputType, file?: File) => {
    setAppState('processing');
    setError(null);
    setResult(null);
    startStepAnimation();
    window.scrollTo({ top: window.innerHeight * 0.3, behavior: 'smooth' });

    try {
      let analysisInput = input;
      let isDirectGeminiJSON = false;

      // ── URL: fetch + scrape server-side ───────────────────────────────────
      if (type === 'url' && input.startsWith('http')) {
        const urlRes = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: input }),
        });
        const urlData = await urlRes.json() as { text?: string; error?: string };
        if (!urlRes.ok || urlData.error) {
          throw new Error(urlData.error || 'Failed to fetch URL content');
        }
        analysisInput = urlData.text || input;
      }

      // ── Media: use Gemini multimodal directly ─────────────────────────────
      if (type === 'media' && file) {
        const formData = new FormData();
        formData.append('file', file);

        const mediaRes = await fetch('/api/analyze-media', {
          method: 'POST',
          body: formData,
        });
        const mediaData = await mediaRes.json() as {
          text?: string;
          error?: string;
          isDirectAnalysis?: boolean;
        };
        if (!mediaRes.ok || mediaData.error) {
          throw new Error(mediaData.error || 'Media analysis failed');
        }
        analysisInput = mediaData.text || '';
        isDirectGeminiJSON = mediaData.isDirectAnalysis === true;
      }

      // ── If media returned direct Gemini JSON, parse + map it ──────────────
      if (isDirectGeminiJSON && analysisInput) {
        let parsed: Record<string, unknown>;
        try {
          parsed = parseGeminiJSON(analysisInput);
        } catch {
          // fallback: pass raw text to text analysis
          isDirectGeminiJSON = false;
        }

        if (isDirectGeminiJSON) {
          // Map the Gemini media response into AnalysisResult shape
          const g = parsed!;
          const trustScore = Math.max(0, Math.min(100, Number(g.trust_score ?? 50)));
          const VALID_STATUS = ['True', 'False', 'Misleading', 'Opinion'] as const;
          const rawClaims = (g.claims as Array<Record<string, unknown>>) ?? [];
          const viralityData = (g.virality_risk as Record<string, unknown>) ?? {};
          const factData = (g.fact_verification as Record<string, unknown>) ?? {};
          const expData = (g.explanation as Record<string, unknown>) ?? {};
          const ctxData = (g.context_analysis as Record<string, unknown>) ?? {};
          const viralLevel = (['Low', 'Medium', 'High'].includes(String(viralityData.level)) ? String(viralityData.level) : 'Medium') as 'Low' | 'Medium' | 'High';

          const mediaAnalysis: AnalysisResult = {
            id: `mitra-${Date.now()}`,
            timestamp: new Date().toISOString(),
            inputType: 'media',
            language: 'en',
            originalInput: input || (file?.name ?? 'Media file'),
            claims: rawClaims.slice(0, 5).map((c, i) => ({
              id: i + 1,
              text: String(c.text ?? ''),
              status: (VALID_STATUS.includes(String(c.classification) as typeof VALID_STATUS[number]) ? String(c.classification) : 'Opinion') as typeof VALID_STATUS[number],
              confidence: Math.max(0, Math.min(100, Number(c.confidence ?? 70))),
            })),
            trustScore,
            factVerification: {
              correctedFact: String(factData.correct_info ?? ''),
              sources: ((factData.sources as Array<Record<string, unknown>>) ?? []).slice(0, 4).map(s => ({
                name: String(s.name ?? ''), url: String(s.url ?? '#'), logo: (String(s.name ?? 'X')[0] ?? 'X').toUpperCase(),
              })),
            },
            explanation: {
              detailed: String(expData.detailed ?? ''),
              eli10: String(expData.eli10 ?? ''),
            },
            viralityRisk: {
              score: Math.max(0, Math.min(100, Number(viralityData.score ?? 50))),
              level: viralLevel,
              reason: String(viralityData.reason ?? ''),
            },
            contextAnalysis: {
              regional: String(ctxData.regional ?? ''),
              cultural: String(ctxData.cultural ?? ''),
              sensitivity: String(ctxData.sensitivity ?? 'MEDIUM'),
            },
            counterMessage: {
              text: String(g.counter_message ?? ''),
              whatsappText: `*🔍 MITRA AI MEDIA FACT CHECK*\n\nVerdict: *${trustScore < 35 ? 'FALSE' : trustScore < 65 ? 'MISLEADING' : 'TRUE'}*\n\n${String(g.counter_message ?? '')}\n\n🔗 Verified by Mitra AI\n\n_#FactCheck #StopMisinformation #MitraAI_`,
            },
            processingTime: 0,
            modelVersion: 'gemini-2.0-flash-multimodal',
          };

          stopStepAnimation();
          setCurrentStep(TOTAL_STEPS);
          setTimeout(() => {
            setResult(mediaAnalysis);
            setAppState('results');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
          }, 600);
          return;
        }
      }

      // ── Standard text/url analysis via /api/analyze ───────────────────────
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: analysisInput, type, language: 'en' }),
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
