'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Heart, Shield } from 'lucide-react';

const LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Technology',   href: '/technology' },
  { label: 'About',        href: '/about' },
  { label: 'Analyze',      href: '/analyze' },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-t mt-auto"
      style={{ borderColor: 'var(--bg-border)' }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(79,142,255,0.4), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Mitra<span className="text-[#4F8EFF]">AI</span>
              </span>
              <div className="live-dot" title="Live service" />
            </div>
            <p className="text-xs max-w-xs" style={{ color: 'var(--text-muted)' }}>
              India&apos;s first multimodal AI misinformation detector — supporting all 23 official Indian languages.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="link-underline text-xs transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="glow-divider mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-[#4F8EFF]" />
            <span>Powered by Google Gemini 2.5 Flash · 9-step pipeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-400" />
            <span>by Aayush Joshi ·</span>
            <a
              href="https://github.com/Aayush1803/MitraAi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Github className="w-3 h-3" />
              Open Source
            </a>
          </div>
          <span>© {new Date().getFullYear()} Mitra AI</span>
        </div>
      </div>
    </motion.footer>
  );
}
