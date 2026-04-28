import { NextRequest, NextResponse } from 'next/server';

// Gemini supports these natively via inline base64 multimodal
const SUPPORTED_MIME_TYPES = new Set([
  // Images
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/bmp', 'image/tiff', 'image/heic', 'image/heif', 'image/avif',
  // Audio
  'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/wav', 'audio/ogg',
  'audio/flac', 'audio/aac', 'audio/webm', 'audio/x-m4a',
  // Video
  'video/mp4', 'video/mpeg', 'video/mov', 'video/quicktime',
  'video/avi', 'video/x-msvideo', 'video/webm', 'video/3gp', 'video/3gpp',
  'video/mkv', 'video/x-matroska',
  // Documents
  'application/pdf',
  'text/plain',
]);

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB inline limit for Gemini

function getMediaCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'document';
  return 'file';
}

const ANALYSIS_PROMPT = `You are a STRICT factual verification AI system for India specializing in multimodal content.

ANALYZE this media content for:
1. Factual claims made verbally or shown visually
2. Signs of manipulation, deepfake, or synthetic generation
3. Misleading context, out-of-context usage, or visual deception
4. Sensitive content related to Indian politics, religion, or social issues

RULES:
- Auto-detect the language of spoken/written content. Support all 23 official Indian languages.
- Analyze all text visible in the media (overlays, subtitles, banners).
- Check for visual inconsistencies that suggest manipulation.
- Output ONLY valid JSON — no markdown, no code fences.

OUTPUT FORMAT (strict JSON):
{
  "language_detected": "Hindi",
  "media_type_analysis": "Brief description of what the media contains",
  "manipulation_indicators": ["list", "of", "red flags if any"],
  "claims": [
    { "text": "exact claim found in media", "classification": "False", "confidence": 96 }
  ],
  "trust_score": 8,
  "fact_verification": {
    "correct_info": "what the truth actually is",
    "sources": [
      { "name": "source name", "url": "https://source.url" }
    ]
  },
  "explanation": {
    "detailed": "2-3 sentence expert explanation",
    "eli10": "Simple explanation for a 10-year-old"
  },
  "virality_risk": {
    "score": 82,
    "level": "High",
    "reason": "why this would spread virally"
  },
  "context_analysis": {
    "regional": "India-specific context",
    "cultural": "Cultural framing context",
    "sensitivity": "HIGH/MEDIUM/LOW — reason"
  },
  "counter_message": "Factual, polite counter-message to share on WhatsApp"
}
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Normalise MIME type
    let mimeType = file.type || 'application/octet-stream';
    // Fix common misdetections
    if (mimeType === 'video/quicktime') mimeType = 'video/mp4';

    if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({
        error: `Unsupported file type: ${mimeType}. Supported: images (JPEG, PNG, WebP, GIF, BMP, HEIC), audio (MP3, WAV, OGG, FLAC, AAC, M4A), video (MP4, AVI, MOV, WebM, MKV, 3GP), PDF, and plain text.`,
      }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({
        error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 20 MB for inline analysis.`,
      }, { status: 400 });
    }

    const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const category = getMediaCategory(mimeType);
    console.log(`[Media] Analyzing ${category}: ${file.name} (${(file.size / 1024).toFixed(0)} KB, ${mimeType})`);

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Build Gemini multimodal request
    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
    let geminiResponse: Response | null = null;
    let lastError = '';

    for (const model of MODELS) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
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
            },
          }),
          signal: AbortSignal.timeout(60_000), // 60s for large files
        });

        if (res.status === 429) {
          lastError = `Rate limit on ${model}`;
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
      return NextResponse.json({
        error: `Gemini error (${geminiResponse.status}): ${errBody.slice(0, 300)}`,
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

    // Return extracted text + metadata so analyze route can process it
    return NextResponse.json({
      text: rawText,
      fileName: file.name,
      mimeType,
      category,
      fileSizeKB: Math.round(file.size / 1024),
      isDirectAnalysis: true, // signal to caller that this is already Gemini JSON
    });

  } catch (err) {
    console.error('[Media] Error:', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Media analysis failed',
    }, { status: 500 });
  }
}

