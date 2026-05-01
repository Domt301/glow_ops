import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/services';
import type { ProgressOverview } from '@/types';

export function useProgress() {
  return useQuery<ProgressOverview, Error>({
    queryKey: ['progress', 'overview'],
    queryFn: async () => {
      const result = await progressService.getProgressOverview();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
