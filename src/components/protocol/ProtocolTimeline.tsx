import { Fragment } from 'react';
import { View } from 'react-native';
import type { Protocol } from '@/types';
import { colors, spacing } from '@/theme';
import { Stack } from '@/components/primitives/Stack';
import { PhaseCard } from './PhaseCard';

export type ProtocolTimelineProps = {
  protocol: Protocol;
};

export function ProtocolTimeline({ protocol }: ProtocolTimelineProps) {
  return (
    <Stack gap="none">
      {protocol.phases.map((phase, idx) => (
        <Fragment key={phase.phaseNumber}>
          <PhaseCard phase={phase} currentDay={protocol.currentDay} />
          {idx < protocol.phases.length - 1 ? (
            <View
              style={{
                width: 1,
                height: spacing.lg,
                backgroundColor: colors.border,
                marginLeft: 30,
              }}
            />
          ) : null}
        </Fragment>
      ))}
    </Stack>
  );
}
