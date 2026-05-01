import type { ImprovementCategory, ProtocolType } from '@/types';

export const PROTOCOL_LENGTHS = ['14_DAY', '30_DAY', '90_DAY'] as const satisfies readonly ProtocolType[];

export const MISSION_CATEGORIES = [
  'hair',
  'skin',
  'beard',
  'fitness',
  'style',
  'photos',
  'sleep',
  'grooming',
  'posture',
] as const satisfies readonly ImprovementCategory[];
