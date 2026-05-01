import { View } from 'react-native';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import { Text } from './Text';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const STYLES: Record<BadgeVariant, { bg: string; fg: ColorToken }> = {
  success: { bg: 'rgba(48, 242, 138, 0.15)', fg: 'signalGreen' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', fg: 'amber' },
  error: { bg: 'rgba(239, 68, 68, 0.15)', fg: 'crimson' },
  info: { bg: 'rgba(59, 130, 246, 0.15)', fg: 'electricBlue' },
  neutral: { bg: colors.slate, fg: 'steel' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const s = STYLES[variant];
  return (
    <View
      style={{
        backgroundColor: s.bg,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="label" color={s.fg}>
        {label}
      </Text>
    </View>
  );
}
