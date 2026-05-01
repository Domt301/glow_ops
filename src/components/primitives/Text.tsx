import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { colors, textStyles, type ColorToken, type TextStyleVariant } from '@/theme';

export type TextProps = {
  variant: TextStyleVariant;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  children?: React.ReactNode;
  style?: RNTextProps['style'];
};

export function Text({
  variant,
  color = 'platinum',
  align,
  numberOfLines,
  children,
  style,
}: TextProps) {
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[textStyles[variant], { color: colors[color], textAlign: align }, style]}
    >
      {children}
    </RNText>
  );
}
