import { ActivityIndicator, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

export type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.base }}>
      <ActivityIndicator color={colors.electricBlue} size="large" />
      {message ? (
        <Text variant="body" color="steel">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
