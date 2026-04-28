'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Shield, Cpu, Database, Lock, Globe, Server, Layers } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TECH_PILLARS = [
  {
    icon: <Cpu className="w-7 h-7" />,
    title: 'Native Multimodal AI Engine (Gemini 2.5 Flash)',
    color: '#4F8EFF',
    desc: 'At the heart of Mitra lies the Google Gemini 2.5 Flash model, accessed via the GenerativeLanguage API. We bypass fragmented legacy OCR or audio transcription pipelines. Instead, Mitra streams Base64-encoded images, video, audio, and documents directly to Gemini. This native multimodal capability ensures that visual context, spoken tone, and on-screen text are evaluated holistically within a single unified embedding space.',
    details: [
      'Direct Base64 multimodal streaming for zero-loss ingestion',
      'Native handling of MP4, MP3, JPEG, PDF, and 15+ other formats',
      'Simultaneous analysis of visual manipulation and spoken claims',
      'Sub-5 second reasoning for complex, multi-layered deepfakes',
    ],
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Advanced 23-Language NLP & Contextualization',
    color: '#22D3EE',
    desc: 'Misinformation in India thrives in regional echo chambers. Mitra possesses deep linguistic intelligence to automatically detect, parse, and analyze all 23 official Indian languages (8th Schedule). Furthermore, it is specifically tuned to comprehend code-mixed colloquialisms like Hinglish, Tanglish, and localized WhatsApp slang without losing factual fidelity.',
    details: [
      'Seamless support for Hindi, Bengali, Tamil, Telugu, Marathi, etc.',
      'Handles complex scripts: Devanagari, Latin, and regional graphemes',
      'Sentiment-aware detection of culturally sensitive keywords',
      'Automated, localized WhatsApp counter-message generation',
    ],
  },
  {
    icon: <Server className="w-7 h-7" />,
    title: 'Netlify Edge Serverless Execution',
    color: '#7C3AED',
    desc: 'Mitra operates on a highly optimized Next.js 14 App Router architecture deployed exclusively on Netlify. While we initially evaluated traditional containerized deployments (like Railway) for our backend, transitioning to Netlify Edge Serverless Functions provided unparalleled horizontal scaling and reduced cold-boot latency for our API routes. We utilize extended maxDuration configurations (up to 60s) to securely process intensive video and audio payloads.',
    details: [
      'Netlify optimized serverless deployment for global edge routing',
      'Next.js 14 App Router API Routes for backend orchestration',
      'Extended serverless timeouts (60s) for heavy media processing',
      'Eliminated monolithic bottlenecks present in legacy container systems',
    ],
  },
  {
    icon: <Database className="w-7 h-7" />,
    title: 'Neon Serverless Postgres & Prisma ORM',
    color: '#F59E0B',
    desc: 'For our data layer, we utilize Neon Serverless Postgres. By decoupling storage and compute, Neon allows our database to instantly scale to zero and dynamically allocate resources based on active traffic spikes. This database is managed entirely through Prisma ORM, enforcing strict end-to-end TypeScript safety and maintaining hyper-efficient connection pooling.',
    details: [
      'Neon.tech Serverless PostgreSQL architecture',
      'Prisma ORM for strict end-to-end type safety and schema validation',
      'Instantaneous auto-scaling and connection pooling at the edge',
      'Secure isolation of user session and historical analysis data',
    ],
  },
  {
    icon: <Layers className="w-7 h-7" />,
    title: 'Intelligent Cheerio Scraping & Interception',
    color: '#EF4444',
    desc: 'URLs are more than links; they are dense knowledge graphs. Mitra employs a custom-built, highly aggressive web scraper using Cheerio and the Node.js Fetch API. It strips away digital noise (ads, modals, trackers) using 15+ semantic HTML fallback selectors to extract pristine article bodies. For YouTube, it natively intercepts TimedText XML APIs to extract video transcripts without headless browser overhead.',
    details: [
      'Cheerio-powered semantic HTML noise removal and extraction',
      'YouTube TimedText XML caption and metadata extraction',
      'Graceful heuristic fallbacks for blocked social domains (X/Meta)',
      'Simulated User-Agent rotation to bypass basic anti-bot screens',
    ],
  },
  {
    icon: <Lock className="w-7 h-7" />,
    title: 'Enterprise-Grade Security & NextAuth',
    color: '#22C55E',
    desc: 'Identity and session management are governed by NextAuth.js (Auth.js). We provide seamless, one-click Google OAuth2 SSO integration alongside a highly secure Credentials provider. Passwords are cryptographically hashed using bcrypt with a high Cost Factor (12), ensuring complete protection against brute-force vector attacks.',
    details: [
      'NextAuth.js stateful/stateless session lifecycle management',
      'Google Cloud Console OAuth2 seamless SSO integration',
      'bcrypt password hashing (Cost Factor 12) for credentials',
      'Strict environment variable protection across the Netlify pipeline',
    ],
  },
];

const STACK = [
  { category: 'Frontend Layer', items: ['Next.js 14 (App Router)', 'React 18', 'TypeScript 5', 'Tailwind CSS v4', 'Framer Motion v10', 'Lucide React Icons'] },
  { category: 'Backend Orchestration', items: ['Next.js Serverless APIs', 'NextAuth.js (Auth.js)', 'Cheerio Web Scraper', 'Node.js native Fetch API'] },
  { category: 'Database & Data Access', items: ['Neon Serverless Postgres', 'Prisma ORM', 'Prisma Connection Pooling', 'bcryptjs Cryptography'] },
  { category: 'AI & Cloud Infrastructure', items: ['Google Gemini API (2.5 Flash)', 'Netlify Edge Deployment', 'Railway (Prototyping)', 'YouTube Caption XML API'] },
];

