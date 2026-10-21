import { describe, expect, it } from 'vitest';
import { todayIso } from '@/lib/date';
import { paymentFormSchema } from '../payment-schema';

const valid = { studentId: 1, amount: '300 000', paidAt: '2026-10-01' };
const errorsOf = (input: object) =>
  paymentFormSchema
    .safeParse({ ...valid, ...input })
    .error?.issues.map((i) => i.message) ?? [];

describe('paymentFormSchema', () => {
  it("to'g'ri ma'lumotni qabul qiladi", () => {
    expect(errorsOf({})).toEqual([]);
    expect(errorsOf({ paidAt: todayIso() })).toEqual([]);
  });

  it.each([
    ["o'quvchi tanlanmagan", { studentId: undefined }, "O'quvchini tanlang"],
    ["summa bo'sh", { amount: '' }, 'Summani kiriting'],
    ['summa nol', { amount: '0' }, "Summa musbat bo'lishi kerak"],
    ['summa kasr', { amount: '12.5' }, "Summa butun son bo'lishi kerak"],
    [
      'summa juda katta',
      { amount: '100 000 001' },
      "Summa juda katta (100 mln so'mgacha)",
    ],
    ["sana noto'g'ri", { paidAt: '2026-02-30' }, "Sanani to'g'ri kiriting"],
    [
      'sana kelajakda',
      { paidAt: '2999-01-01' },
      "To'lov sanasi kelajakda bo'lishi mumkin emas",
    ],
  ])('%s', (_case, input, message) => {
    expect(errorsOf(input)).toContain(message);
  });
});
