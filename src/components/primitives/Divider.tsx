import { View } from 'react-native';
import { colors } from '@/theme';

export type DividerProps = {
  vertical?: boolean;
};

export function Divider({ vertical = false }: DividerProps) {
  return (
    <View
      style={{
        backgroundColor: colors.border,
        width: vertical ? 1 : '100%',
        height: vertical ? '100%' : 1,
      }}
    />
  );
}
