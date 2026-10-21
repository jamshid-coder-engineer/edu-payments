/**
 * Namunaviy ma'lumotlar. Sanalar joriy oyga nisbatan hisoblanadi, shuning uchun
 * qaysi kuni ishga tushirilsa ham qarzdorlar ro'yxatida turli holatlar ko'rinadi.
 * Qayta ishga tushirilsa, eski ma'lumotlar o'chirilib, yangidan yoziladi.
 */
import { PrismaClient } from '@prisma/client';
import { appToday } from '../src/common/app-config';

const prisma = new PrismaClient();

const today = appToday();
const [year, month, todayDay] = today.split('-').map(Number);

const pad = (n: number) => String(n).padStart(2, '0');
const shiftMonth = (offset: number) => {
  const d = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};
const thisMonth = shiftMonth(0);
const prevMonth = shiftMonth(-1);
const nextMonth = shiftMonth(1);

/** Joriy oy uchun kun; bugundan keyingi kun bo'lsa bugun olinadi (kelajakdagi to'lov bo'lmaydi). */
const thisMonthDay = (day: number) =>
  `${thisMonth}-${pad(Math.min(day, todayDay))}`;

type SeedStudent = {
  name: string;
  phone: string;
  group: string;
  monthlyFee: number;
  joinedAt: string;
  payments: { amount: number; paidAt: string }[];
};

const students: SeedStudent[] = [
  {
    name: 'Aliyev Vali',
    phone: '+998901234567',
    group: 'Frontend-1',
    monthlyFee: 500_000,
    joinedAt: `${prevMonth}-01`,
    payments: [
      { amount: 500_000, paidAt: `${prevMonth}-03` },
      { amount: 500_000, paidAt: thisMonthDay(2) }, // to'liq to'lagan
    ],
  },
  {
    name: 'Karimova Malika',
    phone: '+998911112233',
    group: 'Frontend-1',
    monthlyFee: 500_000,
    joinedAt: `${prevMonth}-01`,
    payments: [
      { amount: 500_000, paidAt: `${prevMonth}-05` },
      { amount: 300_000, paidAt: thisMonthDay(4) }, // qisman: qarz 200 000
    ],
  },
  {
    name: 'Rahimov Sardor',
    phone: '+998935556677',
    group: 'Frontend-1',
    monthlyFee: 500_000,
    joinedAt: `${prevMonth}-01`,
    payments: [{ amount: 250_000, paidAt: `${prevMonth}-10` }], // shu oy umuman to'lamagan
  },
  {
    name: 'Tursunova Dilnoza',
    phone: '+998977778899',
    group: 'Backend-1',
    monthlyFee: 700_000,
    joinedAt: `${prevMonth}-01`,
    payments: [
      { amount: 700_000, paidAt: `${prevMonth}-02` },
      { amount: 200_000, paidAt: thisMonthDay(1) }, // bir oyda bir nechta to'lov
      { amount: 200_000, paidAt: thisMonthDay(8) }, // jami 400 000, qarz 300 000
    ],
  },
  {
    name: 'Usmonov Jasur',
    phone: '+998990001122',
    group: 'Backend-1',
    monthlyFee: 700_000,
    joinedAt: `${prevMonth}-01`,
    payments: [
      { amount: 1_400_000, paidAt: `${prevMonth}-15` }, // ortiqcha to'lov keyingi oyga o'tmaydi
    ],
  },
  {
    name: 'Nazarova Shahzoda',
    phone: '+998881234500',
    group: 'English-A',
    monthlyFee: 400_000,
    joinedAt: thisMonthDay(10), // shu oy qo'shilgan: shu oy uchun qarzdor
    payments: [],
  },
  {
    name: 'Ergashev Bekzod',
    phone: '+998945550011',
    group: 'English-A',
    monthlyFee: 400_000,
    joinedAt: `${prevMonth}-01`,
    payments: [{ amount: 400_000, paidAt: thisMonthDay(6) }],
  },
  {
    name: 'Qodirova Madina',
    phone: '+998903332211',
    group: 'English-A',
    monthlyFee: 400_000,
    joinedAt: `${nextMonth}-01`, // keyingi oydan boshlaydi: shu oy qarzdor emas
    payments: [],
  },
];

async function main() {
  await prisma.payment.deleteMany();
  await prisma.student.deleteMany();

  for (const { payments, ...data } of students) {
    await prisma.student.create({
      data: { ...data, payments: { create: payments } },
    });
  }

  console.log(
    `Seed tayyor: ${students.length} o'quvchi. Joriy oy: ${thisMonth}, o'tgan oy: ${prevMonth}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
