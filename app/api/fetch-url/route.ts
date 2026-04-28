import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Supported URL patterns
const YT_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function isYouTubeUrl(url: string) {
  return YT_REGEX.test(url);
}

function extractYouTubeId(url: string) {
  const m = url.match(YT_REGEX);
  return m ? m[1] : null;
}

/** Attempt to fetch YouTube transcript via YouTube's built-in caption timedtext API */
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // Fetch watch page to grab initial data
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const html = await pageRes.text();

    // Extract caption URL from ytInitialPlayerResponse
    const captionMatch = html.match(/"captionTracks":\[{"baseUrl":"([^"]+)"/);
    if (!captionMatch) return null;

    const captionUrl = captionMatch[1].replace(/\\u0026/g, '&');
    const captionRes = await fetch(captionUrl);
    const xml = await captionRes.text();

    // Parse <text> elements from timed-text XML
    const $ = cheerio.load(xml, { xmlMode: true });
    const lines: string[] = [];
    $('text').each((_, el) => {
      const text = $(el).text()
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
      if (text) lines.push(text);
    });

    // Also get title + description from watch page
    const titleMatch = html.match(/"title":"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';

    const transcript = lines.join(' ').slice(0, 8000);
    return `YouTube Video Title: ${title}\n\nTranscript:\n${transcript}`;
  } catch {
    return null;
  }
}

/** Scrape a generic web article and extract meaningful text */
async function scrapeArticle(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} fetching URL`);

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Remove noise
  $('script, style, nav, footer, header, aside, .ad, .ads, .advertisement, .sidebar, .cookie, [class*="cookie"], [class*="popup"], [id*="cookie"], [id*="popup"]').remove();

  // Get metadata
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    '';
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';
  const siteName =
    $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname;

  // Extract main content — try article selectors first, fallback to body
  const CONTENT_SELECTORS = [
    'article', 'main', '[role="main"]',
    '.article-body', '.post-content', '.entry-content', '.story-body',
    '#article-body', '#story', '.article__body', '.content-body',
    '.article-content', '.post-body', '.news-body',
  ];

  let bodyText = '';
  for (const sel of CONTENT_SELECTORS) {
    const el = $(sel);
    if (el.length && el.text().trim().length > 200) {
      bodyText = el.text();
      break;
    }
  }

  // Fallback to paragraphs
  if (!bodyText || bodyText.trim().length < 200) {
    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 30) paragraphs.push(t);
    });
    bodyText = paragraphs.join('\n\n');
  }

  // Clean up whitespace
  const cleanText = bodyText
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 8000);

  return [
    `Source: ${siteName}`,
    `URL: ${url}`,
    `Title: ${title}`,
    description ? `Description: ${description}` : '',
    '',
    'Article Content:',
    cleanText,
  ].filter(Boolean).join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    let extractedText = '';

    // YouTube — try transcript first
    if (isYouTubeUrl(url)) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        const transcript = await fetchYouTubeTranscript(videoId);
        if (transcript) {
          extractedText = transcript;
        } else {
          // Fallback: scrape the watch page metadata
          try {
            extractedText = await scrapeArticle(url);
          } catch {
            extractedText = `YouTube Video URL: ${url}\n\nNote: Could not fetch transcript for this video. Analyzing based on URL context only.`;
          }
        }
      }
    } else {
      extractedText = await scrapeArticle(url);
    }

    return NextResponse.json({ text: extractedText, url });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch URL';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
