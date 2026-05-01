import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import type { WeeklyProgress } from '@/types';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/components/primitives/Card';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { ScoreTrend } from '@/components/progress/ScoreTrend';
import { useProgress } from '@/hooks/queries/useProgress';
import { useReports } from '@/hooks/queries/useReports';
import { formatDate } from '@/utils/date';
import { colors, radius, spacing } from '@/theme';
import { analyticsService } from '@/services';

function WeekCard({ week }: { week: WeeklyProgress }) {
  const pct = week.missionsTotal === 0 ? 0 : (week.missionsCompleted / week.missionsTotal) * 100;
  return (
    <Card padding="md">
      <Stack gap="sm">
        <Row gap="sm" justify="between" align="center">
          <Text variant="label" color="steel">
            Week of {formatDate(week.weekStartDate)}
          </Text>
          <Text variant="label" color="platinum">
            {week.missionsCompleted}/{week.missionsTotal}
          </Text>
        </Row>
        <View
          style={{
            height: 6,
            backgroundColor: colors.slate,
            borderRadius: radius.pill,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${pct}%`,
              height: '100%',
              backgroundColor: colors.electricBlue,
            }}
          />
        </View>
      </Stack>
    </Card>
  );
}

export default function ProgressScreen() {
  const router = useRouter();
  const progressQ = useProgress();
  const reportsQ = useReports();

  useEffect(() => {
    analyticsService.track('progress_viewed');
  }, []);

  if (progressQ.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (progressQ.error || !progressQ.data) {
    return (
      <Screen>
        <ErrorState
          error={progressQ.error ?? new Error('Progress unavailable')}
          onRetry={() => progressQ.refetch()}
        />
      </Screen>
    );
  }

  const data = progressQ.data;
  const weeks = data.weeklyProgress.slice(0, 4);
  const trends = data.weeklyProgress[0]?.scoreTrends ?? [];

  return (
    <Screen scrollable>
      <Stack gap="xl">
        <Stack gap="xs" align="start">
          <Text variant="statLarge" color="signalGreen">
            {data.streak.currentDays}
          </Text>
          <Text variant="bodyMedium" color="steel">
            day streak
          </Text>
        </Stack>

        <Stack gap="md">
          <Text variant="h3" color="platinum">
            Weekly progress
          </Text>
          <Stack gap="sm">
            {weeks.map((w) => (
              <WeekCard key={w.weekStartDate} week={w} />
            ))}
          </Stack>
        </Stack>

        <Stack gap="md">
          <Text variant="h3" color="platinum">
            Score trends
          </Text>
          <Stack gap="sm">
            {trends.map((t) => (
              <ScoreTrend key={t.category} score={t} />
            ))}
          </Stack>
        </Stack>

        <Stack gap="md">
          <Text variant="h3" color="platinum">
            Reports
          </Text>
          {reportsQ.isLoading ? (
            <LoadingState />
          ) : reportsQ.data ? (
            <Stack gap="sm">
              {reportsQ.data.map((r) => (
                <Card
                  key={r.reportId}
                  padding="md"
                  onPress={() => router.push(`/report/${r.reportId}`)}
                >
                  <Row gap="md" justify="between" align="center">
                    <Stack gap="xs">
                      <Text variant="bodyMedium" color="platinum">
                        {r.type === 'INITIAL' ? 'Initial Audit' : 'Weekly Report'}
                      </Text>
                      <Text variant="caption" color="steel">
                        {formatDate(r.createdAt)}
                      </Text>
                    </Stack>
                    <View style={{ paddingLeft: spacing.sm }}>
                      <Text variant="caption" color="electricBlue">
                        Open →
                      </Text>
                    </View>
                  </Row>
                </Card>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Screen>
  );
}
