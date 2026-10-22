import type { Payment } from '@/types/api';

export interface MonthGroup {
  month: string; // YYYY-MM
  total: number;
  payments: Payment[];
}

/** To'lovlarni oy bo'yicha guruhlaydi: qarz oylik hisoblangani uchun tarix ham oylik ko'rinadi. */
export function groupByMonth(payments: Payment[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();
  for (const payment of payments) {
    const month = payment.paidAt.slice(0, 7);
    const group = groups.get(month) ?? { month, total: 0, payments: [] };
    group.total += payment.amount;
    group.payments.push(payment);
    groups.set(month, group);
  }
  // Oylar yangisidan eskisiga; oy ichida tartib backenddagidek qoladi
  return [...groups.values()].sort((a, b) => b.month.localeCompare(a.month));
}

/** Tanlangan oy to'lovsiz bo'lsa ham tarixda ko'rinsin: qarz aynan shu oy uchun ko'rsatilgan. */
export function withMonth(groups: MonthGroup[], month: string): MonthGroup[] {
  if (groups.some((g) => g.month === month)) return groups;
  return [...groups, { month, total: 0, payments: [] }].sort((a, b) =>
    b.month.localeCompare(a.month),
  );
}
