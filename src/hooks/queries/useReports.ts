import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services';
import type { Report } from '@/types';

export function useReports() {
  return useQuery<Report[], Error>({
    queryKey: ['reports'],
    queryFn: async () => {
      const result = await reportService.listReports();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
