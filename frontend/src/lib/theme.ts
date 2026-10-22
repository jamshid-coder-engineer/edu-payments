import { useSyncExternalStore } from 'react';

/**
 * Yorug'/qorong'i rejim. Standart: telefon yoki kompyuter sozlamasi.
 * Foydalanuvchi tanlasa, tanlov brauzerda eslab qolinadi.
 * Birinchi chizishdan oldin index.html dagi kichik skript ham xuddi shu qoidani qo'llaydi.
 */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const listeners = new Set<() => void>();

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null; // maxfiy rejim yoki bloklangan saqlash
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  listeners.forEach((notify) => notify());
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // saqlab bo'lmasa ham shu sessiyada ishlayveradi
  }
  apply(theme);
}

/** Tizim rejimi o'zgarsa, foydalanuvchi o'zi tanlamagan bo'lsa unga ergashamiz. */
export function followSystemTheme(): () => void {
  apply(readStored() ?? systemTheme());
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => readStored() ?? apply(systemTheme());
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => 'light');
}
