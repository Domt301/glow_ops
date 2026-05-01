import { useMutation, useQueryClient } from '@tanstack/react-query';
import { protocolService } from '@/services';
import type { StartProtocolRequest, StartProtocolResponse } from '@/types';

export function useStartProtocol() {
  const qc = useQueryClient();
  return useMutation<StartProtocolResponse, Error, StartProtocolRequest>({
    mutationFn: async (req) => {
      const result = await protocolService.startProtocol(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['protocol', 'active'] });
    },
  });
}
