import { View } from 'react-native';
import { Flame } from 'lucide-react-native';
import type { Streak } from '@/types';
import { colors, spacing } from '@/theme';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';

export type StreakBarProps = {
  streak: Streak;
};

export function StreakBar({ streak }: StreakBarProps) {
  const active = streak.currentDays > 0;
  const numberColor = active ? 'accent' : 'platinum';

  return (
    <Stack gap="md">
      <Row gap="sm" align="center">
        <Flame
          size={14}
          color={active ? colors.accent : colors.steelDim}
          strokeWidth={2.25}
        />
        <Eyebrow color={active ? 'accent' : 'steel'}>Streak</Eyebrow>
      </Row>
      <Row gap="sm" align="end">
        <Text variant="mega" color={numberColor}>
          {streak.currentDays}
        </Text>
        <View style={{ paddingBottom: spacing.sm }}>
          <Text variant="bodyLarge" color="steel">
            {streak.currentDays === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </Row>
      <Eyebrow color="steelDim">
        Longest · {streak.longestDays} {streak.longestDays === 1 ? 'day' : 'days'}
      </Eyebrow>
    </Stack>
  );
}
