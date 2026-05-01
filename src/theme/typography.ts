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
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const textStyles = {
  display: {
    fontFamily: fontFamilies.soraBold,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * 1.1,
  },
  h1: {
    fontFamily: fontFamilies.soraBold,
    fontSize: fontSizes.xxl,
    lineHeight: fontSizes.xxl * 1.2,
  },
  h2: {
    fontFamily: fontFamilies.sora,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * 1.25,
  },
  h3: {
    fontFamily: fontFamilies.sora,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * 1.3,
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
  caption: {
    fontFamily: fontFamilies.inter,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.4,
  },
  label: {
    fontFamily: fontFamilies.interMedium,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.3,
  },
  button: {
    fontFamily: fontFamilies.interSemibold,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * 1.2,
  },
  stat: {
    fontFamily: fontFamilies.monoBold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * 1.1,
  },
  statLarge: {
    fontFamily: fontFamilies.monoBold,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * 1.05,
  },
} as const;

export type TextStyleVariant = keyof typeof textStyles;
