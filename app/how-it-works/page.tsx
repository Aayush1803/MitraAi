'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Zap, Shield, FileText, Globe,
  Search, Brain, BarChart3, MessageSquare, Share2, CheckCircle2,
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const STEPS = [
  {
    number: '01',
    icon: <FileText className="w-6 h-6" />,
    title: 'Input Collection',
    subtitle: 'Text, URL, or Media',
    desc: 'Submit any content you want to verify — a WhatsApp forward, a news article URL, social media post, or even a video/image. Mitra accepts all three input types and auto-detects your preferred language.',
    color: '#4F8EFF',
    tags: ['Text', 'URL', 'Media'],
  },
  {
    number: '02',
    icon: <Globe className="w-6 h-6" />,
    title: 'Language Detection',
    subtitle: 'All 23 Official Indian Languages',
    desc: 'Our NLP layer automatically identifies the language from all 23 official Indian languages — including Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, and more. Indian code-mixed content (Hinglish, Tanglish) is handled with specialized tokenizers.',
    color: '#22D3EE',
    tags: ['NLP', 'Multilingual', 'Code-mix'],
  },
  {
    number: '03',
    icon: <Search className="w-6 h-6" />,
    title: 'Claims Extraction',
    subtitle: 'Identifying checkable assertions',
    desc: 'Our model breaks down the content into individual, verifiable claims. Each sentence is analyzed for factual assertions vs. opinions, filtering out what can and cannot be fact-checked.',
    color: '#7C3AED',
    tags: ['Semantic NLP', 'Claim detection'],
  },
  {
    number: '04',
    icon: <Brain className="w-6 h-6" />,
    title: 'Fact Verification',
    subtitle: 'Cross-referencing trusted databases',
    desc: 'Each extracted claim is cross-referenced against verified databases including Reuters, Alt News, BOOM Live, WHO, and government portals. Our engine checks for corroborating or contradicting evidence.',
    color: '#F59E0B',
    tags: ['Reuters', 'Alt News', 'WHO', 'BOOM Live'],
  },
  {
    number: '05',
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Trust Scoring',
    subtitle: '0–100 confidence index',
    desc: 'Every analysis produces a Trust Score from 0 to 100 based on source credibility, claim verifiability, linguistic red flags, and cross-reference depth. Scores below 35 indicate high misinformation risk.',
    color: '#22C55E',
    tags: ['ML Scoring', 'Confidence Index'],
  },
  {
    number: '06',
    icon: <Share2 className="w-6 h-6" />,
    title: 'Virality Risk',
    subtitle: 'Predicting spread potential',
    desc: 'Misinformation spreads faster than truth. Our virality model analyzes emotional language, sensationalism level, and sharing patterns to predict how likely false content is to go viral.',
    color: '#EF4444',
    tags: ['Spread analysis', 'Risk prediction'],
  },
  {
    number: '07',
    icon: <Globe className="w-6 h-6" />,
    title: 'Context Analysis',
    subtitle: 'Regional & cultural framing',
    desc: 'Content is analyzed for regional targeting, cultural amplification vectors, and communal sensitivity. This is especially important for India\'s diverse linguistic and cultural landscape.',
    color: '#818CF8',
    tags: ['Regional', 'Cultural', 'Sensitivity'],
  },
  {
    number: '08',
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Counter-Message',
    subtitle: 'One-click WhatsApp reply',
    desc: 'Mitra generates a ready-to-share counter-message in English, Hindi, or Tamil that you can paste directly into WhatsApp or social media to correct the misinformation in your network.',
    color: '#22D3EE',
    tags: ['WhatsApp ready', 'Multilingual'],
  },
  {
    number: '09',
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Full Report',
    subtitle: 'Detailed analysis dashboard',
    desc: 'Every analysis generates a comprehensive report with claim-by-claim verdicts, source citations, ELI10 explanations for non-technical users, and an overall trustworthiness summary.',
    color: '#4F8EFF',
    tags: ['Dashboard', 'ELI10', 'Citations'],
  },
];

