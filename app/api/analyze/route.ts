import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequest, AnalysisResult, Claim, TrustedSource } from '@/lib/types';

// ─── Gemini prompt ─────────────────────────────────────────────────────────────
const PROMPT = `You are a STRICT factual verification AI system for India.

RULES:
1. Analyze ONLY what is explicitly in the input. Do NOT add claims that aren't there.
2. For simple 1-sentence inputs → extract ONLY 1 claim.
3. Scientifically wrong claims (e.g. "sugar cures cancer") → classify as "False" with confidence 92-98.
4. Auto-detect the language of the input. You MUST support all 23 official Indian languages:
   Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam,
   Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani,
   Dogri, Manipuri (Meitei), Bodo, and Santali.
   Analyze internally in English. Respond in the SAME language as the user's input.
5. Output ONLY valid JSON — no markdown, no code fences, no extra text.

CLASSIFICATION:
- "True"       → verified by scientific/official consensus
- "False"      → contradicts scientific/official consensus  
- "Misleading" → partially true but missing critical context
- "Opinion"    → clearly subjective, not verifiable

OUTPUT FORMAT (strict JSON, every field required):
{
  "language_detected": "English",
  "claims": [
    { "text": "exact claim from input", "classification": "False", "confidence": 96 }
  ],
  "trust_score": 8,
  "fact_verification": {
    "correct_info": "detailed correction explaining what the science actually says",
    "sources": [
      { "name": "source name", "url": "https://source.url" }
    ]
  },
  "explanation": {
    "detailed": "2-3 sentence expert explanation of why this is false/true/misleading",
    "eli10": "Simple explanation for a 10-year-old child"
  },
  "virality_risk": {
    "score": 82,
    "level": "High",
    "reason": "one sentence why this would spread virally"
  },
  "context_analysis": {
    "regional": "India-specific regional context for this claim",
    "cultural": "Cultural framing or sensitivity context",
    "sensitivity": "HIGH/MEDIUM/LOW — reason for sensitivity rating"
  },
  "counter_message": "A factual, polite counter-message someone can share on WhatsApp to debunk this"
}

INPUT TO ANALYZE:
`;


// ─── Source logo helper ────────────────────────────────────────────────────────
const FALLBACK_SOURCES: TrustedSource[] = [
  { name: 'Reuters Fact-Check',     url: 'https://www.reuters.com/fact-check/',     logo: 'R' },
  { name: 'WHO',                    url: 'https://www.who.int/',                    logo: 'W' },
  { name: 'Alt News',               url: 'https://www.altnews.in/',                 logo: 'A' },
  { name: 'BOOM Live',              url: 'https://www.boomlive.in/',                logo: 'B' },
  { name: 'PIB Fact Check',         url: 'https://pib.gov.in/FactCheck.aspx',       logo: 'P' },
  { name: 'India Today Fact Check', url: 'https://www.indiatoday.in/fact-check',    logo: 'I' },
];

// ─── JSON parser (3-tier) ──────────────────────────────────────────────────────
function parseGeminiJSON(raw: string): Record<string, unknown> {
  let text = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  // Tier 1: direct
  try { return JSON.parse(text) as Record<string, unknown>; } catch { /* continue */ }

  // Tier 2: extract { ... }
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s !== -1 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) as Record<string, unknown>; } catch { /* continue */ }
  }

  // Tier 3: fix trailing commas
  const fixed = text.replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(fixed) as Record<string, unknown>; } catch { /* continue */ }

  throw new Error(`Cannot parse JSON from Gemini. Raw: ${text.slice(0, 300)}`);
}

// ─── Map raw Gemini output → AnalysisResult ───────────────────────────────────
function mapResult(
  g: Record<string, unknown>,
  originalInput: string,
  processingTime: number,
): AnalysisResult {
  // Claims
  const rawClaims = (g.claims as Array<Record<string, unknown>>) ?? [];
  const VALID_STATUS = ['True', 'False', 'Misleading', 'Opinion'] as const;

  const claims: Claim[] = rawClaims.slice(0, 5).map((c, i) => ({
    id:         i + 1,
    text:       String(c.text ?? ''),
    status:     (VALID_STATUS.includes(String(c.classification) as typeof VALID_STATUS[number])
                  ? String(c.classification)
                  : 'Opinion') as Claim['status'],
    confidence: Math.max(0, Math.min(100, Number(c.confidence ?? 70))),
  }));

  // Trust score
  const trustScore = Math.max(0, Math.min(100, Number(g.trust_score ?? 50)));

  // Fact verification
  const fv = (g.fact_verification as Record<string, unknown>) ?? {};
  const rawSrc = (fv.sources as Array<Record<string, unknown>>) ?? [];
  const sources: TrustedSource[] = rawSrc.length >= 2
    ? rawSrc.slice(0, 4).map(s => ({
        name: String(s.name ?? ''),
        url:  String(s.url  ?? '#'),
        logo: (String(s.name ?? 'X')[0] ?? 'X').toUpperCase(),
      }))
    : FALLBACK_SOURCES.slice(0, 4);

  // Explanation
  const exp = (g.explanation as Record<string, unknown>) ?? {};

  // Virality
  const vr = (g.virality_risk as Record<string, unknown>) ?? {};
  const viralScore = Math.max(0, Math.min(100, Number(vr.score ?? 50)));
  const viralLevel = (['Low', 'Medium', 'High'].includes(String(vr.level))
    ? String(vr.level) : 'Medium') as 'Low' | 'Medium' | 'High';

  // Context — Gemini returns context_analysis as OBJECT (we now ask for it that way)
  const ctx = (g.context_analysis as Record<string, unknown>) ?? {};
  const regional    = String(ctx.regional    ?? g.context_analysis ?? '');
  const cultural    = String(ctx.cultural    ?? `Language: ${String(g.language_detected ?? 'English')}`);
  const sensitivity = String(ctx.sensitivity ?? (viralLevel === 'High' ? 'HIGH' : viralLevel === 'Medium' ? 'MEDIUM' : 'LOW'));

  // Counter message
  const counterText  = String(g.counter_message ?? '');
  const statusTag    = trustScore < 35 ? 'FALSE' : trustScore < 65 ? 'MISLEADING' : 'TRUE';
  const statusLine   = trustScore < 55
    ? '❌ This message contains false or misleading information.'
    : '✅ This message has been independently verified as accurate.';

  return {
    id:            `mitra-${Date.now()}`,
    timestamp:     new Date().toISOString(),
    inputType:     'text',
    language:      'en',
    originalInput,
    claims,
    trustScore,
    factVerification: {
      correctedFact: String(fv.correct_info ?? fv.correctedFact ?? ''),
      sources,
    },
    explanation: {
      detailed: String(exp.detailed ?? ''),
      eli10:    String(exp.eli10    ?? ''),
    },
    viralityRisk: {
      score:  viralScore,
      level:  viralLevel,
      reason: String(vr.reason ?? ''),
    },
    contextAnalysis: { regional, cultural, sensitivity },
    counterMessage: {
      text:          counterText,
      whatsappText:  `*🔍 MITRA AI FACT CHECK*\n\nVerdict: *${statusTag}*\n\n${statusLine}\n\n${counterText}\n\n🔗 Verified by Mitra AI\n\n_#FactCheck #StopMisinformation #MitraAI_`,
    },
    processingTime,
    modelVersion: 'gemini-2.0-flash',
  };
}

