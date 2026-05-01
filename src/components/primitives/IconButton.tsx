import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { colors, type ColorToken } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressScale } from '@/hooks/usePressScale';

export type IconButtonProps = {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
  color?: ColorToken;
  accessibilityLabel?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IconButton({
  icon: Icon,
  onPress,
  size = 24,
  color = 'platinum',
  accessibilityLabel,
}: IconButtonProps) {
  const haptics = useHaptics();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.92);

  return (
    <AnimatedPressable
      onPress={() => {
        haptics.light();
        onPress();
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          minWidth: 44,
          minHeight: 44,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <Icon size={size} color={colors[color]} strokeWidth={2} />
    </AnimatedPressable>
  );
}
