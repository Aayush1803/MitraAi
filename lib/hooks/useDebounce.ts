// Phase 4 — @react-patterns skill
// Extract per Hook rule: "When the same fetch/state logic appears in a component, extract it."
// useDebounce — prevents firing the AI API on every keystroke if we ever make live preview real.

import { useState, useEffect } from 'react';

/**
 * Debounces a value by `delay` milliseconds.
 * @react-patterns: extract reusable hook when the same debounce pattern would repeat
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
