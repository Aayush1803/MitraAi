import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider';

// ─── Phase 1: @nextjs-best-practices + @seo-audit ────────────────────────────
// Full metadata object with: title template, description, OG, Twitter card,
// robots, canonical URL, and keywords — per Next.js App Router best practices.
export const metadata: Metadata = {
  metadataBase: new URL('https://mitra-ai.vercel.app'),
  title: {
    default: 'Mitra AI — AI Misinformation Detector for India',
    template: '%s | Mitra AI',
  },
  description:
    'Mitra AI uses a 9-step multimodal AI pipeline to detect, analyze, and counter misinformation across text, URLs, and media — in 22+ Indian languages including Hindi and Tamil.',
  keywords: [
    'misinformation detection',
    'fact checking AI',
    'deepfake detection',
    'India fact check',
    'Hindi fact check',
    'Tamil fact check',
    'WhatsApp forward checker',
    'Mitra AI',
  ],
  authors: [{ name: 'Mitra AI Team' }],
  creator: 'Mitra AI',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mitra-ai.vercel.app',
    siteName: 'Mitra AI',
    title: 'Mitra AI — AI Misinformation Detector for India',
    description:
      'A 9-step AI pipeline that fact-checks text, URLs, and media in 22+ Indian languages.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitra AI — AI Misinformation Detector',
    description: 'Fact-check in seconds with India\'s most advanced multimodal AI.',
    creator: '@mitraai',
  },
};

// Viewport is now a separate export per Next.js 14+ best practice
export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('mitra-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="mesh-bg min-h-screen antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
