import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { scanId } from '@/types/scan.types';
import { useAudit } from '@/hooks/queries/useAudit';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { analyticsService } from '@/services';
import { colors } from '@/theme';

const STEPS = [
  'Checking photo quality',
  'Mapping improvement areas',
  'Ranking highest-ROI changes',
  'Building your protocol',
];

const STEP_INTERVAL_MS = 750;

type StepState = 'done' | 'active' | 'pending';

function StepRow({ index, label, state }: { index: number; label: string; state: StepState }) {
  const number = String(index + 1).padStart(2, '0');
  const indicatorBg =
    state === 'done' ? colors.signalGreen : state === 'active' ? colors.accentMuted : 'transparent';
  const indicatorBorder =
    state === 'done'
      ? colors.signalGreen
      : state === 'active'
        ? colors.accent
        : colors.hairlineStrong;

  const labelColor = state === 'pending' ? 'steelDim' : 'platinum';
  const numberColor = state === 'pending' ? 'steelDim' : state === 'active' ? 'accent' : 'steel';

  return (
    <Row gap="base" align="center">
      <Text variant="stat" color={numberColor}>
        {number}
      </Text>
      <Text variant="body" color={labelColor} style={{ flex: 1 }}>
        {label}
      </Text>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: indicatorBg,
          borderWidth: 1,
          borderColor: indicatorBorder,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {state === 'done' ? (
          <Check size={14} color={colors.obsidian} strokeWidth={3} />
        ) : state === 'active' ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : null}
      </View>
    </Row>
  );
}

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
        <Stack gap="sm">
          <Eyebrow color="accent">Step 04 / 04</Eyebrow>
          <Text variant="display" color="platinum">
            Analyzing.
          </Text>
          <Text variant="bodyLarge" color="steel">
            Reading your first impression. A few seconds.
          </Text>
        </Stack>
        <Stack gap="lg">
          {STEPS.map((label, idx) => {
            const state: StepState =
              idx < stepIndex ? 'done' : idx === stepIndex ? 'active' : 'pending';
            return <StepRow key={label} index={idx} label={label} state={state} />;
          })}
        </Stack>
      </Stack>
    </Screen>
  );
}
