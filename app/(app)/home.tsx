import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/components/primitives/Card';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Skeleton } from '@/components/primitives/Skeleton';
import { StreakBar } from '@/components/mission/StreakBar';
import { MissionChecklist } from '@/components/mission/MissionChecklist';
import { ProgressRing } from '@/components/progress/ProgressRing';
import { ScoreTrend } from '@/components/progress/ScoreTrend';
import { useUser } from '@/hooks/queries/useUser';
import { useProgress } from '@/hooks/queries/useProgress';
import { useTodayMissions } from '@/hooks/queries/useTodayMissions';
import { useActiveProtocol } from '@/hooks/queries/useActiveProtocol';
import { useCompleteMission } from '@/hooks/mutations/useCompleteMission';
import { useUiStore } from '@/stores/ui.store';

function greeting(name: string | null | undefined): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${part}, ${name ?? 'there'}.`;
}

export default function HomeScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const userQ = useUser();
  const progressQ = useProgress();
  const missionsQ = useTodayMissions();
  const protocolQ = useActiveProtocol();
  const complete = useCompleteMission();

  return (
    <Screen scrollable>
      <Stack gap="xl">
        <Text variant="h2" color="platinum">
          {greeting(userQ.data?.displayName)}
        </Text>

        {progressQ.isLoading ? (
          <Skeleton width="100%" height={88} radius="lg" />
        ) : progressQ.data ? (
          <StreakBar streak={progressQ.data.streak} />
        ) : null}

        <Stack gap="md">
          <Text variant="h3" color="platinum">
            Today&apos;s missions
          </Text>
          {missionsQ.isLoading ? (
            <Stack gap="sm">
              <Skeleton width="100%" height={88} radius="lg" />
              <Skeleton width="100%" height={88} radius="lg" />
              <Skeleton width="100%" height={88} radius="lg" />
            </Stack>
          ) : missionsQ.error ? (
            <ErrorState error={missionsQ.error} onRetry={() => missionsQ.refetch()} />
          ) : missionsQ.data && missionsQ.data.length > 0 ? (
            <MissionChecklist
              missions={missionsQ.data}
              onComplete={(id) =>
                complete.mutate(
                  { missionId: id },
                  {
                    onSuccess: () =>
                      showToast({ message: '+1% better. Keep stacking.', tone: 'success' }),
                    onError: (e) => showToast({ message: e.message, tone: 'error' }),
                  },
                )
              }
            />
          ) : (
            <EmptyState title="No missions today." message="Take a rest. Come back tomorrow." />
          )}
        </Stack>

        <Stack gap="md">
          <Text variant="h3" color="platinum">
            Active protocol
          </Text>
          {protocolQ.isLoading ? (
            <Skeleton width="100%" height={120} radius="lg" />
          ) : protocolQ.data ? (
            <Card>
              <Row gap="lg" align="center">
                <ProgressRing
                  value={(protocolQ.data.currentDay / protocolQ.data.totalDays) * 100}
                  size={80}
                />
                <Stack gap="xs">
                  <Text variant="h3" color="platinum">
                    {protocolQ.data.type.replace('_', '-')} Glow-Up
                  </Text>
                  <Text variant="caption" color="steel">
                    Day {protocolQ.data.currentDay} of {protocolQ.data.totalDays}
                  </Text>
                </Stack>
              </Row>
            </Card>
          ) : (
            <EmptyState
              title="No active protocol"
              cta={{ label: 'Start your protocol', onPress: () => router.push('/audit-result') }}
            />
          )}
        </Stack>

        <Stack gap="md">
          <Text variant="h3" color="platinum">
            Weekly insight
          </Text>
          {progressQ.isLoading ? (
            <Skeleton width="100%" height={64} radius="lg" />
          ) : progressQ.data && progressQ.data.weeklyProgress[0]?.scoreTrends[0] ? (
            <ScoreTrend score={progressQ.data.weeklyProgress[0].scoreTrends[0]} />
          ) : null}
        </Stack>

        {userQ.isLoading ? <LoadingState /> : null}
      </Stack>
    </Screen>
  );
}
