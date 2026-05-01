import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
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
        padding: spacing.base,
        gap: spacing.base,
      }}
    >
      <AlertCircle size={32} color={colors.crimson} />
      <Text variant="body" color="steel" align="center">
        {error.message || 'Something went wrong.'}
      </Text>
      {onRetry ? <Button label="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}
