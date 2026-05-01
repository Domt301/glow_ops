import { useEffect } from 'react';
import { Share, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { reportId as makeReportId } from '@/types/report.types';
import { useReport } from '@/hooks/queries/useReport';
import { reportService, analyticsService } from '@/services';
import { useUiStore } from '@/stores/ui.store';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Badge } from '@/components/primitives/Badge';
import { Button } from '@/components/primitives/Button';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { Card } from '@/components/primitives/Card';
import { colors, radius } from '@/theme';
import { formatDate } from '@/utils/date';

const TYPE_LABELS: Record<string, string> = {
  INITIAL: 'Initial Audit',
  WEEKLY: 'Weekly Report',
  MONTHLY: 'Monthly Report',
  FINAL: 'Final Report',
};

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

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const showToast = useUiStore((s) => s.showToast);
  const rid = id ? makeReportId(String(id)) : undefined;
  const reportQ = useReport(rid as ReturnType<typeof makeReportId>);

  useEffect(() => {
    analyticsService.track('report_viewed', { reportId: id });
  }, [id]);

  if (reportQ.isLoading || !rid) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }
  if (reportQ.error || !reportQ.data) {
    return (
      <Screen>
        <ErrorState
          error={reportQ.error ?? new Error('Report not found')}
          onRetry={() => reportQ.refetch()}
        />
      </Screen>
    );
  }

  const report = reportQ.data;
  const entries = Object.entries(report.categoryScores) as [string, number][];

  const handleShare = async () => {
    const result = await reportService.generateShareCard(rid);
    if (!result.ok) {
      showToast({ message: result.error.message, tone: 'error' });
      return;
    }
    await Share.share({ url: result.data.url, message: 'My GlowOps progress.' });
    analyticsService.track('report_shared', { reportId: id });
  };

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Stack gap="sm">
          <Row gap="sm" align="center">
            <Badge label={TYPE_LABELS[report.type] ?? report.type} variant="info" />
            <Text variant="caption" color="steel">
              {formatDate(report.createdAt)}
            </Text>
          </Row>
          <Text variant="body" color="platinum">
            {report.summary}
          </Text>
        </Stack>

        <Stack gap="sm">
          <Text variant="h3" color="platinum">
            Category scores
          </Text>
          {entries.map(([category, score]) => (
            <Card key={category} padding="md">
              <Stack gap="sm">
                <Row gap="md" justify="between" align="center">
                  <Text variant="bodyMedium" color="platinum">
                    {CATEGORY_LABELS[category] ?? category}
                  </Text>
                  <Text variant="stat" color="platinum">
                    {score}
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
                      width: `${Math.max(0, Math.min(100, score))}%`,
                      height: '100%',
                      backgroundColor: colors.signalGreen,
                    }}
                  />
                </View>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Button label="Share" onPress={handleShare} fullWidth />
      </Stack>
    </Screen>
  );
}
