import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Lock } from 'lucide-react-native';
import { colors, spacing } from '@/theme';
import { Stack } from '@/components/primitives/Stack';
import { Button } from '@/components/primitives/Button';

export type BlurredPaywallOverlayProps = {
  children: React.ReactNode;
  cta: string;
  onUnlock: () => void;
};

export function BlurredPaywallOverlay({ children, cta, onUnlock }: BlurredPaywallOverlayProps) {
  return (
    <View style={{ position: 'relative' }}>
      <View pointerEvents="none">{children}</View>
      <BlurView
        intensity={30}
        tint="dark"
        style={{ ...StyleSheetAbsoluteFill, alignItems: 'center', justifyContent: 'center' }}
      >
        <Stack gap="base" align="center" style={{ padding: spacing.lg }}>
          <Lock size={28} color={colors.platinum} />
          <Button label={cta} onPress={onUnlock} iconLeft={Lock} />
        </Stack>
      </BlurView>
    </View>
  );
}

const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