const PERF = [
  { label: 'Avg. response time', value: '<5s', desc: 'Full 9-step pipeline end-to-end' },
  { label: 'Database architecture', value: 'Neon', desc: 'Serverless Postgres + Prisma' },
  { label: 'Supported input types', value: 'All', desc: 'Text · URL · Images · Audio · Video' },
  { label: 'Languages supported', value: '23', desc: 'All 23 official Indian languages' },
];

export default function TechnologyPage() {
  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-[#7C3AED]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
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
            <div className="inline-flex items-center gap-2 bg-[#111118] border border-[#1E1E2E] rounded-full px-5 py-2.5 text-xs text-[#7C3AED] font-bold uppercase tracking-widest mb-6 shadow-lg shadow-[#7C3AED]/10">
              <Cpu className="w-4 h-4" />
              Architectural Deep Dive
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-8">
              Engineered for extreme{' '}
              <span className="gradient-text">scale</span>
              <br />and precision.
            </h1>

            <p className="text-xl text-[#8A8AA0] leading-relaxed max-w-3xl mx-auto">
              Mitra&apos;s full-stack architecture represents the cutting edge of modern web development. By combining serverless primitives across Netlify and Neon with the bleeding-edge reasoning capabilities of Google Gemini 2.5, we have constructed an infrastructure capable of combating misinformation in real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Perf metrics */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PERF.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl border border-white/[0.08] p-8 text-center card-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              <div className="relative z-10">
                <div className="text-4xl font-black gradient-text mb-2 tracking-tight">{p.value}</div>
                <div className="text-white text-base font-bold mb-1">{p.label}</div>
                <div className="text-sm text-[#8A8AA0]">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-black text-white mb-4">Core Infrastructure Pillars</h2>
          <p className="text-lg text-[#8A8AA0] max-w-2xl mx-auto">The foundational systems that enable rapid, highly accurate multimodal analysis without infrastructure bottlenecks.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TECH_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-3xl border border-white/[0.08] p-8 card-hover relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ background: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}30` }}
                >
                  {pillar.icon}
                </div>
                <h3 className="text-white font-black text-2xl mb-4 tracking-tight">{pillar.title}</h3>
                <p className="text-[#8A8AA0] text-base leading-relaxed mb-6">{pillar.desc}</p>
                <ul className="space-y-3">
                  {pillar.details.map(d => (
                    <li key={d} className="flex items-start gap-3 text-sm text-[#B4B4C8] font-medium">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 shadow-sm"
                        style={{ background: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Table */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-black text-white mb-4">The Complete Stack</h2>
          <p className="text-lg text-[#8A8AA0] max-w-2xl mx-auto">A comprehensive breakdown of every library, framework, and cloud service meticulously chosen to power the Mitra AI platform.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STACK.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl border border-white/[0.08] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F8EFF] to-[#22D3EE] opacity-50" />
              <h3 className="text-[#4F8EFF] text-sm font-black uppercase tracking-widest mb-6 font-mono">
                {group.category}
              </h3>
              <ul className="space-y-4">
                {group.items.map(item => (
                  <li key={item} className="flex items-center gap-3 text-base text-[#E2E8F0] font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architecture diagram (visual) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[40px] border border-white/[0.08] p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F8EFF]/5 to-[#7C3AED]/5" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-10 text-center tracking-tight">Data Flow & Processing Pipeline</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: 'Multimodal Input (Text/URL/Media)', bg: '#4F8EFF' },
                { label: '→', bg: 'none' },
                { label: 'Netlify Edge API Route', bg: '#7C3AED' },
                { label: '→', bg: 'none' },
                { label: 'Cheerio / Base64 Scraper', bg: '#F59E0B' },
                { label: '→', bg: 'none' },
                { label: 'Google Gemini 2.5 Flash', bg: '#22D3EE' },
                { label: '→', bg: 'none' },
                { label: 'Client-Side Streamed Report', bg: '#22C55E' },
              ].map((node, i) => (
                node.bg === 'none' ? (
                  <span key={i} className="text-[#8A8AA0] text-2xl font-black opacity-50">→</span>
                ) : (
                  <div
                    key={i}
                    className="px-6 py-4 rounded-2xl text-white text-base font-bold shadow-xl backdrop-blur-md"
                    style={{ background: `${node.bg}15`, border: `1px solid ${node.bg}50`, color: node.bg, boxShadow: `0 10px 30px -10px ${node.bg}40` }}
                  >
                    {node.label}
                  </div>
                )
              ))}
            </div>
            <p className="text-center text-sm text-[#8A8AA0] mt-10 font-mono bg-black/20 inline-block px-6 py-3 rounded-full mx-auto flex items-center justify-center border border-white/[0.05]">
              Full architectural execution completes securely via stateless Netlify Edge Functions.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[40px] border border-white/[0.08] p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F8EFF]/10 to-[#7C3AED]/10 blur-xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Experience the technology natively</h2>
            <p className="text-xl text-[#8A8AA0] mb-10 max-w-2xl mx-auto leading-relaxed">
              Submit any claim, paste a complex URL, or upload raw media. Watch the serverless Gemini-powered pipeline dissect and analyze it in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/?mode=signup"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white font-bold hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-[#4F8EFF]/25 text-lg"
              >
                <Zap className="w-5 h-5" />
                Initialize Mitra Engine
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
