import { View, type ViewStyle } from 'react-native';
import { spacing, type SpacingToken } from '@/theme';

type Align = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between';

const ALIGN: Record<Align, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const JUSTIFY: Record<Justify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

export type RowProps = {
  children: React.ReactNode;
  gap?: SpacingToken;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  style?: ViewStyle;
};

export function Row({ children, gap = 'none', align = 'center', justify, wrap, style }: RowProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: spacing[gap],
          alignItems: ALIGN[align],
          justifyContent: justify ? JUSTIFY[justify] : undefined,
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
