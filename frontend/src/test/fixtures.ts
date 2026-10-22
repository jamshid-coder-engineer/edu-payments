import type { Debtor, Student } from '@/types/api';

export const students: Student[] = [
  {
    id: 1,
    name: 'Ali Valiyev',
    phone: '+998901234567',
    group: 'Frontend-1',
    monthlyFee: 600_000,
    joinedAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Malika Karimova',
    phone: '+998907654321',
    group: 'Backend-2',
    monthlyFee: 800_000,
    joinedAt: '2026-03-01',
  },
];

export const debtors: Debtor[] = [
  {
    studentId: 1,
    name: 'Ali Valiyev',
    phone: '+998901234567',
    group: 'Frontend-1',
    monthlyFee: 600_000,
    paid: 150_000,
    debt: 450_000,
  },
  {
    studentId: 2,
    name: 'Malika Karimova',
    phone: '+998907654321',
    group: 'Backend-2',
    monthlyFee: 800_000,
    paid: 0,
    debt: 800_000,
  },
];
