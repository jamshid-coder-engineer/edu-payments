/** Summalar butun so'mda. 1250000 -> "1 250 000 so'm" */
export function formatMoney(amount: number): string {
  return `${groupDigits(amount)} so'm`;
}

/** 1250000 -> "1 250 000" */
export function groupDigits(amount: number): string {
  return String(Math.trunc(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** "1 250 000" -> 1250000; raqam bo'lmasa NaN */
export function parseAmount(value: string): number {
  const digits = value.replace(/\s/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
}

/** Backenddagi chegara bilan bir xil (backend/src/common/limits.ts). */
export const MAX_AMOUNT = 100_000_000;
