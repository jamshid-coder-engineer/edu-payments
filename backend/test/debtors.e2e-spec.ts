import { useTestApp, validStudent } from './support/test-app';

describe('debtors (e2e)', () => {
  const { http, createStudent, addPayment } = useTestApp();

  it("faqat qarzdorlar qaytadi, qarz to'g'ri hisoblanadi", async () => {
    const full = await createStudent({ name: "To'liq" });
    const partial = await createStudent({ name: 'Qisman' });
    const none = await createStudent({ name: "To'lamagan" });
    await createStudent({ name: 'Keyin kelgan', joinedAt: '2026-10-10' });

    // Sanalar o'tmishda: kelajakdagi to'lov API tomonidan rad etiladi
    await addPayment(full.id, 500_000, '2026-09-01').expect(201); // oyning 1-kuni
    await addPayment(partial.id, 300_000, '2026-09-30').expect(201); // oxirgi kuni
    await addPayment(none.id, 500_000, '2026-08-31').expect(201); // oldingi oy

    const res = await http().get('/debtors?month=2026-09').expect(200);
    expect(res.body).toEqual([
      {
        studentId: none.id,
        name: "To'lamagan",
        phone: validStudent.phone,
        group: validStudent.group,
        monthlyFee: 500_000,
        paid: 0,
        debt: 500_000,
      },
      expect.objectContaining({
        studentId: partial.id,
        paid: 300_000,
        debt: 200_000,
      }),
    ]);
  });

  it.each(['', '2026-13', '2026-1', '10-2026', 'abc'])(
    '400: month=%p',
    async (month) => {
      await http().get(`/debtors?month=${month}`).expect(400);
    },
  );

  it('400: month berilmasa', async () => {
    await http().get('/debtors').expect(400);
  });
});
