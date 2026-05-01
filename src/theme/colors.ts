export const colors = {
  obsidian: '#0B0F14',
  gunmetal: '#121821',
  slate: '#1E2935',

  platinum: '#E6E8EB',
  steel: '#9AA4B2',
  steelDim: '#6B7280',

  electricBlue: '#3B82F6',
  signalGreen: '#30F28A',
  amber: '#F59E0B',
  crimson: '#EF4444',

  border: '#2A3441',
  overlay: 'rgba(11, 15, 20, 0.85)',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
