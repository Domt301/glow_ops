import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionService } from '@/services';
import type { Mission, MissionId } from '@/types';

export function useSkipMission() {
  const qc = useQueryClient();
  return useMutation<Mission, Error, MissionId>({
    mutationFn: async (id) => {
      const result = await missionService.skipMission(id);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions', 'today'] });
    },
  });
}
