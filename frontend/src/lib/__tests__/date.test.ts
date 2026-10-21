import { describe, expect, it } from 'vitest';
import {
  currentMonth,
  defaultPaymentDate,
  formatDate,
  formatMonth,
  lastDayOfMonth,
  shiftMonth,
  todayIso,
} from '../date';

describe('date', () => {
  it('todayIso va currentMonth mahalliy sanani beradi', () => {
    const now = new Date(2026, 0, 5, 23, 59); // 5-yanvar, mahalliy vaqt
    expect(todayIso(now)).toBe('2026-01-05');
    expect(currentMonth(now)).toBe('2026-01');
  });

  it("shiftMonth yil chegarasidan to'g'ri o'tadi", () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-10', 0)).toBe('2026-10');
  });

  it('lastDayOfMonth kabisa yilini hisobga oladi', () => {
    expect(lastDayOfMonth('2026-02')).toBe('2026-02-28');
    expect(lastDayOfMonth('2028-02')).toBe('2028-02-29');
    expect(lastDayOfMonth('2026-10')).toBe('2026-10-31');
  });

  it("oy va sanani o'zbekcha ko'rsatadi", () => {
    expect(formatMonth('2026-10')).toBe('Oktabr 2026');
    expect(formatDate('2026-10-05')).toBe('5-oktabr 2026');
  });

  it("defaultPaymentDate: joriy oyda bugun, o'tgan oyda oyning oxirgi kuni", () => {
    expect(defaultPaymentDate('2026-10', '2026-10-21')).toBe('2026-10-21');
    expect(defaultPaymentDate('2026-09', '2026-10-21')).toBe('2026-09-30');
  });
});
