import { z } from 'zod';
import { todayIso } from '@/lib/date';
import { MAX_AMOUNT, parseAmount } from '@/lib/money';

/**
 * To'lov formasi qoidalari backend bilan bir xil:
 * musbat butun summa (100 mln gacha), mavjud va kelajakda bo'lmagan sana.
 * O'quvchi qo'shilgan sanadan oldingi to'lovni backend rad etadi, xabari formada ko'rinadi.
 */
export const paymentFormSchema = z.object({
  studentId: z
    .number({ error: "O'quvchini tanlang" })
    .int()
    .positive("O'quvchini tanlang"),
  amount: z
    .string()
    .trim()
    .min(1, 'Summani kiriting')
    .refine(
      (v) => !Number.isNaN(parseAmount(v)),
      "Summa butun son bo'lishi kerak",
    )
    .refine((v) => parseAmount(v) > 0, "Summa musbat bo'lishi kerak")
    .refine(
      (v) => parseAmount(v) <= MAX_AMOUNT,
      "Summa juda katta (100 mln so'mgacha)",
    ),
  paidAt: z.iso
    .date("Sanani to'g'ri kiriting")
    .refine(
      (v) => v <= todayIso(),
      "To'lov sanasi kelajakda bo'lishi mumkin emas",
    ),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
