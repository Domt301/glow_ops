import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionService } from '@/services';
import type { CompleteMissionRequest, CompleteMissionResponse } from '@/types';

export function useCompleteMission() {
  const qc = useQueryClient();
  return useMutation<CompleteMissionResponse, Error, CompleteMissionRequest>({
    mutationFn: async (req) => {
      const result = await missionService.completeMission(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions', 'today'] });
      qc.invalidateQueries({ queryKey: ['progress', 'overview'] });
    },
  });
}
