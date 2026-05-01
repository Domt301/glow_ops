import { colors } from './colors';
import { textStyles } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { motion } from './motion';

export { colors, type ColorToken } from './colors';
export {
  fontFamilies,
  fontSizes,
  lineHeights,
  textStyles,
  type TextStyleVariant,
} from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, type RadiusToken } from './radius';
export { shadows } from './shadows';
export { motion, springs, durations } from './motion';

export const theme = {
  colors,
  textStyles,
  spacing,
  radius,
  shadows,
  motion,
} as const;

export type Theme = typeof theme;
