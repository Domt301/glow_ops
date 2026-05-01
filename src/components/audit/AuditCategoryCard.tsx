import type { AuditCategoryResult } from '@/types';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { FixabilityBadge } from './FixabilityBadge';

export type AuditCategoryCardProps = {
  result: AuditCategoryResult;
  onPress?: () => void;
  hero?: boolean;
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

export function AuditCategoryCard({ result, onPress, hero = false }: AuditCategoryCardProps) {
  const rank = String(result.rank).padStart(2, '0');
  const title = CATEGORY_TITLES[result.category] ?? result.category;

  if (hero) {
    return (
      <Card onPress={onPress} tone="accent" padding="xl">
        <Stack gap="lg">
          <Row gap="base" align="start" justify="between">
            <Stack gap="xs">
              <Eyebrow color="accent">Priority 01</Eyebrow>
              <Text variant="display" color="platinum">
                {title}
              </Text>
            </Stack>
            <Text variant="mega" color="accent">
              {rank}
            </Text>
          </Row>
          <Stack gap="sm">
            <Row gap="sm" wrap>
              <FixabilityBadge level={result.fixability} />
              <Text variant="label" color="steel">
                {result.estimatedTimeLabel}
              </Text>
            </Row>
            <Text variant="bodyLarge" color="platinum">
              {result.guidance}
            </Text>
            <Text variant="caption" color="steel">
              {result.currentStateLabel}
            </Text>
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <Card onPress={onPress}>
      <Stack gap="md">
        <Row gap="base" align="center" justify="between">
          <Row gap="md" align="center">
            <Text variant="stat" color="steel">
              {rank}
            </Text>
            <Text variant="h3" color="platinum">
              {title}
            </Text>
          </Row>
          <FixabilityBadge level={result.fixability} />
        </Row>
        <Text variant="body" color="steel">
          {result.guidance}
        </Text>
        <Eyebrow color="steelDim">{result.estimatedTimeLabel}</Eyebrow>
      </Stack>
    </Card>
  );
}
