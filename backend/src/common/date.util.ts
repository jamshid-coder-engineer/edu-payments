/**
 * Sana bilan ishlash uchun yordamchi funksiyalar.
 * Barcha sanalar "YYYY-MM-DD", oylar esa "YYYY-MM" matni ko'rinishida.
 * ISO formatdagi bunday matnlarni oddiy solishtirish (<, >=) to'g'ri tartib beradi.
 */

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

/** "2026-02-30" kabi mavjud bo'lmagan sanalarni ham rad etadi. */
export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_REGEX.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/** Berilgan vaqt zonasidagi bugungi sana, masalan "2026-10-21". */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  // en-CA lokali sanani aynan YYYY-MM-DD ko'rinishida qaytaradi
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * Oy oralig'i: [start, end) — oyning 1-kunidan keyingi oyning 1-kunigacha.
 * Masalan "2026-12" -> { start: "2026-12-01", end: "2027-01-01" }.
 */
export function monthRange(month: string): { start: string; end: string } {
  const [y, m] = month.split('-').map(Number);
  const nextY = m === 12 ? y + 1 : y;
  const nextM = m === 12 ? 1 : m + 1;
  return {
    start: `${month}-01`,
    end: `${nextY}-${String(nextM).padStart(2, '0')}-01`,
  };
}
