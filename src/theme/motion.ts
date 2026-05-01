export const springs = {
  bouncy: { damping: 14, stiffness: 220, mass: 1 },
  snappy: { damping: 22, stiffness: 380, mass: 0.8 },
  gentle: { damping: 26, stiffness: 160, mass: 1 },
} as const;

export const durations = {
  fast: 160,
  base: 220,
  slow: 320,
} as const;

export const motion = { springs, durations } as const;
