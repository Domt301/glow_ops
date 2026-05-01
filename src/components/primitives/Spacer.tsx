import { View } from 'react-native';
import { spacing, type SpacingToken } from '@/theme';

export type SpacerProps = {
  size: SpacingToken;
};

export function Spacer({ size }: SpacerProps) {
  return <View style={{ width: spacing[size], height: spacing[size] }} />;
}
