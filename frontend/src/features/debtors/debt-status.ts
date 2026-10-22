import type { Debtor } from '@/types/api';

export type DebtStatus = 'unpaid' | 'partial';

/** Qarzdor holati: shu oy umuman to'lamagan yoki qisman to'lagan. */
export function debtStatus(debtor: Pick<Debtor, 'paid'>): DebtStatus {
  return debtor.paid > 0 ? 'partial' : 'unpaid';
}

/** Holat faqat yorliq bilan ko'rsatiladi: matni va rangi shu yerda. */
export const STATUS_STYLE: Record<
  DebtStatus,
  { label: string; badge: string }
> = {
  unpaid: {
    label: "To'lamagan",
    badge: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
  },
  partial: {
    label: 'Qisman',
    badge: 'bg-warning/15 text-warning dark:bg-warning/20',
  },
};
