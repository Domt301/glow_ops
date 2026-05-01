import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { Mission } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressScale } from '@/hooks/usePressScale';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';

export type MissionCardProps = {
  mission: Mission;
  onComplete: () => void;
  onPress: () => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair',
  skin: 'Skin',
  beard: 'Beard',
  fitness: 'Fitness',
  style: 'Style',
  photos: 'Photos',
  sleep: 'Sleep',
  grooming: 'Grooming',
  posture: 'Posture',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MissionCard({ mission, onComplete, onPress }: MissionCardProps) {
  const haptics = useHaptics();
  const isComplete = mission.status === 'COMPLETED';
  const scale = usePressScale(0.92);

  return (
    <Card onPress={onPress} tone={isComplete ? 'accent' : 'default'} padding="base">
      <Row gap="md" align="center" justify="between">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Eyebrow color={isComplete ? 'accent' : 'steel'}>
            {CATEGORY_LABELS[mission.category] ?? mission.category}
          </Eyebrow>
          <Text variant="bodyMedium" color="platinum">
            {mission.title}
          </Text>
          <Eyebrow color="steelDim">~{mission.estimatedMinutes} min</Eyebrow>
        </Stack>
        <AnimatedPressable
          onPress={() => {
            if (isComplete) return;
            haptics.medium();
            onComplete();
          }}
          onPressIn={scale.onPressIn}
          onPressOut={scale.onPressOut}
          hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          style={[
            {
              width: 36,
              height: 36,
              borderRadius: radius.pill,
              backgroundColor: isComplete ? colors.accent : 'transparent',
              borderWidth: 1.5,
              borderColor: isComplete ? colors.accent : colors.hairlineStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: spacing.sm,
            },
            scale.animatedStyle,
          ]}
        >
          {isComplete ? (
            <Check size={18} color={colors.accentInk} strokeWidth={3} />
          ) : null}
        </AnimatedPressable>
      </Row>
    </Card>
  );
}
