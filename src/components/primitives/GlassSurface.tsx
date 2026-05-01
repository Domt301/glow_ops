import { BlurView } from 'expo-blur';
import { Platform, View, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

export type GlassSurfaceProps = {
  children: React.ReactNode;
  intensity?: number;
  topHairline?: boolean;
  style?: ViewStyle;
};

export function GlassSurface({
  children,
  intensity = 60,
  topHairline = true,
  style,
}: GlassSurfaceProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          {
            backgroundColor: 'rgba(20, 22, 27, 0.72)',
            borderTopWidth: topHairline ? 1 : 0,
            borderTopColor: colors.hairlineStrong,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[
        {
          backgroundColor: 'rgba(20, 22, 27, 0.55)',
          borderTopWidth: topHairline ? 1 : 0,
          borderTopColor: colors.hairlineStrong,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}
