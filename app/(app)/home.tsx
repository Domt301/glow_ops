import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Stat } from '@/components/primitives/Stat';
import { Card } from '@/components/primitives/Card';
import { Divider } from '@/components/primitives/Divider';
import { ErrorState } from '@/components/primitives/ErrorState';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Skeleton } from '@/components/primitives/Skeleton';
import { StreakBar } from '@/components/mission/StreakBar';
import { MissionChecklist } from '@/components/mission/MissionChecklist';
import { ProgressRing } from '@/components/progress/ProgressRing';
import { ScoreTrend } from '@/components/progress/ScoreTrend';
import { useProgress } from '@/hooks/queries/useProgress';
import { useTodayMissions } from '@/hooks/queries/useTodayMissions';
import { useActiveProtocol } from '@/hooks/queries/useActiveProtocol';
import { useCompleteMission } from '@/hooks/mutations/useCompleteMission';
import { useUiStore } from '@/stores/ui.store';

function formatDateStamp(now = new Date()): string {
  const weekday = now.toLocaleDateString(undefined, { weekday: 'short' });
  const month = now.toLocaleDateString(undefined, { month: 'short' });
  const day = now.getDate();
  return `Today · ${weekday}, ${month} ${day}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const progressQ = useProgress();
  const missionsQ = useTodayMissions();
  const protocolQ = useActiveProtocol();
  const complete = useCompleteMission();

  const dateStamp = useMemo(() => formatDateStamp(), []);

  const openMissions = missionsQ.data?.filter((m) => m.status !== 'COMPLETED').length ?? 0;
  const totalMissions = missionsQ.data?.length ?? 0;

  return (
    <Screen scrollable contentContainerStyle={{ paddingBottom: 120 }}>
      <Stack gap="xl">
        <Stack gap="lg">
          <Eyebrow>{dateStamp}</Eyebrow>
          {progressQ.isLoading ? (
            <Skeleton width="100%" height={120} radius="lg" />
          ) : progressQ.data ? (
            <StreakBar streak={progressQ.data.streak} />
          ) : null}
        </Stack>

        <Divider />

        <Stack gap="md">
          <Row justify="between" align="end">
            <Eyebrow>Today&apos;s missions</Eyebrow>
            {totalMissions > 0 ? (
              <Eyebrow color={openMissions === 0 ? 'accent' : 'steel'}>
                {openMissions === 0 ? 'All clear' : `${openMissions} open`}
              </Eyebrow>
            ) : null}
          </Row>
          {missionsQ.isLoading ? (
            <Stack gap="sm">
              <Skeleton width="100%" height={96} radius="lg" />
              <Skeleton width="100%" height={96} radius="lg" />
              <Skeleton width="100%" height={96} radius="lg" />
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
          <Eyebrow>Active protocol</Eyebrow>
          {protocolQ.isLoading ? (
            <Skeleton width="100%" height={120} radius="lg" />
          ) : protocolQ.data ? (
            <Card tone="raised" padding="lg">
              <Row gap="lg" align="center">
                <ProgressRing
                  value={(protocolQ.data.currentDay / protocolQ.data.totalDays) * 100}
                  size={84}
                  thickness={5}
                />
                <Stack gap="sm" flex={1}>
                  <Text variant="h3" color="platinum">
                    {protocolQ.data.type.replace('_', '-')} Glow-Up
                  </Text>
                  <Stat
                    value={`${protocolQ.data.currentDay} / ${protocolQ.data.totalDays}`}
                    label="Day"
                    size="md"
                    color="accent"
                  />
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
          <Eyebrow>Trending this week</Eyebrow>
          {progressQ.isLoading ? (
            <Skeleton width="100%" height={72} radius="lg" />
          ) : progressQ.data && progressQ.data.weeklyProgress[0]?.scoreTrends[0] ? (
            <ScoreTrend score={progressQ.data.weeklyProgress[0].scoreTrends[0]} />
          ) : null}
        </Stack>
      </Stack>
    </Screen>
  );
}
