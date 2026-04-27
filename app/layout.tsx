import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import ScrollToTop from '@/components/ScrollToTop';

// ─── Phase 1: @nextjs-best-practices + @seo-audit ────────────────────────────
// Full metadata object with: title template, description, OG, Twitter card,
// robots, canonical URL, and keywords — per Next.js App Router best practices.
export const metadata: Metadata = {
  metadataBase: new URL('https://ai-mitra.netlify.app'),
  title: {
    default: 'Mitra AI — AI Misinformation Detector for India',
    template: '%s | Mitra AI',
  },
  description:
    'Mitra AI uses a 9-step multimodal AI pipeline to detect, analyze, and counter misinformation across text, URLs, and media — in all 23 official Indian languages including Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, and more.',
  keywords: [
    'misinformation detection',
    'fact checking AI',
    'India fact check',
    'Hindi fact check',
    'Bengali fact check',
    'Tamil fact check',
    'Marathi fact check',
    'Telugu fact check',
    'Urdu fact check',
    'WhatsApp forward checker',
    'deepfake detection',
    'Mitra AI',
    'Indian language AI',
    'all 23 Indian languages',
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
    url: 'https://ai-mitra.netlify.app',
    siteName: 'Mitra AI',
    title: 'Mitra AI — AI Misinformation Detector for India',
    description:
      'A 9-step AI pipeline that fact-checks text, URLs, and media in all 23 official Indian languages.',
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
          <AuthProvider>
            <ToastProvider>
              {children}
              <ScrollToTop />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
