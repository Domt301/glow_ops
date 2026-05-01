import type { TextStyle } from 'react-native';

export const fontFamilies = {
  sora: 'Sora_600SemiBold',
  soraBold: 'Sora_700Bold',
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemibold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  display: 44,
  mega: 56,
} as const;

export const lineHeights = {
  tight: 1.0,
  snug: 1.1,
  normal: 1.4,
  relaxed: 1.6,
} as const;

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

export const textStyles = {
  mega: {
    fontFamily: fontFamilies.monoBold,
    fontSize: fontSizes.mega,
    lineHeight: fontSizes.mega * 1.0,
    letterSpacing: -1.4,
    fontVariant: tabular,
  },
  display: {
    fontFamily: fontFamilies.soraBold,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * 1.02,
    letterSpacing: -1,
  },
  h1: {
    fontFamily: fontFamilies.soraBold,
    fontSize: fontSizes.xxl,
    lineHeight: fontSizes.xxl * 1.1,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: fontFamilies.sora,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * 1.2,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamilies.sora,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * 1.25,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fontFamilies.inter,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * 1.5,
  },
  bodyMedium: {
    fontFamily: fontFamilies.interMedium,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * 1.5,
  },
  bodyLarge: {
    fontFamily: fontFamilies.inter,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.5,
  },
  caption: {
    fontFamily: fontFamilies.inter,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.4,
  },
  label: {
    fontFamily: fontFamilies.interSemibold,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.3,
    letterSpacing: 0.2,
  },
  eyebrow: {
    fontFamily: fontFamilies.interSemibold,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * 1.3,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fontFamilies.interSemibold,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * 1.2,
    letterSpacing: 0.2,
  },
  stat: {
    fontFamily: fontFamilies.monoBold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * 1.1,
    fontVariant: tabular,
  },
  statLarge: {
    fontFamily: fontFamilies.monoBold,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * 1.0,
    letterSpacing: -1,
    fontVariant: tabular,
  },
} as const satisfies Record<string, TextStyle>;

export type TextStyleVariant = keyof typeof textStyles;