const INPUT_TYPES = [
  {
    icon: '💬',
    title: 'Text',
    desc: 'Paste any text — WhatsApp messages, social media posts, news excerpts, or any written content.',
    example: '"Drinking lemon water at midnight cures diabetes..."',
  },
  {
    icon: '🔗',
    title: 'URL',
    desc: 'Share a link and Mitra will fetch, read, and analyze the article or webpage content automatically.',
    example: 'https://example.com/viral-health-claim',
  },
  {
    icon: '📸',
    title: 'Media',
    desc: 'Upload images, screenshots of fake news, or reference a video. Our multimodal AI reads visual content.',
    example: 'screenshot.jpg · viral_video.mp4',
  },
];

const FAQS = [
  {
    q: 'Is Mitra AI free to use?',
    a: 'Yes. The core fact-checking tool is completely free. We believe access to truth should not be paywalled.',
  },
  {
    q: 'How accurate is Mitra AI?',
    a: 'Mitra uses a keyword-based scoring engine tuned to common misinformation patterns. It\'s a demo-grade system — not a production fact-checker. Always verify critical claims with a real fact-checker like Alt News, BOOM Live, or Reuters.',
  },
  {
    q: 'Does Mitra store my content?',
    a: 'We do not share your submitted content with third parties. Analysis history is stored only in your account for your reference.',
  },
  {
    q: 'Which languages does Mitra support?',
    a: 'Mitra supports all 23 official Indian languages listed in the 8th Schedule of the Constitution — including Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, and Santali. Code-mixed variants like Hinglish and Tanglish are also handled.',
  },
  {
    q: 'Can I use Mitra for journalism?',
    a: 'Absolutely. Mitra is designed to assist journalists and researchers. We offer API access for newsrooms — contact us for details.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#4F8EFF]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#8A8AA0] hover:text-white transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#111118] border border-[#1E1E2E] rounded-full px-4 py-2 text-xs text-[#4F8EFF] font-semibold uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5" />
              The Pipeline
            </div>

            <h1 className="text-6xl font-black text-white leading-tight mb-6">
              9 steps to the{' '}
              <span className="gradient-text">truth</span>
            </h1>

            <p className="text-xl text-[#8A8AA0] leading-relaxed max-w-2xl mx-auto">
              Every piece of content goes through Mitra&apos;s full AI pipeline — from ingestion to a
              shareable counter-message — in under 5 seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Input Types */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-black text-white mb-2">What can you analyze?</h2>
          <p className="text-[#8A8AA0]">Three ways to submit content for fact-checking.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mb-20">
          {INPUT_TYPES.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 card-hover"
            >
              <div className="text-3xl mb-4">{t.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{t.title}</h3>
              <p className="text-[#8A8AA0] text-sm mb-4 leading-relaxed">{t.desc}</p>
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-3 py-2">
                <p className="text-xs text-[#4A4A60] font-mono truncate">{t.example}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl font-black text-white mb-2">The 9-step pipeline</h2>
          <p className="text-[#8A8AA0]">How Mitra AI processes every piece of content.</p>
        </motion.div>

        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 card-hover flex gap-6 items-start"
            >
              {/* Number + Icon */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${step.color}18`, color: step.color }}
                >
                  {step.icon}
                </div>
                <span className="text-xs font-black text-[#4A4A60] font-mono">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-lg">{step.title}</h3>
                  <span className="text-xs text-[#4A4A60] font-mono">{step.subtitle}</span>
                </div>
                <p className="text-[#8A8AA0] text-sm leading-relaxed mb-3">{step.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {step.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md border font-mono"
                      style={{ color: step.color, borderColor: `${step.color}30`, background: `${step.color}10` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl font-black text-white mb-2">Frequently asked questions</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl border border-white/[0.06] p-6"
            >
              <h3 className="text-white font-semibold mb-2 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#4F8EFF] mt-0.5 flex-shrink-0" />
                {faq.q}
              </h3>
              <p className="text-[#8A8AA0] text-sm leading-relaxed pl-6">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl border border-white/[0.06] p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F8EFF]/5 to-[#7C3AED]/5" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Try it now — free</h2>
            <p className="text-[#8A8AA0] mb-8 max-w-md mx-auto">
              No credit card needed. Analyze your first claim in under 30 seconds.
            </p>
            <Link
              href="/?mode=signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
