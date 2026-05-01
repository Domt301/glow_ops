import type { FixabilityLevel } from '@/types';
import { Badge, type BadgeVariant } from '@/components/primitives/Badge';

export type FixabilityBadgeProps = {
  level: FixabilityLevel;
};

const LABELS: Record<FixabilityLevel, string> = {
  low: 'Low Fixability',
  medium: 'Medium Fixability',
  high: 'Highly Fixable',
  very_high: 'Very High Fixability',
};

const VARIANTS: Record<FixabilityLevel, BadgeVariant> = {
  low: 'neutral',
  medium: 'info',
  high: 'success',
  very_high: 'success',
};

export function FixabilityBadge({ level }: FixabilityBadgeProps) {
  return <Badge label={LABELS[level]} variant={VARIANTS[level]} />;
}
