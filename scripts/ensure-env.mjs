// backend/.env bo'lmasa .env.example dan nusxa oladi. Mavjud .env ga tegmaydi.
import { copyFileSync, existsSync } from 'node:fs';

const target = 'backend/.env';
if (existsSync(target)) {
  console.log(`${target} mavjud, o'zgartirilmadi`);
} else {
  copyFileSync('backend/.env.example', target);
  console.log(`${target} yaratildi (.env.example dan)`);
}
