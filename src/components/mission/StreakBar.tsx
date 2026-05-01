import type { Streak } from '@/types';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';

export type StreakBarProps = {
  streak: Streak;
};

export function StreakBar({ streak }: StreakBarProps) {
  return (
    <Card>
      <Row gap="base" align="center">
        <Text variant="statLarge" color="signalGreen">
          {streak.currentDays}
        </Text>
        <Stack gap="xs">
          <Text variant="bodyMedium" color="platinum">
            day streak
          </Text>
          <Text variant="caption" color="steel">
            Longest: {streak.longestDays} days
          </Text>
        </Stack>
      </Row>
    </Card>
  );
}
