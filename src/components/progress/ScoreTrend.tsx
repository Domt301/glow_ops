import { Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import type { CategoryScore } from '@/types';
import { colors } from '@/theme';
import { Card } from '@/components/primitives/Card';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';

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
    <Card padding="md">
      <Row gap="md" justify="between" align="center">
        <Text variant="bodyMedium" color="platinum">
          {LABELS[score.category] ?? score.category}
        </Text>
        <Row gap="md" align="center">
          <Text variant="stat" color="platinum">
            {score.score}
          </Text>
          <Icon size={18} color={tint} />
          <Text variant="caption" color={deltaColor}>
            {sign}
            {score.changeFromLastWeek}
          </Text>
        </Row>
      </Row>
    </Card>
  );
}
