import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors, radius } from '@/theme';

export type BeforeAfterSliderProps = {
  beforeUri: string;
  afterUri: string;
  height?: number;
};

export function BeforeAfterSlider({ beforeUri, afterUri, height = 320 }: BeforeAfterSliderProps) {
  const [width, setWidth] = useState(0);
  const offsetX = useSharedValue(width / 2);

  const setOffset = (x: number) => {
    offsetX.value = x;
  };

  const pan = Gesture.Pan()
    .onChange((e) => {
      const next = Math.max(0, Math.min(width, e.absoluteX));
      runOnJS(setOffset)(next);
    });

  const overlayStyle = useAnimatedStyle(() => ({ width: offsetX.value }));
  const handleStyle = useAnimatedStyle(() => ({ left: offsetX.value - 1 }));

  return (
    <View
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        setWidth(w);
        if (offsetX.value === 0) offsetX.value = w / 2;
      }}
      style={{ width: '100%', height, borderRadius: radius.lg, overflow: 'hidden' }}
    >
      <Image source={{ uri: afterUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      <Animated.View style={[{ position: 'absolute', top: 0, height: '100%', overflow: 'hidden' }, overlayStyle]}>
        <Image
          source={{ uri: beforeUri }}
          style={{ width, height: '100%' }}
          contentFit="cover"
        />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              width: 2,
              height: '100%',
              backgroundColor: colors.platinum,
            },
            handleStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
}
