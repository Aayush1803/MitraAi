import { NextRequest, NextResponse } from 'next/server';

// App Router route segment config — extends Netlify function timeout
export const maxDuration = 60; // seconds

// ─── MIME type support map ────────────────────────────────────────────────────
// Gemini's native multimodal API supports these formats
const MIME_BY_EXT: Record<string, string> = {
  // Images
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp',
  tiff: 'image/tiff', tif: 'image/tiff', heic: 'image/heic',
  heif: 'image/heif', avif: 'image/avif',
  // Audio
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
  flac: 'audio/flac', aac: 'audio/aac', m4a: 'audio/x-m4a',
  opus: 'audio/ogg', wma: 'audio/x-ms-wma',
  // Video
  mp4: 'video/mp4', mpeg: 'video/mpeg', mpg: 'video/mpeg',
  mov: 'video/mp4', avi: 'video/x-msvideo', webm: 'video/webm',
  '3gp': 'video/3gpp', mkv: 'video/x-matroska',
  flv: 'video/x-flv', wmv: 'video/x-ms-wmv',
  // Documents
  pdf: 'application/pdf', txt: 'text/plain',
};

const SUPPORTED_MIME_TYPES = new Set(Object.values(MIME_BY_EXT));

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB — Gemini inline data limit

function getMediaCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'document';
  return 'file';
}

/** Resolve MIME type: prefer file.type, fallback to extension mapping */
function resolveMimeType(file: File): string {
  let mime = (file.type || '').toLowerCase();

  // Fix common browser misdetections
  if (mime === 'video/quicktime') mime = 'video/mp4';
  if (mime === 'audio/mp4') mime = 'audio/x-m4a';

  // If still generic/unknown, use extension
  if (!mime || mime === 'application/octet-stream') {
    const ext = (file.name.split('.').pop() ?? '').toLowerCase();
    mime = MIME_BY_EXT[ext] ?? mime;
  }

  return mime;
}

const ANALYSIS_PROMPT = `You are a STRICT factual verification AI system for India specializing in multimodal content.

ANALYZE this media content for:
1. Factual claims made verbally, visually, or in text overlays
2. Signs of manipulation, deepfake, or synthetic generation  
3. Misleading context, out-of-context usage, or visual deception
4. Sensitive content related to Indian politics, religion, or social issues

RULES:
- Auto-detect the language of spoken/written content in the media.
- Support all 23 official Indian languages: Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, Santali.
- Analyze ALL text visible in the media (overlays, subtitles, banners, watermarks).
- For audio: transcribe key claims made.
- For video: analyze both visual content and spoken claims.
- For images: read all embedded text and analyze visual context.
- For PDFs: extract and analyze the document's factual claims.
- Check for signs of manipulation or misrepresentation.
- Output ONLY valid JSON — no markdown, no code fences, no extra text.

OUTPUT FORMAT (strict JSON, every field required):
{
  "language_detected": "Hindi",
  "media_type_analysis": "Brief description of what the media contains and what was analyzed",
  "manipulation_indicators": ["list any red flags, or empty array if none"],
  "claims": [
    { "text": "exact claim extracted from media", "classification": "False", "confidence": 96 }
  ],
  "trust_score": 8,
  "fact_verification": {
    "correct_info": "what the truth actually is based on verified information",
    "sources": [
      { "name": "source name", "url": "https://source.url" }
    ]
  },
  "explanation": {
    "detailed": "2-3 sentence expert explanation of the findings",
    "eli10": "Simple explanation for a 10-year-old"
  },
  "virality_risk": {
    "score": 82,
    "level": "High",
    "reason": "one sentence explaining why this content would spread virally"
  },
  "context_analysis": {
    "regional": "India-specific regional context for this content",
    "cultural": "Cultural framing or sensitivity context",
    "sensitivity": "HIGH/MEDIUM/LOW — reason for sensitivity rating"
  },
  "counter_message": "A factual, polite counter-message someone can share on WhatsApp to debunk this"
}
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mimeType = resolveMimeType(file);

    if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({
        error: `Unsupported file type "${mimeType || file.name}". Supported formats: Images (JPEG, PNG, WebP, GIF, BMP, HEIC, AVIF), Audio (MP3, WAV, OGG, FLAC, AAC, M4A, OPUS), Video (MP4, MOV, AVI, WebM, MKV, 3GP, FLV, WMV), Documents (PDF, TXT).`,
      }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({
        error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 20 MB. For larger videos, consider extracting a key clip.`,
      }, { status: 400 });
    }

    const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured. Set GEMINI_API_KEY.' }, { status: 503 });
    }

    const category = getMediaCategory(mimeType);
    console.log(`[Media] Analyzing ${category}: "${file.name}" (${(file.size / 1024).toFixed(0)} KB, ${mimeType})`);

    // Convert file to base64 for Gemini inline data
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Try models in order — prefer 2.5 flash for multimodal
    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
    let geminiResponse: Response | null = null;
    let lastError = '';

    for (const model of MODELS) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        console.log(`[Media] Calling ${model}...`);
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                { text: ANALYSIS_PROMPT },
              ],
            }],
            generationConfig: {
              temperature: 0.1,
              topP: 0.8,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            },
          }),
          signal: AbortSignal.timeout(55_000),
        });

        if (res.status === 429 || res.status === 503) {
          lastError = `Error ${res.status} on ${model}`;
          console.warn(`[Media] ${res.status} on ${model}, trying next...`);
          continue;
        }

        geminiResponse = res;
        break;
      } catch (e) {
        lastError = (e as Error).message;
        console.warn(`[Media] ${model} failed:`, lastError);
      }
    }

    if (!geminiResponse) {
      return NextResponse.json({ error: `AI unavailable: ${lastError}` }, { status: 429 });
    }

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      console.error('[Media] Gemini error:', geminiResponse.status, errBody.slice(0, 400));
      if (geminiResponse.status === 503) {
        return NextResponse.json({ error: "Google's AI service is currently overloaded. Please try again in a few moments." }, { status: 503 });
      }
      return NextResponse.json({
        error: `Google AI error (${geminiResponse.status}). Please try again.`,
      }, { status: 502 });
    }

    const geminiData = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }>} }>;
      error?: { message: string };
    };

    if (geminiData.error) {
      return NextResponse.json({ error: geminiData.error.message }, { status: 502 });
    }

    const rawText = (geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();

    if (!rawText) {
      return NextResponse.json({ error: 'AI returned empty response for media' }, { status: 502 });
    }

    console.log(`[Media] ✅ Got ${rawText.length} chars from Gemini`);

    return NextResponse.json({
      text: rawText,
      fileName: file.name,
      mimeType,
      category,
      fileSizeKB: Math.round(file.size / 1024),
      isDirectAnalysis: true,
    });

  } catch (err) {
    console.error('[Media] Unexpected error:', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Media analysis failed',
    }, { status: 500 });
  }
}
