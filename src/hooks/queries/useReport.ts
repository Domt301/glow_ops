import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services';
import type { Report, ReportId } from '@/types';

export function useReport(id: ReportId) {
  return useQuery<Report, Error>({
    queryKey: ['report', id],
    queryFn: async () => {
      const result = await reportService.getReport(id);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    enabled: Boolean(id),
  });
}
