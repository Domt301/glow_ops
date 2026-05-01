import type { FixabilityLevel } from '@/types';
import { Badge, type BadgeVariant } from '@/components/primitives/Badge';

export type FixabilityBadgeProps = {
  level: FixabilityLevel;
};

const LABELS: Record<FixabilityLevel, string> = {
  low: 'Low fixability',
  medium: 'Medium fixability',
  high: 'Highly fixable',
  very_high: 'Very high fixability',
};

const VARIANTS: Record<FixabilityLevel, BadgeVariant> = {
  low: 'neutral',
  medium: 'info',
  high: 'success',
  very_high: 'accent',
};

export function FixabilityBadge({ level }: FixabilityBadgeProps) {
  return <Badge label={LABELS[level]} variant={VARIANTS[level]} />;
}
