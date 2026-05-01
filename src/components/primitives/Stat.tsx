import { View, type ViewStyle } from 'react-native';
import { spacing, type ColorToken, type TextStyleVariant } from '@/theme';
import { Text } from './Text';

export type StatSize = 'sm' | 'md' | 'lg' | 'hero';

export type StatProps = {
  value: string | number;
  label?: string;
  unit?: string;
  size?: StatSize;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
  style?: ViewStyle;
};

const VARIANT_BY_SIZE: Record<StatSize, TextStyleVariant> = {
  sm: 'stat',
  md: 'stat',
  lg: 'statLarge',
  hero: 'mega',
};

const ALIGN_TO_FLEX: Record<NonNullable<StatProps['align']>, ViewStyle['alignItems']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export function Stat({
  value,
  label,
  unit,
  size = 'md',
  color = 'platinum',
  align = 'left',
  style,
}: StatProps) {
  const variant = VARIANT_BY_SIZE[size];
  return (
    <View style={[{ alignItems: ALIGN_TO_FLEX[align], gap: spacing.xs }, style]}>
      {label ? (
        <Text variant="eyebrow" color="steel" align={align}>
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs }}>
        <Text variant={variant} color={color} align={align}>
          {String(value)}
        </Text>
        {unit ? (
          <Text variant="caption" color="steel">
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
