import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { CreatePaymentInput, Payment } from '@/types/api';

/** To'lov qo'shilgach qarzdorlar ro'yxati va o'quvchi tarixi yangilanadi. */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentInput) =>
      apiRequest<Payment>('/payments', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (payment) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.allDebtors }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.studentPayments(payment.studentId),
        }),
      ]),
  });
}
