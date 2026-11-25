import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'leetcode-visual-guide-progress-v1';
const FOCUS_KEY = 'leetcode-visual-guide-focus-v1';

interface Progress {
  read: number[];
  completed: number[];
}

function readProgress(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return {
      read: Array.isArray(value.read) ? value.read.filter(Number.isFinite) : [],
      completed: Array.isArray(value.completed) ? value.completed.filter(Number.isFinite) : [],
    };
  } catch {
    return { read: [], completed: [] };
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(readProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Reading remains available when storage is disabled.
    }
  }, [progress]);

  const markRead = useCallback((id: number) => {
    setProgress((current) => current.read.includes(id) ? current : { ...current, read: [...current.read, id] });
  }, []);

  const toggleCompleted = useCallback((id: number) => {
    setProgress((current) => ({
      ...current,
      completed: current.completed.includes(id)
        ? current.completed.filter((item) => item !== id)
        : [...current.completed, id],
    }));
  }, []);

  return { ...progress, markRead, toggleCompleted };
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useFocusMode() {
  const [focus, setFocus] = useState(() => {
    try { return localStorage.getItem(FOCUS_KEY) === 'true'; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.dataset.focus = focus ? 'true' : 'false';
    try { localStorage.setItem(FOCUS_KEY, String(focus)); } catch { /* Optional preference. */ }
  }, [focus]);
  return { focus, toggleFocus: () => setFocus((value) => !value) };
}

export function useReadingProgress(dependency: string) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(available > 0 ? Math.min(100, Math.max(0, (window.scrollY / available) * 100)) : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [dependency]);
  return progress;
}
