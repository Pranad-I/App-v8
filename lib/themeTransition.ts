export type ThemeTransitionStyle = 'dissolve' | 'wipe';

const STORAGE_KEY = 'mlands-theme-transition';

export function getThemeTransitionStyle(): ThemeTransitionStyle {
  if (typeof window === 'undefined') return 'dissolve';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'wipe' ? 'wipe' : 'dissolve';
}

export function setThemeTransitionStyle(style: ThemeTransitionStyle) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, style);
}
