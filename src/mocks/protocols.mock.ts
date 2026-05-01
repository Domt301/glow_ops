import { protocolId } from '@/types/protocol.types';
import { userId } from '@/types/user.types';
import type { Protocol } from '@/types';

export const MOCK_PROTOCOL: Protocol = {
  protocolId: protocolId('prt_mock_001'),
  userId: userId('usr_mock_001'),
  type: '30_DAY',
  status: 'ACTIVE',
  startedAt: '2026-04-18T09:00:00Z',
  endsAt: '2026-05-18T09:00:00Z',
  focusAreas: ['photos', 'hair', 'style', 'skin', 'fitness'],
  currentDay: 7,
  totalDays: 30,
  phases: [
    {
      phaseNumber: 1,
      title: 'Reset',
      startDay: 1,
      endDay: 10,
      focusAreas: ['photos', 'grooming', 'sleep'],
      description:
        'Lock in the basics. Daily skincare, consistent sleep window, and a clean baseline set of photos to measure against.',
    },
    {
      phaseNumber: 2,
      title: 'Sharpen',
      startDay: 11,
      endDay: 20,
      focusAreas: ['hair', 'style', 'posture'],
      description:
        'Refine presentation. Tighten the haircut, dial in two reliable outfits, and start posture resets twice a day.',
    },
    {
      phaseNumber: 3,
      title: 'Compound',
      startDay: 21,
      endDay: 30,
      focusAreas: ['fitness', 'skin', 'photos'],
      description:
        'Stack the gains. Increase training consistency, hold the skincare cadence, and rebuild your photo set with the new baseline.',
    },
  ],
};
