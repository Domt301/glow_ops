import { Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import type { CategoryScore } from '@/types';
import { colors } from '@/theme';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';

export type ScoreTrendProps = {
  score: CategoryScore;
};

const LABELS: Record<string, string> = {
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

export function ScoreTrend({ score }: ScoreTrendProps) {
  const Icon = score.trend === 'up' ? TrendingUp : score.trend === 'down' ? TrendingDown : Minus;
  const tint =
    score.trend === 'up'
      ? colors.signalGreen
      : score.trend === 'down'
        ? colors.crimson
        : colors.steel;

  const sign = score.changeFromLastWeek > 0 ? '+' : '';
  const deltaColor =
    score.trend === 'up' ? 'signalGreen' : score.trend === 'down' ? 'crimson' : 'steel';

  return (
    <Card padding="base">
      <Row gap="md" justify="between" align="center">
        <Stack gap="xs">
          <Eyebrow>{LABELS[score.category] ?? score.category}</Eyebrow>
          <Text variant="stat" color="platinum">
            {score.score}
          </Text>
        </Stack>
        <Row gap="sm" align="center">
          <Icon size={16} color={tint} strokeWidth={2.25} />
          <Text variant="bodyMedium" color={deltaColor}>
            {sign}
            {score.changeFromLastWeek}
          </Text>
        </Row>
      </Row>
    </Card>
  );
}
