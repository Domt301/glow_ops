import { useQuery } from '@tanstack/react-query';
import { missionService } from '@/services';
import type { Mission, MissionId } from '@/types';

export function useMission(id: MissionId) {
  return useQuery<Mission, Error>({
    queryKey: ['mission', id],
    queryFn: async () => {
      const result = await missionService.getMission(id);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    enabled: Boolean(id),
  });
}
