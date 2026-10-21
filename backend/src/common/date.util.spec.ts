import { isValidDate, monthRange, todayIn } from './date.util';

describe('date.util', () => {
  it("isValidDate: mavjud sanalarni qabul qiladi, noto'g'rilarini rad etadi", () => {
    expect(isValidDate('2026-10-21')).toBe(true);
    expect(isValidDate('2028-02-29')).toBe(true); // kabisa yili
    expect(isValidDate('2026-02-29')).toBe(false);
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('2026-13-01')).toBe(false);
    expect(isValidDate('2026-1-01')).toBe(false);
    expect(isValidDate('2026-10-21T10:00:00Z')).toBe(false);
    expect(isValidDate(20261021)).toBe(false);
  });

  it('monthRange: [1-kun, keyingi oyning 1-kuni)', () => {
    expect(monthRange('2026-10')).toEqual({
      start: '2026-10-01',
      end: '2026-11-01',
    });
    expect(monthRange('2026-12')).toEqual({
      start: '2026-12-01',
      end: '2027-01-01',
    });
  });

  it("todayIn: sana vaqt zonasi bo'yicha aniqlanadi", () => {
    // UTC bo'yicha 31-oktabr 20:00 — Toshkentda (UTC+5) allaqachon 1-noyabr
    const now = new Date('2026-10-31T20:00:00Z');
    expect(todayIn('UTC', now)).toBe('2026-10-31');
    expect(todayIn('Asia/Tashkent', now)).toBe('2026-11-01');
  });
});
