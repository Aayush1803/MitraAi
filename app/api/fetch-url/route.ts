import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// App Router route segment config — extends timeout for slow sites
export const maxDuration = 30;

// ─── URL type detection ───────────────────────────────────────────────────────
const YT_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// Sites that block server-side scraping — we handle gracefully
const BLOCKED_DOMAINS = [
  'twitter.com', 'x.com', 'instagram.com', 'facebook.com', 'fb.com',
  'linkedin.com', 'tiktok.com', 'snapchat.com',
];

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return ''; }
}

function isYouTubeUrl(url: string) { return YT_REGEX.test(url); }
function extractYouTubeId(url: string) {
  const m = url.match(YT_REGEX);
  return m ? m[1] : null;
}

function isBlockedDomain(url: string): string | null {
  const domain = getDomain(url);
  return BLOCKED_DOMAINS.find(d => domain === d || domain.endsWith('.' + d)) || null;
}

/** Fetch YouTube transcript via caption timedtext API */
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10_000),
    });
    const html = await pageRes.text();

    // Extract title
    const titleMatch = html.match(/"title":"([^"]+)"/);
    const title = titleMatch ? titleMatch[1].replace(/\\u0026/g, '&').replace(/\\"/g, '"') : '';

    // Extract author
    const authorMatch = html.match(/"ownerChannelName":"([^"]+)"/);
    const author = authorMatch ? authorMatch[1] : '';

    // Extract description snippet
    const descMatch = html.match(/"shortDescription":"([^"]{0,500})"/);
    const description = descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';

    // Try caption URL
    const captionMatch = html.match(/"captionTracks":\[{"baseUrl":"([^"]+)"/);
    let transcript = '';

    if (captionMatch) {
      try {
        const captionUrl = captionMatch[1].replace(/\\u0026/g, '&');
        const captionRes = await fetch(captionUrl, { signal: AbortSignal.timeout(8_000) });
        const xml = await captionRes.text();

        const $ = cheerio.load(xml, { xmlMode: true });
        const lines: string[] = [];
        $('text').each((_, el) => {
          const text = $(el).text()
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
          if (text) lines.push(text);
        });
        transcript = lines.join(' ').slice(0, 8000);
      } catch {
        // Caption fetch failed — continue with metadata only
      }
    }

    const parts = [
      `Source: YouTube`,
      `Video ID: ${videoId}`,
      `URL: https://www.youtube.com/watch?v=${videoId}`,
      title ? `Title: ${title}` : '',
      author ? `Channel: ${author}` : '',
      description ? `Description: ${description}` : '',
      transcript ? `\nTranscript:\n${transcript}` : '\n[Transcript unavailable — analyzing based on title and description]',
    ].filter(Boolean);

    return parts.join('\n');
  } catch {
    return null;
  }
}

/** Generic article scraper with intelligent content extraction */
async function scrapeArticle(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
      'Cache-Control': 'no-cache',
    },
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page (HTTP ${res.status}). The site may require login or block automated access.`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    throw new Error(`This URL doesn't link to a readable page (content-type: ${contentType}).`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Remove noise elements
  $('script, style, nav, footer, header, aside, iframe, noscript').remove();
  $('[class*="cookie"], [class*="popup"], [class*="modal"], [class*="banner"]').remove();
  $('[class*="ad-"], [class*="-ad"], [id*="cookie"], [id*="popup"]').remove();
  $('figure > figcaption').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length < 20) $(el).remove();
  });

  // Metadata
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    '';
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';
  const siteName =
    $('meta[property="og:site_name"]').attr('content') ||
    getDomain(url);
  const publishDate =
    $('meta[property="article:published_time"]').attr('content') ||
    $('time[datetime]').attr('datetime') ||
    '';

  // Main content extraction — try semantic selectors first
  const CONTENT_SELECTORS = [
    'article', '[role="main"]', 'main',
    '.article-body', '.post-content', '.entry-content', '.story-body',
    '#article-body', '#story', '.article__body', '.content-body',
    '.article-content', '.post-body', '.news-body', '.news-article',
    '.story-content', '.article__content', '.page-content',
    '[itemprop="articleBody"]', '[itemprop="text"]',
  ];

  let bodyText = '';
  for (const sel of CONTENT_SELECTORS) {
    const el = $(sel).first();
    if (el.length && el.text().trim().length > 300) {
      bodyText = el.text();
      break;
    }
  }

  // Fallback: collect all substantial paragraphs
  if (!bodyText || bodyText.trim().length < 300) {
    const paragraphs: string[] = [];
    $('p, h2, h3, h4, li').each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 30) paragraphs.push(t);
    });
    bodyText = paragraphs.join('\n\n');
  }

  // Clean up whitespace
  const cleanText = bodyText
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 10000);

  if (cleanText.length < 100) {
    throw new Error('Could not extract readable content from this page. It may require JavaScript to load or a login.');
  }

  return [
    `Source: ${siteName}`,
    `URL: ${url}`,
    `Title: ${title}`,
    description ? `Description: ${description}` : '',
    publishDate ? `Published: ${publishDate}` : '',
    '',
    'Article Content:',
    cleanText,
  ].filter(Boolean).join('\n');
}

// ─── API Route ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };

    if (!url || !url.trim().startsWith('http')) {
      return NextResponse.json({
        error: 'Invalid URL. Please paste a full URL starting with https://',
      }, { status: 400 });
    }

    // Check for blocked domains
    const blockedBy = isBlockedDomain(url);
    if (blockedBy) {
      // Return the URL itself as text with context — Gemini will still analyze it
      return NextResponse.json({
        text: [
          `URL submitted for analysis: ${url}`,
          `Platform: ${blockedBy}`,
          `Note: ${blockedBy} blocks automated content fetching. Analyzing based on the URL pattern, platform context, and any visible metadata only.`,
          `Please copy and paste the actual text/content from this post for a full fact-check analysis.`,
        ].join('\n'),
        url,
        isBlocked: true,
      });
    }

    let extractedText = '';

    if (isYouTubeUrl(url)) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        const ytData = await fetchYouTubeTranscript(videoId);
        if (ytData) {
          extractedText = ytData;
        } else {
          extractedText = `YouTube video URL: ${url}\n[Could not fetch transcript — analyzing URL only]`;
        }
      }
    } else {
      extractedText = await scrapeArticle(url);
    }

    return NextResponse.json({ text: extractedText, url });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch URL content';
    console.error('[fetch-url]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
