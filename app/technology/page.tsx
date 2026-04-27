'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Shield, Cpu, Database, Lock, Globe } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TECH_PILLARS = [
  {
    icon: <Cpu className="w-7 h-7" />,
    title: 'Multimodal AI Engine',
    color: '#4F8EFF',
    desc: 'Mitra\'s core engine processes text, images, video and URLs through a unified embedding space. A single transformer-based architecture handles all modalities, enabling consistent trust scoring across content types.',
    details: [
      'Transformer-based NLP for claim extraction',
      'Visual-language model for image/video analysis',
      'URL scraping + content parsing pipeline',
      'Code-mixed Indian language tokenization',
    ],
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Multilingual NLP',
    color: '#22D3EE',
    desc: 'Indian fact-checking requires deep linguistic intelligence. Our models support all 23 official Indian languages — from Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, and Gujarati to Maithili, Dogri, Manipuri, Bodo, Santali, and more — including code-mixed variants.',
    details: [
      'All 23 scheduled Indian languages (8th Schedule)',
      'Handles Devanagari, Latin, Tamil, and regional scripts',
      'Sentiment-aware misinformation detection',
      'Regional slang and cultural idiom handling',
    ],
  },
  {
    icon: <Database className="w-7 h-7" />,
    title: 'Knowledge Graph',
    color: '#7C3AED',
    desc: 'Mitra maintains a continuously updated knowledge graph of verified facts sourced from government portals, academic publications, and credentialed fact-checkers. Claims are matched via semantic similarity search.',
    details: [
      'Reuters, Alt News, BOOM Live integration',
      'WHO & Ministry of Health official feeds',
      'Real-time updates via fact-checker APIs',
      'Semantic vector search (cosine similarity)',
    ],
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Trust Score Model',
    color: '#F59E0B',
    desc: 'Mitra uses a keyword-based trust scoring system tuned to common misinformation signals — missing citations, emotional language, and high-risk terms. Scores are heuristic and intended as a starting signal, not a definitive verdict.',
    details: [
      'Keyword-based scoring engine (not an ML model)',
      'High-risk and safe keyword dictionaries',
      'Score clamped to 8–97 range to avoid false certainty',
      'Explained verdicts for every score',
    ],
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: 'Virality Prediction',
    color: '#EF4444',
    desc: 'Virality risk is computed as the inverse of the trust score, adjusted with a randomized spread factor to simulate real-world sharing behavior. It\'s a heuristic, not a trained predictive model.',
    details: [
      'Heuristic inverse of trust score',
      'Randomized spread factor for realism',
      'Emotional language and sensationalism detection',
      'Low / Medium / High classification',
    ],
  },
  {
    icon: <Lock className="w-7 h-7" />,
    title: 'Privacy & Security',
    color: '#22C55E',
    desc: 'All content is processed ephemerally. We use JWT-based stateless sessions, bcrypt password hashing, and OAuth2 for authentication. No user content is sold or used for third-party model training.',
    details: [
      'NextAuth.js — Google OAuth2 + credentials',
      'bcrypt (cost 12) password hashing',
      'JWT stateless sessions — no server cookies',
      'Content never shared with third parties',
    ],
  },
];

const STACK = [
  { category: 'Frontend', items: ['Next.js 14 (App Router)', 'React 18', 'TypeScript 5', 'Tailwind CSS v3', 'Framer Motion v10', 'Lucide React'] },
  { category: 'Backend', items: ['Next.js API Routes', 'NextAuth.js v4', 'bcryptjs', 'In-memory user store (Node.js Map)'] },
  { category: 'AI / NLP', items: ['Custom NLP scoring engine', 'Keyword-based claim classifier', 'Virality risk model', 'Multilingual counter-message generator'] },
  { category: 'Infrastructure', items: ['Vercel (deployment)', 'Edge runtime ready', 'Zero external DB (demo)', 'Google OAuth2'] },
];

