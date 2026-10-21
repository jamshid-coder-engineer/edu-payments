import {
  calculateDebtors,
  PaymentForDebt,
  StudentForDebt,
} from './debt-calculator';

const student = (
  id: number,
  overrides: Partial<StudentForDebt> = {},
): StudentForDebt => ({
  id,
  name: `O'quvchi ${id}`,
  phone: '+998901234567',
  group: 'A',
  monthlyFee: 500_000,
  joinedAt: '2026-01-01',
  ...overrides,
});

const pay = (
  studentId: number,
  amount: number,
  paidAt: string,
): PaymentForDebt => ({
  studentId,
  amount,
  paidAt,
});

describe('calculateDebtors', () => {
  it("to'liq to'lagan o'quvchi qarzdor emas", () => {
    const result = calculateDebtors(
      '2026-10',
      [student(1)],
      [pay(1, 500_000, '2026-10-05')],
    );
    expect(result).toEqual([]);
  });

  it("qisman to'lagan o'quvchining qarzi = monthlyFee - to'langan (500 000 - 300 000)", () => {
    const result = calculateDebtors(
      '2026-10',
      [student(1)],
      [pay(1, 300_000, '2026-10-05')],
    );
    expect(result).toEqual([
      expect.objectContaining({
        studentId: 1,
        monthlyFee: 500_000,
        paid: 300_000,
        debt: 200_000,
      }),
    ]);
  });

  it("umuman to'lamagan o'quvchi to'liq summaga qarzdor", () => {
    const result = calculateDebtors('2026-10', [student(1)], []);
    expect(result).toEqual([
      expect.objectContaining({ paid: 0, debt: 500_000 }),
    ]);
  });

  it("bir oydagi bir nechta to'lov qo'shib hisoblanadi", () => {
    const payments = [
      pay(1, 100_000, '2026-10-01'),
      pay(1, 150_000, '2026-10-15'),
    ];
    expect(calculateDebtors('2026-10', [student(1)], payments)).toEqual([
      expect.objectContaining({ paid: 250_000, debt: 250_000 }),
    ]);

    payments.push(pay(1, 250_000, '2026-10-31'));
    expect(calculateDebtors('2026-10', [student(1)], payments)).toEqual([]);
  });

  it("oy chegarasidagi sanalar: 1-kun va oxirgi kun hisobga olinadi, qo'shni oylar olinmaydi", () => {
    const payments = [
      pay(1, 100_000, '2026-09-30'), // oldingi oy
      pay(1, 100_000, '2026-10-01'), // birinchi kun
      pay(1, 100_000, '2026-10-31'), // oxirgi kun
      pay(1, 100_000, '2026-11-01'), // keyingi oy
    ];
    expect(calculateDebtors('2026-10', [student(1)], payments)).toEqual([
      expect.objectContaining({ paid: 200_000, debt: 300_000 }),
    ]);
  });

  it("dekabr -> yanvar o'tishi to'g'ri ishlaydi", () => {
    const payments = [
      pay(1, 500_000, '2026-12-31'),
      pay(1, 500_000, '2027-01-01'),
    ];
    expect(calculateDebtors('2026-12', [student(1)], payments)).toEqual([]);
    expect(calculateDebtors('2027-01', [student(1)], payments)).toEqual([]);
    expect(calculateDebtors('2027-02', [student(1)], payments)).toEqual([
      expect.objectContaining({ debt: 500_000 }),
    ]);
  });

  it("tanlangan oydan keyin qo'shilgan o'quvchi o'sha oy uchun qarzdor emas", () => {
    const students = [student(1, { joinedAt: '2026-11-01' })];
    expect(calculateDebtors('2026-10', students, [])).toEqual([]);
    expect(calculateDebtors('2026-11', students, [])).toEqual([
      expect.objectContaining({ debt: 500_000 }),
    ]);
  });

  it("oy o'rtasida qo'shilgan o'quvchi shu oy uchun to'liq summaga qarzdor", () => {
    const students = [student(1, { joinedAt: '2026-10-20' })];
    expect(calculateDebtors('2026-10', students, [])).toEqual([
      expect.objectContaining({ debt: 500_000 }),
    ]);
  });

  it("ortiqcha to'lov keyingi oyga o'tkazilmaydi", () => {
    const payments = [pay(1, 1_000_000, '2026-10-10')];
    expect(calculateDebtors('2026-10', [student(1)], payments)).toEqual([]);
    expect(calculateDebtors('2026-11', [student(1)], payments)).toEqual([
      expect.objectContaining({ paid: 0, debt: 500_000 }),
    ]);
  });

  it("boshqa o'quvchining to'lovi hisobga aralashmaydi", () => {
    const result = calculateDebtors(
      '2026-10',
      [student(1), student(2)],
      [pay(2, 500_000, '2026-10-10')],
    );
    expect(result.map((r) => r.studentId)).toEqual([1]);
  });

  it("natija qarz bo'yicha kamayish tartibida, teng bo'lsa ism bo'yicha", () => {
    const students = [
      student(1, { name: 'Vali', monthlyFee: 300_000 }),
      student(2, { name: 'Ali', monthlyFee: 300_000 }),
      student(3, { name: 'Sardor', monthlyFee: 800_000 }),
    ];
    expect(
      calculateDebtors('2026-10', students, []).map((r) => r.name),
    ).toEqual(['Sardor', 'Ali', 'Vali']);
  });
});
