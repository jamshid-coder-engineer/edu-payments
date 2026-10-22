import { afterEach, describe, expect, it } from 'vitest';
import { followSystemTheme, getTheme, setTheme } from '../theme';

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('theme', () => {
  it("tanlov saqlanadi va html'ga qo'llanadi", () => {
    setTheme('dark');
    expect(getTheme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    setTheme('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('saqlangan tanlov tizim sozlamasidan ustun', () => {
    localStorage.setItem('theme', 'dark');
    const stop = followSystemTheme(); // test muhitida tizim rejimi yorug'
    expect(getTheme()).toBe('dark');
    stop();
  });
});
