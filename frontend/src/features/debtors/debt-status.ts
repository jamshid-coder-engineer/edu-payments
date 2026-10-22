import type { Debtor } from '@/types/api';

export type DebtStatus = 'unpaid' | 'partial';

/** Qarzdor holati: shu oy umuman to'lamagan yoki qisman to'lagan. */
export function debtStatus(debtor: Pick<Debtor, 'paid'>): DebtStatus {
  return debtor.paid > 0 ? 'partial' : 'unpaid';
}

/** Holatning ko'rinishi bir joyda: yorliq, rang chizig'i va progress rangi. */
export const STATUS_STYLE: Record<
  DebtStatus,
  { label: string; badge: string; accent: string; progress: string }
> = {
  unpaid: {
    label: "To'lamagan",
    badge: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
    accent: 'bg-destructive',
    progress: '*:data-[slot=progress-indicator]:bg-destructive',
  },
  partial: {
    label: 'Qisman',
    badge: 'bg-warning/15 text-warning dark:bg-warning/20',
    accent: 'bg-warning',
    progress: '*:data-[slot=progress-indicator]:bg-warning',
  },
};
