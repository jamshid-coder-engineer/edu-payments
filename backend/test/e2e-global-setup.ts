import { execSync } from 'child_process';
import { join } from 'path';

/**
 * Test bazasiga (test.db) migratsiyalarni qo'llaydi.
 * Jadvallar har bir testdan oldin tozalanadi (support/test-app.ts, beforeEach). Fayllar ketma-ket ishlaydi (maxWorkers: 1), chunki baza bitta.
 */
export default function globalSetup(): void {
  execSync('npx prisma migrate deploy', {
    cwd: join(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'ignore',
  });
}
