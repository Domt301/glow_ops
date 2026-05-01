import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '@/theme';

export function usePressScale(pressedScale = 0.97) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(pressedScale, springs.snappy);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, springs.snappy);
  };

  return { animatedStyle, onPressIn, onPressOut };
}
