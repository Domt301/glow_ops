import { useRouter } from 'expo-router';
import type { Mission, MissionId } from '@/types';
import { Stack } from '@/components/primitives/Stack';
import { MissionCard } from './MissionCard';

export type MissionChecklistProps = {
  missions: Mission[];
  onComplete: (id: MissionId) => void;
};

export function MissionChecklist({ missions, onComplete }: MissionChecklistProps) {
  const router = useRouter();
  const sorted = [...missions].sort((a, b) => {
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
    return 0;
  });

  return (
    <Stack gap="sm">
      {sorted.map((m) => (
        <MissionCard
          key={m.missionId}
          mission={m}
          onComplete={() => onComplete(m.missionId)}
          onPress={() => router.push(`/mission/${m.missionId}`)}
        />
      ))}
    </Stack>
  );
}
