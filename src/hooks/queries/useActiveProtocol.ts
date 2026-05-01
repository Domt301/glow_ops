import { useQuery } from '@tanstack/react-query';
import { protocolService } from '@/services';
import type { Protocol } from '@/types';

export function useActiveProtocol() {
  return useQuery<Protocol | null, Error>({
    queryKey: ['protocol', 'active'],
    queryFn: async () => {
      const result = await protocolService.getActiveProtocol();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
