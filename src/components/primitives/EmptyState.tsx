import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';
import { Button } from './Button';

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  message?: string;
  cta?: { label: string; onPress: () => void };
};

export function EmptyState({ icon: Icon, title, message, cta }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.lg,
      }}
    >
      {Icon ? <Icon size={44} color={colors.steelDim} strokeWidth={1.5} /> : null}
      <View style={{ gap: spacing.sm, alignItems: 'center', maxWidth: 320 }}>
        <Text variant="h2" color="platinum" align="center">
          {title}
        </Text>
        {message ? (
          <Text variant="body" color="steel" align="center">
            {message}
          </Text>
        ) : null}
      </View>
      {cta ? <Button label={cta.label} onPress={cta.onPress} /> : null}
    </View>
  );
}
