import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ProtocolTimeline } from '@/components/protocol/ProtocolTimeline';
import { useActiveProtocol } from '@/hooks/queries/useActiveProtocol';

const TYPE_LABELS: Record<string, string> = {
  '14_DAY': '14-Day Reset',
  '30_DAY': '30-Day Glow-Up',
  '90_DAY': '90-Day Transformation',
};

export default function ProtocolScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useActiveProtocol();

  if (isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState error={error} onRetry={() => refetch()} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen>
        <EmptyState
          title="No active protocol"
          cta={{ label: 'Start your protocol', onPress: () => router.push('/audit-result') }}
        />
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Text variant="h2" color="platinum">
          {TYPE_LABELS[data.type] ?? data.type} · Day {data.currentDay} of {data.totalDays}
        </Text>
        <ProtocolTimeline protocol={data} />
      </Stack>
    </Screen>
  );
}
