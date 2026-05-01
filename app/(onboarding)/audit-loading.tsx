import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Loader } from 'lucide-react-native';
import { scanId } from '@/types/scan.types';
import { useAudit } from '@/hooks/queries/useAudit';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { analyticsService } from '@/services';
import { colors } from '@/theme';

const STEPS = [
  'Checking photo quality',
  'Mapping improvement areas',
  'Ranking highest-ROI changes',
  'Building your protocol',
];

const STEP_INTERVAL_MS = 750;

export default function AuditLoadingScreen() {
  const { scanId: scanIdParam } = useLocalSearchParams<{ scanId: string }>();
  const router = useRouter();
  const sid = scanIdParam ? scanId(String(scanIdParam)) : undefined;
  const audit = useAudit(sid);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    analyticsService.track('audit_started', { scanId: scanIdParam });
  }, [scanIdParam]);

  useEffect(() => {
    if (stepIndex >= STEPS.length) return;
    const t = setTimeout(() => setStepIndex((i) => i + 1), STEP_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [stepIndex]);

  useEffect(() => {
    if (stepIndex >= STEPS.length && audit.data) {
      analyticsService.track('audit_completed');
      router.replace({
        pathname: '/audit-result',
        params: { scanId: String(scanIdParam) },
      });
    }
  }, [stepIndex, audit.data, router, scanIdParam]);

  return (
    <Screen>
      <Stack gap="xl" justify="center" flex={1}>
        <Text variant="h1" color="platinum">
          Analyzing your first impression.
        </Text>
        <Stack gap="md">
          {STEPS.map((label, idx) => {
            const isDone = idx < stepIndex;
            const isActive = idx === stepIndex;
            return (
              <Row key={label} gap="md" align="center">
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: isDone ? colors.signalGreen : colors.slate,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isDone ? (
                    <Check size={14} color={colors.obsidian} />
                  ) : isActive ? (
                    <Loader size={14} color={colors.electricBlue} />
                  ) : (
                    <View />
                  )}
                </View>
                <Text variant="body" color={isDone ? 'platinum' : 'steel'}>
                  {label}
                </Text>
              </Row>
            );
          })}
        </Stack>
      </Stack>
    </Screen>
  );
}