// ─── API Route ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const start = Date.now();

  try {
    const body = await req.json() as AnalyzeRequest;
    const userInput = (body.input ?? '').trim();

    if (!userInput || userInput.length < 3) {
      return NextResponse.json({ error: 'Input too short' }, { status: 400 });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[Mitra] Analyzing: "${userInput.slice(0, 100)}"`);

    // ── Check API key ──────────────────────────────────────────────────────────
    const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
    if (!apiKey) {
      console.error('[Mitra] GEMINI_API_KEY is not set in .env.local');
      return NextResponse.json(
        { error: 'AI service not configured. Set GEMINI_API_KEY in .env.local' },
        { status: 503 },
      );
    }

    // ── Build full prompt ──────────────────────────────────────────────────────
    const fullPrompt = PROMPT + userInput;

    const MODELS = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-2.5-flash-lite',
    ];
    let geminiResponse: Response | null = null;
    let lastError = '';

    for (const model of MODELS) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      try {
        console.log(`[Mitra] Calling ${model}...`);
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature:     0.1,
              topP:            0.8,
              topK:            40,
              maxOutputTokens: 2048,
              candidateCount:  1,
              responseMimeType: 'application/json',
            },
          }),
          signal: controller.signal,
        });

        if (res.status === 429 || res.status === 503) {
          lastError = `Error ${res.status} on ${model}`;
          console.warn(`[Mitra] ${res.status} hit on ${model}, trying next model...`);
          continue; // try next model
        }

        geminiResponse = res;
        break; // got a non-429 response
      } catch (e) {
        lastError = (e as Error).message;
        console.warn(`[Mitra] ${model} failed:`, lastError);
      } finally {
        clearTimeout(timeout);
      }
    }

    if (!geminiResponse) {
      console.error('[Mitra] All models failed:', lastError);
      return NextResponse.json(
        { error: `Gemini API unavailable: ${lastError}. This is usually a rate limit — wait 60s and try again.` },
        { status: 429 },
      );
    }

    // ── Check non-ok after model loop ──────────────────────────────────────────
    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      console.error('[Mitra] Gemini error:', geminiResponse.status, errBody.slice(0, 300));
      if (geminiResponse.status === 503) {
        return NextResponse.json({ error: "Google's AI service is currently overloaded. Please try again in a few moments." }, { status: 503 });
      }
      return NextResponse.json(
        { error: `Google AI error (${geminiResponse.status}). Please try again.` },
        { status: 502 },
      );
    }

    // ── Extract raw text ───────────────────────────────────────────────────────
    const geminiData = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
      error?: { message: string };
    };

    if (geminiData.error) {
      console.error('[Mitra] Gemini API error:', geminiData.error.message);
      return NextResponse.json({ error: `Gemini: ${geminiData.error.message}` }, { status: 502 });
    }

    const rawText = (
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    ).trim();

    console.log(`[Mitra] Gemini raw output (${rawText.length} chars):`);
    console.log(rawText.slice(0, 500));

    if (!rawText) {
      return NextResponse.json({ error: 'Gemini returned empty response' }, { status: 502 });
    }

    // ── Parse JSON ─────────────────────────────────────────────────────────────
    let parsed: Record<string, unknown>;
    try {
      parsed = parseGeminiJSON(rawText);
    } catch (e) {
      console.error('[Mitra] JSON parse failed:', (e as Error).message);
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Try again.', raw: rawText.slice(0, 500) },
        { status: 502 },
      );
    }

    // ── Map and return ─────────────────────────────────────────────────────────
    const result = mapResult(parsed, userInput, Date.now() - start);
    console.log(`[Mitra] ✅ Success — trust_score=${result.trustScore}, claims=${result.claims.length}`);
    console.log('='.repeat(60));

    return NextResponse.json(result);

  } catch (err) {
    console.error('[Mitra] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
