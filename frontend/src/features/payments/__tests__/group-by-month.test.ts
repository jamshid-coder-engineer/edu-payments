import { describe, expect, it } from 'vitest';
import { groupByMonth, withMonth } from '../group-by-month';

const pay = (id: number, paidAt: string, amount: number) => ({
  id,
  studentId: 1,
  amount,
  paidAt,
});

describe('groupByMonth', () => {
  it("oylar bo'yicha guruhlaydi, jami hisoblaydi, yangi oy birinchi", () => {
    const groups = groupByMonth([
      pay(3, '2026-10-15', 200_000),
      pay(2, '2026-10-02', 100_000),
      pay(1, '2026-09-30', 600_000),
    ]);

    expect(groups.map((g) => [g.month, g.total])).toEqual([
      ['2026-10', 300_000],
      ['2026-09', 600_000],
    ]);
    expect(groups[0].payments.map((p) => p.id)).toEqual([3, 2]);
  });

  it("dekabr va yanvar alohida, yillar to'g'ri tartiblanadi", () => {
    const groups = groupByMonth([
      pay(1, '2025-12-31', 1),
      pay(2, '2026-01-01', 1),
    ]);
    expect(groups.map((g) => g.month)).toEqual(['2026-01', '2025-12']);
  });

  it("bo'sh ro'yxat uchun bo'sh natija", () => {
    expect(groupByMonth([])).toEqual([]);
  });

  it("withMonth to'lovsiz oyni o'z joyiga qo'shadi, bor bo'lsa tegmaydi", () => {
    const groups = groupByMonth([
      pay(2, '2026-10-01', 1),
      pay(1, '2026-08-01', 1),
    ]);
    expect(withMonth(groups, '2026-09').map((g) => g.month)).toEqual([
      '2026-10',
      '2026-09',
      '2026-08',
    ]);
    expect(withMonth(groups, '2026-10')).toBe(groups);
  });
});
