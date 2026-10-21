import { appToday } from '../src/common/app-config';
import { useTestApp } from './support/test-app';

describe('payments (e2e)', () => {
  const { http, createStudent, addPayment, prisma } = useTestApp();

  it("to'lov qo'shish va o'quvchi tarixi (eng yangisi birinchi)", async () => {
    const { id } = await createStudent();
    await addPayment(id, 200_000, '2026-09-05').expect(201);
    await addPayment(id, 300_000, '2026-10-03').expect(201);

    const res = await http().get(`/students/${id}/payments`).expect(200);
    expect(res.body.map((p: { paidAt: string }) => p.paidAt)).toEqual([
      '2026-10-03',
      '2026-09-05',
    ]);
  });

  it("paidAt berilmasa bugungi sana qo'yiladi", async () => {
    const { id } = await createStudent();
    const res = await addPayment(id, 100_000).expect(201);
    expect(res.body.paidAt).toBe(appToday());
  });

  it.each([
    ['summa nol', 0, undefined],
    ['summa kasr', 1.5, undefined],
    ["sana formati noto'g'ri", 100, '21.10.2026'],
    ['sana kelajakda', 100, '2999-01-01'],
    ["o'quvchi qo'shilishidan oldin", 100, '2026-07-31'],
  ])('400: %s', async (_case, amount, paidAt) => {
    const { id } = await createStudent(); // joinedAt: 2026-08-01
    await addPayment(id, amount, paidAt).expect(400);
  });

  it("400: studentId juda katta yoki noto'g'ri", async () => {
    await addPayment(99_999_999_999, 100).expect(400);
    await addPayment(0, 100).expect(400);
  });

  it("404: mavjud bo'lmagan o'quvchi", async () => {
    await addPayment(9999, 100_000).expect(404);
    await http().get('/students/9999/payments').expect(404);
  });

  it("o'quvchi o'chirilsa uning to'lovlari ham o'chadi", async () => {
    const { id } = await createStudent();
    await addPayment(id, 100_000, '2026-10-01').expect(201);
    await http().delete(`/students/${id}`).expect(200);
    expect(await prisma().payment.count()).toBe(0);
  });
});
