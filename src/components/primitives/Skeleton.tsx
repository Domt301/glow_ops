import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, type SpacingToken } from '@/theme';

export type SkeletonProps = {
  width: number | `${number}%` | '100%';
  height: number;
  radius?: SpacingToken;
};

const RADII: Record<SpacingToken, number> = {
  none: 0,
  xs: radius.sm,
  sm: radius.sm,
  md: radius.md,
  base: radius.md,
  lg: radius.lg,
  xl: radius.lg,
  xxl: radius.xl,
  xxxl: radius.xl,
  huge: radius.xl,
};

export function Skeleton({ width, height, radius: radiusToken = 'sm' }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.85, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.slate,
          borderRadius: RADII[radiusToken],
        },
        animatedStyle,
      ]}
    />
  );
}

