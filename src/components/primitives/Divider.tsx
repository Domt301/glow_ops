import { View } from 'react-native';
import { colors, spacing, type SpacingToken } from '@/theme';

export type DividerProps = {
  vertical?: boolean;
  strong?: boolean;
  inset?: SpacingToken;
};

export function Divider({ vertical = false, strong = false, inset = 'none' }: DividerProps) {
  const color = strong ? colors.hairlineStrong : colors.hairline;
  const insetPx = spacing[inset];
  if (vertical) {
    return <View style={{ backgroundColor: color, width: 1, alignSelf: 'stretch' }} />;
  }
  return (
    <View
      style={{
        backgroundColor: color,
        height: 1,
        alignSelf: 'stretch',
        marginHorizontal: insetPx,
      }}
    />
  );
}
