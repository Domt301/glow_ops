import { Platform, type ViewStyle } from 'react-native';

const ios = (style: ViewStyle): ViewStyle =>
  Platform.select<ViewStyle>({ ios: style, android: {}, default: {} }) ?? {};

const android = (elevation: number): ViewStyle =>
  Platform.select<ViewStyle>({ ios: {}, android: { elevation }, default: {} }) ?? {};

export const shadows = {
  none: {} as ViewStyle,
  card: {
    ...ios({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    }),
    ...android(1),
  } as ViewStyle,
  elevated: {
    ...ios({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 28,
    }),
    ...android(12),
  } as ViewStyle,
} as const;
