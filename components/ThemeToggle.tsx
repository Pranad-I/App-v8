'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { getThemeTransitionStyle } from '@/lib/themeTransition';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: we don't know the resolved theme until mounted.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === 'dark';

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = isDark ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }

    const style = getThemeTransitionStyle();

    if (style === 'wipe') {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      document.documentElement.classList.add('wipe-transition');
      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 550,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });

      transition.finished.then(() => {
        document.documentElement.classList.remove('wipe-transition');
      });
      return;
    }

    // Dissolve (default)
    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      <Sun className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
    </button>
  );
}
