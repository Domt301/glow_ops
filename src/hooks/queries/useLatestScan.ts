import { useQuery } from '@tanstack/react-query';
import { scanService } from '@/services';
import type { Scan } from '@/types';

export function useLatestScan() {
  return useQuery<Scan | null, Error>({
    queryKey: ['scan', 'latest'],
    queryFn: async () => {
      const result = await scanService.getLatestScan();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
