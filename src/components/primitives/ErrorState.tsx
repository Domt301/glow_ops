import { View } from 'react-native';
import { AlertOctagon } from 'lucide-react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';
import { Button } from './Button';

export type ErrorStateProps = {
  error: Error;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
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
      <AlertOctagon size={40} color={colors.crimson} strokeWidth={1.75} />
      <View style={{ gap: spacing.xs, alignItems: 'center', maxWidth: 320 }}>
        <Text variant="eyebrow" color="crimson">
          Something broke
        </Text>
        <Text variant="body" color="steel" align="center">
          {error.message || 'An unexpected error occurred.'}
        </Text>
      </View>
      {onRetry ? <Button label="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}
