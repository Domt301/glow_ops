import { useQuery } from '@tanstack/react-query';
import { missionService } from '@/services';
import type { Mission } from '@/types';

export function useTodayMissions() {
  return useQuery<Mission[], Error>({
    queryKey: ['missions', 'today'],
    queryFn: async () => {
      const result = await missionService.getTodayMissions();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
