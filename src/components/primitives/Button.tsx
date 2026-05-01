import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { Text } from './Text';
import { Row } from './Row';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
};

const SIZES: Record<ButtonSize, { paddingV: number; paddingH: number; minHeight: number }> = {
  sm: { paddingV: spacing.sm, paddingH: spacing.md, minHeight: 36 },
  md: { paddingV: spacing.md, paddingH: spacing.lg, minHeight: 44 },
  lg: { paddingV: spacing.base, paddingH: spacing.xl, minHeight: 52 },
};

function variantStyle(variant: ButtonVariant): { bg: string; border: string; text: typeof colors[keyof typeof colors] } {
  switch (variant) {
    case 'primary':
      return { bg: colors.electricBlue, border: colors.electricBlue, text: colors.obsidian };
    case 'secondary':
      return { bg: colors.gunmetal, border: colors.border, text: colors.platinum };
    case 'ghost':
      return { bg: colors.transparent, border: colors.transparent, text: colors.platinum };
    case 'destructive':
      return { bg: colors.crimson, border: colors.crimson, text: colors.platinum };
  }
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  fullWidth,
}: ButtonProps) {
  const haptics = useHaptics();
  const v = variantStyle(variant);
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor: v.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: s.paddingV,
    paddingHorizontal: s.paddingH,
    minHeight: s.minHeight,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: isDisabled ? 0.5 : 1,
  };

  const textColor =
    variant === 'primary' ? 'obsidian' : variant === 'destructive' ? 'platinum' : 'platinum';

  return (
    <Pressable
      onPress={() => {
        haptics.light();
        onPress();
      }}
      disabled={isDisabled}
      style={({ pressed }) => [containerStyle, pressed && !isDisabled && { opacity: 0.8 }]}
    >
      {loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={v.text} />
        </View>
      ) : (
        <Row gap="sm" justify="center" align="center">
          {IconLeft ? <IconLeft size={18} color={v.text} /> : null}
          <Text variant="button" color={textColor}>
            {label}
          </Text>
          {IconRight ? <IconRight size={18} color={v.text} /> : null}
        </Row>
      )}
    </Pressable>
  );
}
