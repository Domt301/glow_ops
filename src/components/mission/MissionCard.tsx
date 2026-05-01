import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { Mission } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Badge } from '@/components/primitives/Badge';

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

export function MissionCard({ mission, onComplete, onPress }: MissionCardProps) {
  const haptics = useHaptics();
  const isComplete = mission.status === 'COMPLETED';

  const checkboxBg = isComplete ? colors.signalGreen : colors.transparent;
  const checkboxBorder = isComplete ? colors.signalGreen : colors.border;

  return (
    <Card
      onPress={onPress}
      style={{
        borderColor: isComplete ? colors.signalGreen : colors.transparent,
        borderWidth: 1,
      }}
    >
      <Row gap="md" align="center" justify="between">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Badge label={CATEGORY_LABELS[mission.category] ?? mission.category} variant="info" />
          <Text variant="bodyMedium" color="platinum">
            {mission.title}
          </Text>
          <Text variant="caption" color="steel">
            ~{mission.estimatedMinutes} min
          </Text>
        </Stack>
        <Pressable
          onPress={() => {
            if (isComplete) return;
            haptics.medium();
            onComplete();
          }}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.pill,
            backgroundColor: checkboxBg,
            borderWidth: 1.5,
            borderColor: checkboxBorder,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: spacing.sm,
          }}
        >
          {isComplete ? <Check size={18} color={colors.obsidian} /> : <View />}
        </Pressable>
      </Row>
    </Card>
  );
}
