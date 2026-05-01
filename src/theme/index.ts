import { colors } from './colors';
import { textStyles } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

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

export const theme = {
  colors,
  textStyles,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
