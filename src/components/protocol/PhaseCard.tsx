import { View } from 'react-native';
import type { ProtocolPhase } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';

export type PhaseCardProps = {
  phase: ProtocolPhase;
  currentDay: number;
};

const FOCUS_LABELS: Record<string, string> = {
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

export function PhaseCard({ phase, currentDay }: PhaseCardProps) {
  const isCurrent = currentDay >= phase.startDay && currentDay <= phase.endDay;
  return (
    <View
      style={{
        borderColor: isCurrent ? colors.electricBlue : colors.transparent,
        borderWidth: 1,
        borderRadius: radius.lg,
      }}
    >
      <Card>
        <Stack gap="sm">
          <Row gap="sm" justify="between">
            <Row gap="sm" align="center">
              <View
                style={{
                  backgroundColor: isCurrent ? colors.electricBlue : colors.slate,
                  width: 28,
                  height: 28,
                  borderRadius: radius.pill,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text variant="label" color={isCurrent ? 'obsidian' : 'platinum'}>
                  {phase.phaseNumber}
                </Text>
              </View>
              <Text variant="h3" color="platinum">
                {phase.title}
              </Text>
            </Row>
            <Text variant="label" color="steel">
              Day {phase.startDay}–{phase.endDay}
            </Text>
          </Row>
          <Text variant="body" color="platinum">
            {phase.description}
          </Text>
          <Row gap="xs" wrap>
            {phase.focusAreas.map((f) => (
              <View
                key={f}
                style={{
                  backgroundColor: colors.slate,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: radius.pill,
                }}
              >
                <Text variant="label" color="steel">
                  {FOCUS_LABELS[f] ?? f}
                </Text>
              </View>
            ))}
          </Row>
        </Stack>
      </Card>
    </View>
  );
}
