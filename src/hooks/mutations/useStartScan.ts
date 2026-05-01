import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scanService } from '@/services';
import type { CreateScanRequest, CreateScanResponse } from '@/types';

export function useStartScan() {
  const qc = useQueryClient();
  return useMutation<CreateScanResponse, Error, CreateScanRequest>({
    mutationFn: async (req) => {
      const result = await scanService.createScan(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scan', 'latest'] });
    },
  });
}
