import { Pressable, View, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, type SpacingToken } from '@/theme';

export type CardProps = {
  children: React.ReactNode;
  padding?: SpacingToken;
  onPress?: () => void;
  shadow?: boolean;
  style?: ViewStyle;
};

export function Card({ children, padding = 'base', onPress, shadow = false, style }: CardProps) {
  const baseStyle: ViewStyle = {
    backgroundColor: colors.gunmetal,
    borderRadius: radius.lg,
    padding: spacing[padding],
    ...(shadow ? (shadows.card as ViewStyle) : {}),
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [baseStyle, pressed && { opacity: 0.85 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[baseStyle, style]}>{children}</View>;
}
