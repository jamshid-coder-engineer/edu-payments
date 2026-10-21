/**
 * Sanalar backend bilan bir xil: "YYYY-MM-DD", oylar "YYYY-MM".
 * Brauzerning mahalliy vaqti ishlatiladi (foydalanuvchi Toshkentda).
 */

const MONTH_NAMES = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
];

const pad = (n: number) => String(n).padStart(2, '0');

export function todayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function currentMonth(now: Date = new Date()): string {
  return todayIso(now).slice(0, 7);
}

/** "2026-10" + (-1) -> "2026-09" */
export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

/** "2026-02" -> "2026-02-28" */
export function lastDayOfMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${month}-${pad(new Date(y, m, 0).getDate())}`;
}

/** "2026-10" -> "Oktabr 2026" */
export function formatMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** "2026-10-05" -> "5-oktabr 2026" */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${d}-${MONTH_NAMES[m - 1].toLowerCase()} ${y}`;
}

/**
 * To'lov formasi uchun boshlang'ich sana: joriy oy bo'lsa bugun,
 * o'tgan oy bo'lsa o'sha oyning oxirgi kuni (to'lov shu oy hisobiga tushadi).
 */
export function defaultPaymentDate(
  month: string,
  today: string = todayIso(),
): string {
  const last = lastDayOfMonth(month);
  return last < today ? last : today;
}
