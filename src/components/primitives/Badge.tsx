import { View } from 'react-native';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import { Text } from './Text';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'accent';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const STYLES: Record<BadgeVariant, { bg: string; fg: ColorToken; border: string }> = {
  success: { bg: 'rgba(74, 222, 128, 0.14)', fg: 'signalGreen', border: 'transparent' },
  warning: { bg: 'rgba(251, 191, 36, 0.14)', fg: 'amber', border: 'transparent' },
  error: { bg: 'rgba(244, 63, 94, 0.14)', fg: 'crimson', border: 'transparent' },
  info: { bg: 'rgba(59, 130, 246, 0.14)', fg: 'electricBlue', border: 'transparent' },
  accent: { bg: colors.accentMuted, fg: 'accent', border: colors.accentSubtle },
  neutral: { bg: colors.gunmetal, fg: 'steel', border: colors.hairlineStrong },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const s = STYLES[variant];
  return (
    <View
      style={{
        backgroundColor: s.bg,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: s.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 1,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="eyebrow" color={s.fg}>
        {label}
      </Text>
    </View>
  );
}
