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

export type StackProps = {
  children: React.ReactNode;
  gap?: SpacingToken;
  align?: Align;
  justify?: Justify;
  flex?: number;
  style?: ViewStyle;
};

export function Stack({ children, gap = 'none', align, justify, flex, style }: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          gap: spacing[gap],
          alignItems: align ? ALIGN[align] : undefined,
          justifyContent: justify ? JUSTIFY[justify] : undefined,
          flex,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
