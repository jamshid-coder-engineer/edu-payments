import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Payment } from '@/types/api';

/** O'quvchining to'lovlari, yangisi birinchi (backend shunday saralaydi). */
export function useStudentPayments(studentId: number) {
  return useQuery({
    queryKey: queryKeys.studentPayments(studentId),
    queryFn: () => apiRequest<Payment[]>(`/students/${studentId}/payments`),
  });
}
