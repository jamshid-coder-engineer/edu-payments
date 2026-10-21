/** Ilova sozlamalari (.env dan). */
import { todayIn } from './date.util';

export const DEFAULT_TIMEZONE = 'Asia/Tashkent';
export const DEFAULT_CORS_ORIGIN = 'http://localhost:5173';

export function appTimezone(): string {
  return process.env.APP_TIMEZONE || DEFAULT_TIMEZONE;
}

/** Ilova vaqt zonasidagi bugungi sana (YYYY-MM-DD). */
export function appToday(): string {
  return todayIn(appTimezone());
}

/** Frontend manzillari, vergul bilan: "http://localhost:5173,http://192.168.1.5:5173". */
export function corsOrigins(): string[] {
  return (process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** Bitta IP dan daqiqasiga ruxsat etilgan so'rovlar soni. */
export function rateLimitPerMinute(): number {
  return Number(process.env.RATE_LIMIT_PER_MINUTE) || 120;
}
