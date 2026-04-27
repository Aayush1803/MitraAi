'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowLeft, Github, Instagram, Linkedin, Heart, Globe, Users, Target, Award } from 'lucide-react';
import NavBar from '@/components/NavBar';

const TEAM = [
  {
    name: 'Aayush Joshi',
    role: 'Founder & Sole Engineer',
    bio: 'Designed, built, and deployed every single part of Mitra AI — from frontend to AI integration, database architecture, and production infrastructure.',
    avatar: 'AJ',
    color: '#4F8EFF',
    github: 'https://github.com/Aayush1803',
    linkedin: 'https://www.linkedin.com/in/aayushjoshi07/',
    instagram: 'https://www.instagram.com/aayushjoshiiii_/',
  },
  {
    name: 'Ayushmaan Srivastava',
    role: 'Co-Founder & Moral Support',
    bio: 'Kept the team motivated and spirits high throughout the build process.',
    avatar: 'AS',
    color: '#22D3EE',
    github: 'https://github.com/Ayushmaan124-cpu',
    linkedin: 'https://www.linkedin.com/in/ayushmaan-srivastava-70729337b',
    instagram: 'https://www.instagram.com/ayyuuush._/',
  },
  {
    name: 'Aditya Rauniyar',
    role: 'Co-Founder & Presentation Designer',
    bio: 'Crafted the pitch deck and visual presentation materials for Mitra AI.',
    avatar: 'AR',
    color: '#7C3AED',
    github: 'https://github.com/aditya22-ops',
    linkedin: 'https://www.linkedin.com/in/aditya-rauniyar-5a410b364',
    instagram: 'https://www.instagram.com/ig_vegous22/',
  },
];

const MILESTONES = [
  { year: '2026', title: 'Hackathon Project', desc: 'Mitra AI was built as a hackathon/demo project to explore how AI can help combat misinformation in Indian digital spaces.' },
  { year: '2026', title: 'v2 Multimodal', desc: 'Added multilingual support (English, Hindi, Tamil), virality risk scoring, regional context analysis, and a 9-step analysis pipeline.' },
  { year: 'Now', title: 'Open & Growing', desc: 'Actively being developed with plans to add more Indian languages, real fact-checker API integrations, and a public API.' },
];

const VALUES = [
  { icon: '🇮🇳', title: 'India First', desc: 'Built specifically for the Indian information ecosystem — regional languages, cultural context, and local fact-checkers.' },
  { icon: '🔓', title: 'Transparency', desc: 'Every analysis shows exactly which sources were checked and why a claim was flagged. No black boxes.' },
  { icon: '⚖️', title: 'Non-Partisan', desc: 'We fact-check across the political spectrum. Our only bias is towards evidence and verified sources.' },
  { icon: '🤝', title: 'Community', desc: 'We partner with grassroots journalists and local fact-checkers to stay accurate on ground realities.' },
];

const STATS = [
  { value: '23',    label: 'Languages Supported', icon: <Globe className="w-5 h-5" /> },
  { value: '9-Step', label: 'Analysis Pipeline',   icon: <Award className="w-5 h-5" /> },
  { value: 'Free',   label: 'Always Free',          icon: <Target className="w-5 h-5" /> },
  { value: 'Open',   label: 'Hackathon Project',    icon: <Users className="w-5 h-5" /> },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] to-[#0A0A0F]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-[#4F8EFF]/6 to-[#7C3AED]/6 blur-3xl pointer-events-none" />

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
          <div className="section-label mb-6">
            <Heart className="w-3 h-3" />
            Our Mission
          </div>

            <h1 className="text-6xl font-black text-white leading-tight mb-6">
              Fighting{' '}
              <span className="gradient-text">misinformation</span>
              <br />in India, at scale.
            </h1>

            <p className="text-xl text-[#8A8AA0] leading-relaxed max-w-2xl mx-auto">
              Mitra AI was built to give every Indian — regardless of language or tech literacy —
              a powerful tool to verify claims before sharing them. Because truth matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 text-center card-hover"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4F8EFF]/10 text-[#4F8EFF] flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="stat-number text-3xl gradient-text mb-1">{stat.value}</div>
              <div className="text-xs mono-font" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-white mb-3">What we stand for</h2>
          <p className="text-[#8A8AA0]">The principles that guide every decision we make.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 card-hover"
            >
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-[#8A8AA0] text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-white mb-3">Our journey</h2>
          <p className="text-[#8A8AA0]">From hackathon idea to India&apos;s leading fact-check platform.</p>
        </motion.div>

        <div className="space-y-0">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                  {m.year.slice(2)}
                </div>
                {i < MILESTONES.length - 1 && (
                  <div className="w-px h-12 bg-gradient-to-b from-[#4F8EFF]/40 to-transparent mt-1" />
                )}
              </div>
              <div className={`pb-10 ${i < MILESTONES.length - 1 ? '' : ''}`}>
                <div className="text-xs text-[#4F8EFF] font-mono font-semibold mb-1">{m.year}</div>
                <h3 className="text-white font-bold text-lg mb-1">{m.title}</h3>
                <p className="text-[#8A8AA0] text-sm leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="display-font text-3xl font-black text-white mb-3">The team</h2>
          <div className="glow-divider mt-4 mb-1" />
          <p className="text-[#8A8AA0]">Passionate builders on a mission.</p>
        </motion.div>

        <div className="flex flex-wrap gap-4">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/[0.06] p-6 card-interactive w-full sm:w-72"
            >
              <div
                className="aurora-halo w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mb-4"
                style={{ background: `linear-gradient(135deg, ${member.color}, #7C3AED)` }}
              >
                {member.avatar}
              </div>
              <h3 className="display-font text-white font-bold text-lg">{member.name}</h3>
              <p className="section-label mt-1 mb-3 text-[9px]" style={{ borderRadius: 4 }}>{member.role}</p>
              <p className="text-[#8A8AA0] text-sm leading-relaxed">{member.bio}</p>
              <div className="flex gap-3 mt-4">
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[#4A4A60] hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-[#4A4A60] hover:text-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#4A4A60] hover:text-[#0A66C2] transition-colors"><Linkedin className="w-4 h-4" /></a>
              </div>
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Ready to fight misinformation?</h2>
            <p className="text-[#8A8AA0] mb-8 max-w-md mx-auto">
              Join the mission to fight misinformation across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free
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
    </main>
  );
}
