import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { PricingOption } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { Card } from '@/components/primitives/Card';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Badge } from '@/components/primitives/Badge';

export type TierCardProps = {
  option: PricingOption;
  onSelect: () => void;
  isSelected?: boolean;
};

const TIER_NAMES: Record<string, string> = {
  basic: 'Basic',
  pro: 'Pro',
  elite: 'Elite',
  lifetime: 'Lifetime',
  free: 'Free',
};

export function TierCard({ option, onSelect, isSelected }: TierCardProps) {
  return (
    <Stack gap="xs">
      {option.isRecommended ? <Badge label="RECOMMENDED" variant="info" /> : null}
      <View
        style={{
          borderColor: isSelected ? colors.electricBlue : colors.transparent,
          borderWidth: 2,
          borderRadius: radius.lg,
        }}
      >
        <Card onPress={onSelect}>
          <Stack gap="sm">
            <Row gap="md" justify="between" align="center">
              <Text variant="h3" color="platinum">
                {TIER_NAMES[option.tier] ?? option.tier}
              </Text>
              <Text variant="stat" color="electricBlue">
                {option.displayPrice}
              </Text>
            </Row>
            {option.trialDays ? (
              <Text variant="caption" color="signalGreen">
                {option.trialDays}-day free trial
              </Text>
            ) : null}
            <Stack gap="xs">
              {option.features.map((f) => (
                <Row key={f} gap="sm" align="center">
                  <Check size={14} color={colors.signalGreen} />
                  <View style={{ flex: 1, paddingRight: spacing.sm }}>
                    <Text variant="caption" color="platinum">
                      {f}
                    </Text>
                  </View>
                </Row>
              ))}
            </Stack>
          </Stack>
        </Card>
      </View>
    </Stack>
  );
}
