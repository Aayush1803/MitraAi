'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Zap, ChevronDown, LogOut, User, BarChart3, Sun, Moon, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const NAV_LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Technology',   href: '/technology' },
  { label: 'About',        href: '/about' },
];

export default function NavBar() {
  const { data: session, status } = useSession();
  const { theme, toggle } = useTheme();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Scroll-driven opacity / blur enhancement
  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY, [0, 80], [
    '0 4px 16px rgba(0,0,0,0.10)',
    '0 8px 40px rgba(0,0,0,0.28)',
  ]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current   && !menuRef.current.contains(e.target as Node))   setMenuOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const user     = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.nav
        style={{ boxShadow: navShadow }}
        className="floating-nav pointer-events-auto w-full max-w-5xl rounded-2xl px-4 h-14 flex items-center justify-between"
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href={session ? '/analyze' : '/'} className="flex items-center gap-2.5 group flex-shrink-0">
          <motion.div
            whileHover={{ rotate: [0, -6, 6, 0], scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative w-8 h-8 flex-shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Mitra AI Logo"
              width={32}
              height={32}
              className="rounded-full object-cover ring-2 ring-[#4F8EFF]/30 group-hover:ring-[#4F8EFF]/60 transition-all"
              priority
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4F8EFF]/0 to-[#7C3AED]/0 group-hover:from-[#4F8EFF]/20 group-hover:to-[#7C3AED]/20 transition-all blur-sm" />
          </motion.div>
          <span style={{ color: 'var(--text-primary)' }} className="font-bold text-base tracking-tight">
            Mitra<span className="text-[#4F8EFF]"> AI</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono border rounded px-1.5 py-0.5"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--bg-border)' }}>
            v2
          </span>
        </Link>

        {/* ── Center Nav (desktop) ──────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-3 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 group"
              style={{ color: 'var(--text-secondary)' }}
            >
              <motion.span
                whileHover={{ color: 'var(--text-primary)' }}
                className="relative z-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </motion.span>
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--bg-hover)' }}
              />
            </Link>
          ))}
        </div>

        {/* ── Right Side ───────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Status dot */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 border"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--bg-border)', background: 'var(--bg-secondary)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="hidden lg:inline">Online</span>
          </div>

          {/* Theme toggle */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-200"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1 }}
                exit={{   rotate:  90,  opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark'
                  ? <Sun  className="w-3.5 h-3.5 text-amber-400" />
                  : <Moon className="w-3.5 h-3.5 text-indigo-500" />
                }
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Auth section */}
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'var(--bg-border)' }} />
          ) : session ? (
            /* ── Signed in ── */
            <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 border rounded-xl px-2 py-1.5 transition-all duration-200"
                style={{ background: 'var(--bg-secondary)', borderColor: menuOpen ? '#4F8EFF' : 'var(--bg-border)' }}
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? 'User'}
                    width={26}
                    height={26}
                    className="rounded-full ring-2 ring-[#4F8EFF]/30"
                  />
                ) : (
                  <div className="w-6.5 h-6.5 w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] flex items-center justify-center text-[10px] font-bold text-white">
                    {initials}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate"
                  style={{ color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </motion.div>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -8 }}
                    animate={{ opacity: 1, scale: 1,    y: 0 }}
                    exit={{   opacity: 0, scale: 0.94,  y: -8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl overflow-hidden shadow-2xl"
                    style={{ border: '1px solid var(--glass-border)' }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--bg-border)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                      <p className="text-xs truncate mt-0.5"         style={{ color: 'var(--text-muted)'  }}>{user?.email}</p>
                    </div>

                    {[
                      { icon: <User      className="w-4 h-4" />, label: 'View Profile',  href: '/profile' },
                      { icon: <BarChart3 className="w-4 h-4" />, label: 'My Analyses',   href: '/profile#analyses' },
                    ].map(item => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span className="text-[#4F8EFF]">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t" style={{ borderColor: 'var(--bg-border)' }}>
                      <button
                        onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Signed out ── */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/"
                className="text-sm px-3 py-1.5 rounded-xl transition-all duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/?mode=signup"
                  className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED] hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden" ref={mobileRef}>
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90,  opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Mobile dropdown */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{   opacity: 0, scale: 0.95,  y: -8 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-4 top-[4.5rem] w-56 glass-strong rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: '1px solid var(--glass-border)' }}
                >
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-sm font-medium transition-colors border-b"
                        style={{ color: 'var(--text-secondary)', borderColor: 'var(--bg-border)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  {!session && (
                    <div className="p-3 flex flex-col gap-2">
                      <Link href="/" className="block text-center py-2 text-sm rounded-xl transition-colors"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-hover)' }}>
                        Sign In
                      </Link>
                      <Link href="/?mode=signup"
                        className="block text-center py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#4F8EFF] to-[#7C3AED]">
                        Get Started
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </motion.div>
  );
}
