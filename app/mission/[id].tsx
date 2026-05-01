import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { missionId as makeMissionId } from '@/types/mission.types';
import { useMission } from '@/hooks/queries/useMission';
import { useCompleteMission } from '@/hooks/mutations/useCompleteMission';
import { useSkipMission } from '@/hooks/mutations/useSkipMission';
import { useUiStore } from '@/stores/ui.store';
import { useHaptics } from '@/hooks/useHaptics';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Badge } from '@/components/primitives/Badge';
import { Button } from '@/components/primitives/Button';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { analyticsService } from '@/services';

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair',
  skin: 'Skin',
  beard: 'Beard',
  fitness: 'Fitness',
  style: 'Style',
  photos: 'Photos',
  sleep: 'Sleep',
  grooming: 'Grooming',
  posture: 'Posture',
};

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const haptics = useHaptics();
  const mid = id ? makeMissionId(String(id)) : undefined;
  const missionQ = useMission(mid as ReturnType<typeof makeMissionId>);
  const complete = useCompleteMission();
  const skip = useSkipMission();

  useEffect(() => {
    analyticsService.track('mission_viewed', { missionId: id });
  }, [id]);

  if (missionQ.isLoading || !mid) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }
  if (missionQ.error || !missionQ.data) {
    return (
      <Screen>
        <ErrorState
          error={missionQ.error ?? new Error('Mission not found')}
          onRetry={() => missionQ.refetch()}
        />
      </Screen>
    );
  }

  const mission = missionQ.data;

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Stack gap="sm">
          <Badge label={CATEGORY_LABELS[mission.category] ?? mission.category} variant="info" />
          <Text variant="h1" color="platinum">
            {mission.title}
          </Text>
          <Text variant="caption" color="steel">
            ~{mission.estimatedMinutes} min
          </Text>
        </Stack>
        <Text variant="body" color="platinum">
          {mission.description}
        </Text>

        <Stack gap="md">
          <Button
            label="Mark complete"
            loading={complete.isPending}
            onPress={() =>
              complete.mutate(
                { missionId: mission.missionId },
                {
                  onSuccess: () => {
                    void haptics.success();
                    analyticsService.track('mission_completed', { missionId: mission.missionId });
                    showToast({ message: '+1% better. Keep stacking.', tone: 'success' });
                    router.back();
                  },
                  onError: (e) => showToast({ message: e.message, tone: 'error' }),
                },
              )
            }
            fullWidth
          />
          <Button
            label="Skip for today"
            variant="ghost"
            loading={skip.isPending}
            onPress={() =>
              skip.mutate(mission.missionId, {
                onSuccess: () => {
                  analyticsService.track('mission_skipped', { missionId: mission.missionId });
                  router.back();
                },
                onError: (e) => showToast({ message: e.message, tone: 'error' }),
              })
            }
            fullWidth
          />
        </Stack>
      </Stack>
    </Screen>
  );
}
