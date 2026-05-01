import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressScale } from '@/hooks/usePressScale';
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
  md: { paddingV: spacing.md, paddingH: spacing.lg, minHeight: 48 },
  lg: { paddingV: spacing.base, paddingH: spacing.xl, minHeight: 56 },
};

type Variant = {
  bg: string;
  border: string;
  text: ColorToken;
  iconColor: string;
};

function variantStyle(variant: ButtonVariant): Variant {
  switch (variant) {
    case 'primary':
      return {
        bg: colors.accent,
        border: colors.accent,
        text: 'accentInk',
        iconColor: colors.accentInk,
      };
    case 'secondary':
      return {
        bg: colors.gunmetal,
        border: colors.hairlineStrong,
        text: 'platinum',
        iconColor: colors.platinum,
      };
    case 'ghost':
      return {
        bg: colors.transparent,
        border: colors.transparent,
        text: 'platinum',
        iconColor: colors.platinum,
      };
    case 'destructive':
      return {
        bg: colors.crimson,
        border: colors.crimson,
        text: 'platinum',
        iconColor: colors.platinum,
      };
  }
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.97);

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor: v.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: s.paddingV,
    paddingHorizontal: s.paddingH,
    minHeight: s.minHeight,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: isDisabled ? 0.4 : 1,
    justifyContent: 'center',
  };

  return (
    <AnimatedPressable
      onPress={() => {
        haptics.light();
        onPress();
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      style={[containerStyle, animatedStyle]}
    >
      {loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={v.iconColor} />
        </View>
      ) : (
        <Row gap="sm" justify="center" align="center">
          {IconLeft ? <IconLeft size={18} color={v.iconColor} strokeWidth={2.25} /> : null}
          <Text variant="button" color={v.text}>
            {label}
          </Text>
          {IconRight ? <IconRight size={18} color={v.iconColor} strokeWidth={2.25} /> : null}
        </Row>
      )}
    </AnimatedPressable>
  );
}
