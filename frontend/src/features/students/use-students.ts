import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Student } from '@/types/api';

export function useStudents() {
  return useQuery({
    queryKey: queryKeys.students,
    queryFn: () => apiRequest<Student[]>('/students'),
    staleTime: 60_000,
  });
}
