export const colors = {
  obsidian: '#0A0B0E',
  gunmetal: '#14161B',
  slate: '#1C1F25',
  graphite: '#262932',

  platinum: '#F2F2EF',
  steel: '#A8ACB3',
  steelDim: '#6E727A',

  accent: '#D8FE3C',
  accentInk: '#0A0B0E',
  accentMuted: 'rgba(216, 254, 60, 0.14)',
  accentSubtle: 'rgba(216, 254, 60, 0.30)',

  signalGreen: '#4ADE80',
  amber: '#FBBF24',
  crimson: '#F43F5E',
  electricBlue: '#3B82F6',

  border: '#23262D',
  hairline: 'rgba(255, 255, 255, 0.06)',
  hairlineStrong: 'rgba(255, 255, 255, 0.10)',
  overlay: 'rgba(10, 11, 14, 0.85)',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
