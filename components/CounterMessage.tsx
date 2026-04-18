'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, Check, Share2 } from 'lucide-react';
import { CounterMessage as CounterMessageType } from '@/lib/types';

interface CounterMessageProps {
  data: CounterMessageType;
}

export default function CounterMessage({ data }: CounterMessageProps) {
  const [copied, setCopied] = useState<'main' | 'wa' | null>(null);

  const handleCopy = async (text: string, type: 'main' | 'wa') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(data.whatsappText)}`;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Suggested Counter Message</h3>
      </div>

      <div className="space-y-4">
        {/* Main counter message */}
        <div className="relative p-4 rounded-xl transition-colors group" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Social Media Ready</p>
            <motion.button
              id="copy-counter-btn"
              onClick={() => handleCopy(data.text, 'main')}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
                copied === 'main'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#4F8EFF]/10 text-[#4F8EFF] border border-[#4F8EFF]/20 hover:bg-[#4F8EFF]/20'
              }`}
            >
              <AnimatePresence mode="wait">
                {copied === 'main' ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Copied!
                  </motion.span>
                ) : (
                  <motion.span key="copy" className="flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy Text
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{data.text}</p>
        </div>

        {/* WhatsApp version */}
        <div className="relative p-4 bg-gradient-to-br from-green-900/10 to-green-800/5 border border-green-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">W</span>
              </div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">WhatsApp Format</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => handleCopy(data.whatsappText, 'wa')}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
                  copied === 'wa'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                }`}
              >
                {copied === 'wa' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === 'wa' ? 'Copied!' : 'Copy'}
              </motion.button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                <Share2 className="w-3 h-3" /> Share
              </a>
            </div>
          </div>
          <pre className="text-xs text-green-200/80 leading-relaxed whitespace-pre-wrap font-mono bg-green-900/10 rounded-lg p-3">
            {data.whatsappText}
          </pre>
        </div>
      </div>
    </div>
  );
}
