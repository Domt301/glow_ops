import { Pressable, View, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, type SpacingToken } from '@/theme';

export type CardTone = 'default' | 'recessed' | 'raised' | 'accent';

export type CardProps = {
  children: React.ReactNode;
  padding?: SpacingToken;
  onPress?: () => void;
  shadow?: boolean;
  tone?: CardTone;
  bordered?: boolean;
  style?: ViewStyle;
};

const TONE: Record<CardTone, { bg: string; border: string }> = {
  default: { bg: colors.gunmetal, border: colors.hairline },
  recessed: { bg: colors.slate, border: colors.hairline },
  raised: { bg: colors.graphite, border: colors.hairlineStrong },
  accent: { bg: colors.accentMuted, border: colors.accentSubtle },
};

export function Card({
  children,
  padding = 'base',
  onPress,
  shadow = false,
  tone = 'default',
  bordered = true,
  style,
}: CardProps) {
  const t = TONE[tone];
  const baseStyle: ViewStyle = {
    backgroundColor: t.bg,
    borderRadius: radius.lg,
    padding: spacing[padding],
    borderWidth: bordered ? 1 : 0,
    borderColor: t.border,
    ...(shadow ? shadows.card : {}),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [baseStyle, pressed && { opacity: 0.85 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[baseStyle, style]}>{children}</View>;
}
