import { View, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

export type CornerFrameProps = {
  children: React.ReactNode;
  size?: number;
  thickness?: number;
  color?: string;
  inset?: number;
  style?: ViewStyle;
};

export function CornerFrame({
  children,
  size = 22,
  thickness = 2,
  color = colors.accent,
  inset = 0,
  style,
}: CornerFrameProps) {
  const horiz: ViewStyle = {
    position: 'absolute',
    width: size,
    height: thickness,
    backgroundColor: color,
  };
  const vert: ViewStyle = {
    position: 'absolute',
    width: thickness,
    height: size,
    backgroundColor: color,
  };

  return (
    <View style={[{ position: 'relative' }, style]}>
      {children}
      <View style={[horiz, { top: inset, left: inset }]} />
      <View style={[vert, { top: inset, left: inset }]} />
      <View style={[horiz, { top: inset, right: inset }]} />
      <View style={[vert, { top: inset, right: inset }]} />
      <View style={[horiz, { bottom: inset, left: inset }]} />
      <View style={[vert, { bottom: inset, left: inset }]} />
      <View style={[horiz, { bottom: inset, right: inset }]} />
      <View style={[vert, { bottom: inset, right: inset }]} />
    </View>
  );
}
