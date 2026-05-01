import type { AuditCategoryResult } from '@/types';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { FixabilityBadge } from './FixabilityBadge';

export type AuditCategoryCardProps = {
  result: AuditCategoryResult;
  onPress?: () => void;
};

const CATEGORY_TITLES: Record<string, string> = {
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

export function AuditCategoryCard({ result, onPress }: AuditCategoryCardProps) {
  return (
    <Card onPress={onPress} shadow>
      <Stack gap="sm">
        <Row gap="md" align="center">
          <Text variant="stat" color="electricBlue">
            {String(result.rank).padStart(2, '0')}
          </Text>
          <Text variant="h3" color="platinum">
            {CATEGORY_TITLES[result.category] ?? result.category}
          </Text>
        </Row>
        <Text variant="caption" color="steel">
          {result.currentStateLabel}
        </Text>
        <Row gap="sm" wrap>
          <FixabilityBadge level={result.fixability} />
          <Text variant="label" color="steel">
            {result.estimatedTimeLabel}
          </Text>
        </Row>
        <Text variant="body" color="platinum">
          {result.guidance}
        </Text>
      </Stack>
    </Card>
  );
}
