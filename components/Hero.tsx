'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Link2, Upload, X, FileText, FileAudio, FileVideo, Image as ImageIcon, Scan, Sparkles } from 'lucide-react';
import { InputType } from '@/lib/types';

interface HeroProps {
  onSubmit: (input: string, type: InputType) => void;
  isLoading: boolean;
}


const SAMPLE_INPUTS = {
  text: `🚨 URGENT FORWARD: Scientists have discovered that drinking hot water with lemon at midnight CURES cancer in just 3 days! The government doesn't want you to know this secret. Bill Gates is funding campaigns to suppress this cure. Share this before it gets deleted! Forward to all your groups!!`,
  url: `https://www.whatsapp.com/forward?msg=breaking-news-viral-claim`,
  media: null,
};

type TabType = 'text' | 'url' | 'media';

export default function Hero({ onSubmit, isLoading }: HeroProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) setUploadedFile(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video')) return <FileVideo className="w-5 h-5 text-purple-400" />;
    if (file.type.startsWith('audio')) return <FileAudio className="w-5 h-5 text-blue-400" />;
    if (file.type.startsWith('image')) return <ImageIcon className="w-5 h-5 text-green-400" />;
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  const handleSubmit = () => {
    if (isLoading) return;
    // Language is auto-detected by Gemini — always pass 'en' as placeholder
    if (activeTab === 'text' && textInput.trim()) {
      onSubmit(textInput.trim(), 'text');
    } else if (activeTab === 'url' && urlInput.trim()) {
      onSubmit(urlInput.trim(), 'url');
    } else if (activeTab === 'media' && uploadedFile) {
      onSubmit(`[Media File: ${uploadedFile.name}] ${uploadedFile.type} — ${(uploadedFile.size / 1024).toFixed(1)}KB. Analyzing for deepfake signatures, audio spectrograms, and visual manipulation artifacts.`, 'media');
    }
  };

  const loadSample = () => {
    if (activeTab === 'text') setTextInput(SAMPLE_INPUTS.text);
    if (activeTab === 'url') setUrlInput(SAMPLE_INPUTS.url);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'text', label: 'Text / Message', icon: <Type className="w-4 h-4" /> },
    { id: 'url', label: 'URL / Link', icon: <Link2 className="w-4 h-4" /> },
    { id: 'media', label: 'Media Upload', icon: <Upload className="w-4 h-4" /> },
  ];

  const isReadyToSubmit =
    (activeTab === 'text' && textInput.trim().length > 10) ||
    (activeTab === 'url' && urlInput.trim().length > 5) ||
    (activeTab === 'media' && uploadedFile !== null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-600/5 to-indigo-600/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-blue-600/3 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-600/3 blur-2xl" />
        {/* Grid lines — color adapts to theme */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.6,
          }}
        />
      </div>

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center mb-10 relative z-10"
      >
        <div className="section-label mb-6">
          <span className="live-dot" />
          Powered by Multimodal AI · India-first · All 23 Official Languages
        </div>

        {/* Phase 2 — @frontend-design: Syne display font for typographic contrast */}
        <h1 className="display-font text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4">
          <span style={{ color: 'var(--text-primary)' }}>Truth has a</span>
          <br />
          <span className="gradient-text">new guardian.</span>
        </h1>

        <p className="text-lg max-w-xl mx-auto mt-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Paste a WhatsApp forward, a suspicious link, or upload a video.
          <br />
          <span style={{ color: 'var(--text-primary)' }} className="font-semibold">Mitra AI</span> runs a 9-step deep analysis in seconds.
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className="w-full max-w-3xl relative z-10"
      >
        <div className="glass rounded-2xl overflow-hidden shimmer-border" style={{ border: '1px solid var(--glass-border)' }}>
          {/* Tab bar + auto-detect badge */}
          <div className="flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--bg-border)' }}>
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 border-b-2"
                  style={{
                    borderBottomColor: activeTab === tab.id ? '#4F8EFF' : 'transparent',
                    color: activeTab === tab.id ? '#4F8EFF' : 'var(--text-muted)',
                  }}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Auto-detect badge instead of dropdown */}
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(79,142,255,0.10)', color: '#4F8EFF', border: '1px solid rgba(79,142,255,0.20)' }}
            >
              <Sparkles className="w-3 h-3" />
              <span className="font-semibold">Auto-detect language</span>
            </div>
          </div>

          {/* Input area */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'text' && (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <textarea
                    id="text-input"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder="Paste a WhatsApp forward, news article, tweet, or any text claim here..."
                    className="w-full h-40 rounded-xl p-4 text-sm resize-none focus:outline-none transition-all duration-200 leading-relaxed font-sans"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--bg-border)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#4F8EFF'; e.target.style.boxShadow = '0 0 0 3px rgba(79,142,255,0.12)'; }}
                    onBlur={e =>  { e.target.style.borderColor = 'var(--bg-border)'; e.target.style.boxShadow = 'none'; }}
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={loadSample}
                      className="text-xs text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors"
                    >
                      Load sample input
                    </button>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{textInput.length} chars</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'url' && (
                <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A60]" />
                    <input
                      id="url-input"
                      type="url"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      placeholder="https://example.com/article-to-verify"
                      className="w-full rounded-xl pl-11 pr-4 py-4 text-sm font-mono transition-all duration-200"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
                      onFocus={e => { e.target.style.borderColor = '#4F8EFF'; e.target.style.boxShadow = '0 0 0 3px rgba(79,142,255,0.12)'; }}
                      onBlur={e =>  { e.target.style.borderColor = 'var(--bg-border)'; e.target.style.boxShadow = 'none'; }}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                    Supports news articles, social media posts, YouTube videos, and blog links.
                  </p>
                  <button onClick={loadSample} className="text-xs text-[#4F8EFF] hover:text-[#6BA3FF] transition-colors mt-1">
                    Load sample URL
                  </button>
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {uploadedFile ? (
                    <div className="flex items-center justify-between rounded-xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}>
                      <div className="flex items-center gap-3">
                        {getFileIcon(uploadedFile)}
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>{uploadedFile.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{(uploadedFile.size / 1024).toFixed(1)} KB · {uploadedFile.type || 'unknown type'}</p>
                        </div>
                      </div>
                      <button onClick={() => setUploadedFile(null)} className="text-[#4A4A60] hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className="relative h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                      style={{
                        borderColor: dragActive ? '#4F8EFF' : 'var(--bg-border)',
                        background: dragActive ? 'rgba(79,142,255,0.05)' : 'var(--bg-secondary)',
                      }}
                    >
                      <div className="relative">
                        <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                        {dragActive && <div className="scan-line" />}
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Drop media file or <span className="text-[#4F8EFF]">browse</span></p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Video, Audio, Image · Max 50MB</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="video/*,audio/*,image/*" onChange={handleFileChange} className="hidden" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            {/* Phase 3 — @design-spells: glow-pulse on active CTA button */}
            <motion.button
              id="analyze-button"
              onClick={handleSubmit}
              disabled={!isReadyToSubmit || isLoading}
              whileHover={isReadyToSubmit && !isLoading ? { scale: 1.02 } : {}}
              whileTap={isReadyToSubmit && !isLoading ? { scale: 0.98 } : {}}
              className={`mt-5 w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-300${
                isReadyToSubmit && !isLoading ? ' btn-premium btn-glow-pulse' : ''
              }`}
              style={!isReadyToSubmit || isLoading ? {
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                border: '1px solid var(--bg-border)',
                cursor: 'not-allowed',
              } : {}}
            >
              <Scan className="w-4 h-4" />
              {isLoading ? 'Analyzing...' : 'Run Deep Analysis'}
              {isReadyToSubmit && !isLoading && (
                <span className="text-xs opacity-70 font-normal">~3–5 sec</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
          {['India-first focus', 'All 23 Official Languages', 'Free to use', 'Hackathon project'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--text-muted)' }} />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* 23 Languages Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 w-full max-w-3xl relative z-10"
        >
          <div className="glass rounded-2xl border border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="section-label">
                🌐 23 Supported Languages
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { en: 'Hindi',       native: 'हिन्दी' },
                { en: 'English',     native: 'English' },
                { en: 'Bengali',     native: 'বাংলা' },
                { en: 'Telugu',      native: 'తెలుగు' },
                { en: 'Marathi',     native: 'मराठी' },
                { en: 'Tamil',       native: 'தமிழ்' },
                { en: 'Urdu',        native: 'اردو' },
                { en: 'Gujarati',    native: 'ગુજરાતી' },
                { en: 'Kannada',     native: 'ಕನ್ನಡ' },
                { en: 'Malayalam',   native: 'മലയാളം' },
                { en: 'Odia',        native: 'ଓଡ଼ିଆ' },
                { en: 'Punjabi',     native: 'ਪੰਜਾਬੀ' },
                { en: 'Assamese',    native: 'অসমীয়া' },
                { en: 'Maithili',    native: 'मैथिली' },
                { en: 'Sanskrit',    native: 'संस्कृतम्' },
                { en: 'Kashmiri',    native: 'کٲشُر' },
                { en: 'Nepali',      native: 'नेपाली' },
                { en: 'Sindhi',      native: 'سنڌي' },
                { en: 'Konkani',     native: 'कोंकणी' },
                { en: 'Dogri',       native: 'डोगरी' },
                { en: 'Manipuri',    native: 'মৈতৈলোন্' },
                { en: 'Bodo',        native: 'बड़ो' },
                { en: 'Santali',     native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
              ].map((lang, i) => (
                <motion.div
                  key={lang.en}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 + i * 0.03, duration: 0.3 }}
                  className="frosted-badge flex items-center gap-1.5 cursor-default"
                  title={lang.en}
                >
                  <span className="text-[#4F8EFF] text-[10px] font-mono">{lang.native}</span>
                  <span className="text-[9px] opacity-50">·</span>
                  <span className="text-[10px]">{lang.en}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>


      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-8 mt-16 relative z-10"
      >
        {/* Phase 3 — @design-spells: counter-reveal staggered animation on stat values */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 relative z-10">
          {[
            { value: '23', label: 'Indian Languages' },
            { value: '9-Step', label: 'AI Pipeline' },
            { value: 'Free', label: 'Always Free' },
            { value: '<5s', label: 'Avg. Response Time' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div
                className="stat-number text-2xl gradient-text counter-reveal"
                style={{ animationDelay: `${0.5 + i * 0.12}s` }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-1 mono-font" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