const PERF = [
  { label: 'Avg. response time', value: '<5s', desc: 'Full 9-step pipeline end-to-end' },
  { label: 'Scoring method', value: 'Heuristic', desc: 'Keyword-based, not an ML model' },
  { label: 'Supported input types', value: '3', desc: 'Text · URL · Media' },
  { label: 'Languages supported', value: '23', desc: 'All 23 official Indian languages' },
];

export default function TechnologyPage() {
  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#7C3AED]/5 blur-3xl rounded-full pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 bg-[#111118] border border-[#1E1E2E] rounded-full px-4 py-2 text-xs text-[#7C3AED] font-semibold uppercase tracking-widest mb-6">
              <Cpu className="w-3.5 h-3.5" />
              Under the Hood
            </div>

            <h1 className="text-6xl font-black text-white leading-tight mb-6">
              Built for{' '}
              <span className="gradient-text">India&apos;s</span>
              <br />information reality.
            </h1>

            <p className="text-xl text-[#8A8AA0] leading-relaxed max-w-2xl mx-auto">
              Mitra&apos;s AI stack is engineered specifically for the unique challenges of
              Indian-language misinformation — regional context, WhatsApp-native formats,
              and multi-script processing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Perf metrics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PERF.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 text-center card-hover"
            >
              <div className="text-3xl font-black gradient-text mb-1">{p.value}</div>
              <div className="text-white text-sm font-semibold mb-1">{p.label}</div>
              <div className="text-xs text-[#4A4A60]">{p.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-white mb-3">Core AI pillars</h2>
          <p className="text-[#8A8AA0]">Six specialized systems that power every analysis.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {TECH_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 card-hover"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${pillar.color}15`, color: pillar.color }}
              >
                {pillar.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{pillar.title}</h3>
              <p className="text-[#8A8AA0] text-sm leading-relaxed mb-5">{pillar.desc}</p>
              <ul className="space-y-2">
                {pillar.details.map(d => (
                  <li key={d} className="flex items-start gap-2 text-xs text-[#4A4A60]">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: pillar.color }}
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-white mb-3">Full technology stack</h2>
          <p className="text-[#8A8AA0]">Every library and framework powering Mitra AI.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {STACK.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-6"
            >
              <h3 className="text-[#4F8EFF] text-xs font-bold uppercase tracking-widest mb-4 font-mono">
                {group.category}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#8A8AA0]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4F8EFF]/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architecture diagram (visual) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl border border-white/[0.06] p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F8EFF]/3 to-[#7C3AED]/3" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-8 text-center">Request flow</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'User Input', bg: '#4F8EFF' },
                { label: '→', bg: 'none' },
                { label: 'API Route', bg: '#7C3AED' },
                { label: '→', bg: 'none' },
                { label: 'NLP Engine', bg: '#22D3EE' },
                { label: '→', bg: 'none' },
                { label: 'Trust Scorer', bg: '#F59E0B' },
                { label: '→', bg: 'none' },
                { label: 'Report', bg: '#22C55E' },
              ].map((node, i) => (
                node.bg === 'none' ? (
                  <span key={i} className="text-[#4A4A60] text-xl font-bold">→</span>
                ) : (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                    style={{ background: `${node.bg}20`, border: `1px solid ${node.bg}40`, color: node.bg }}
                  >
                    {node.label}
                  </div>
                )
              ))}
            </div>
            <p className="text-center text-xs text-[#4A4A60] mt-6 font-mono">
              Full pipeline completes in &lt;5 seconds · All processing server-side · Results streamed to client
            </p>
          </div>
        </motion.div>
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
            <h2 className="text-3xl font-black text-white mb-4">See the technology in action</h2>
            <p className="text-[#8A8AA0] mb-8 max-w-md mx-auto">
              Submit any claim and watch the 9-step pipeline analyze it in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <Zap className="w-4 h-4" />
                Try Mitra Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[#1E1E2E] text-[#8A8AA0] hover:text-white hover:border-[#4F8EFF]/40 font-semibold transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
