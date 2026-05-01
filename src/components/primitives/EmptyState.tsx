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
        padding: spacing.base,
        gap: spacing.base,
      }}
    >
      {Icon ? <Icon size={32} color={colors.steel} /> : null}
      <Text variant="h3" color="platinum" align="center">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="steel" align="center">
          {message}
        </Text>
      ) : null}
      {cta ? <Button label={cta.label} onPress={cta.onPress} /> : null}
    </View>
  );
}
