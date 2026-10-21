import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Debtor } from '@/types/api';

export function useDebtors(month: string) {
  return useQuery({
    queryKey: queryKeys.debtors(month),
    queryFn: () =>
      apiRequest<Debtor[]>(`/debtors?month=${encodeURIComponent(month)}`),
    placeholderData: keepPreviousData, // oy almashganda ro'yxat "sakramaydi"
  });
}
