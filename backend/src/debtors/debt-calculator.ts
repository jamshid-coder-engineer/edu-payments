import { monthRange } from '../common/date.util';

export interface StudentForDebt {
  id: number;
  name: string;
  phone: string;
  group: string;
  monthlyFee: number;
  joinedAt: string; // YYYY-MM-DD
}

export interface PaymentForDebt {
  studentId: number;
  amount: number;
  paidAt: string; // YYYY-MM-DD
}

export interface DebtorRow {
  studentId: number;
  name: string;
  phone: string;
  group: string;
  monthlyFee: number;
  paid: number;
  debt: number;
}

/**
 * Tanlangan oy uchun qarzdorlarni hisoblaydi.
 *
 *   qarz = max(0, monthlyFee - shu oydagi to'lovlar yig'indisi)
 *
 * Qoidalar:
 * - Oy oralig'i: [oyning 1-kuni, keyingi oyning 1-kuni).
 * - Tanlangan oy tugaganidan keyin qo'shilgan o'quvchi bu oy uchun qarzdor emas.
 * - Bir oydagi bir nechta to'lov qo'shib hisoblanadi.
 * - Ortiqcha to'lov keyingi oyga o'tkazilmaydi.
 * - Qarz joriy monthlyFee bo'yicha hisoblanadi (tarif tarixi saqlanmaydi).
 *
 * Natija qarz bo'yicha kamayish tartibida, teng bo'lsa ism bo'yicha.
 */
export function calculateDebtors(
  month: string,
  students: StudentForDebt[],
  payments: PaymentForDebt[],
): DebtorRow[] {
  const { start, end } = monthRange(month);

  const paidByStudent = new Map<number, number>();
  for (const p of payments) {
    if (p.paidAt < start || p.paidAt >= end) continue;
    paidByStudent.set(
      p.studentId,
      (paidByStudent.get(p.studentId) ?? 0) + p.amount,
    );
  }

  return students
    .filter((s) => s.joinedAt < end)
    .map((s) => {
      const paid = paidByStudent.get(s.id) ?? 0;
      return {
        studentId: s.id,
        name: s.name,
        phone: s.phone,
        group: s.group,
        monthlyFee: s.monthlyFee,
        paid,
        debt: Math.max(0, s.monthlyFee - paid),
      };
    })
    .filter((row) => row.debt > 0)
    .sort((a, b) => b.debt - a.debt || a.name.localeCompare(b.name));
}
