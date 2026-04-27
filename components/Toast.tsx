'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

interface ToastCtx { show: (message: string, type?: ToastType) => void; }
const ToastContext = createContext<ToastCtx>({ show: () => {} });

export function useToast() { return useContext(ToastContext); }

const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />,
  error:   <XCircle      className="w-4 h-4 text-[#EF4444]" />,
  info:    <Info         className="w-4 h-4 text-[#4F8EFF]" />,
};
const COLORS = {
  success: 'rgba(34,197,94,0.12)',
  error:   'rgba(239,68,68,0.12)',
  info:    'rgba(79,142,255,0.12)',
};
const BORDERS = {
  success: 'rgba(34,197,94,0.25)',
  error:   'rgba(239,68,68,0.25)',
  info:    'rgba(79,142,255,0.25)',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counterRef.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0,  scale: 1   }}
              exit={{    opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm backdrop-blur-md"
              style={{
                background: COLORS[t.type],
                border: `1px solid ${BORDERS[t.type]}`,
                color: 'var(--text-primary)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                minWidth: 240,
                maxWidth: 360,
              }}
            >
              {ICONS[t.type]}
              <span className="flex-1 text-sm font-medium">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
