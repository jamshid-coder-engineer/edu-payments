/** TanStack Query kalitlari bir joyda: yangilash (invalidate) shu orqali. */
export const queryKeys = {
  debtors: (month: string) => ['debtors', month] as const,
  allDebtors: ['debtors'] as const,
  students: ['students'] as const,
  studentPayments: (studentId: number) =>
    ['students', studentId, 'payments'] as const,
};
