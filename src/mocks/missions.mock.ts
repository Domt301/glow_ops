import { missionId } from '@/types/mission.types';
import { protocolId } from '@/types/protocol.types';
import { userId } from '@/types/user.types';
import { todayYmd } from '@/utils/date';
import type { Mission } from '@/types';

const today = todayYmd();
const u = userId('usr_mock_001');
const p = protocolId('prt_mock_001');

export const MOCK_TODAY_MISSIONS: Mission[] = [
  {
    missionId: missionId('msn_mock_001'),
    protocolId: p,
    userId: u,
    date: today,
    category: 'skin',
    title: 'Complete morning skincare routine',
    description:
      'Cleanser, moisturizer, SPF — in that order. Two minutes total. Small wins compound.',
    estimatedMinutes: 5,
    status: 'COMPLETED',
    completedAt: `${today}T07:45:00Z`,
  },
  {
    missionId: missionId('msn_mock_002'),
    protocolId: p,
    userId: u,
    date: today,
    category: 'photos',
    title: 'Take a progress selfie',
    description:
      'Same lighting, same angle as your baseline. This is how we measure first impression improvement.',
    estimatedMinutes: 3,
    status: 'PENDING',
    completedAt: null,
  },
  {
    missionId: missionId('msn_mock_003'),
    protocolId: p,
    userId: u,
    date: today,
    category: 'fitness',
    title: 'Walk 8,000 steps',
    description: 'Spread it across the day. Standing desk counts. Keep the streak alive.',
    estimatedMinutes: 60,
    status: 'PENDING',
    completedAt: null,
  },
  {
    missionId: missionId('msn_mock_004'),
    protocolId: p,
    userId: u,
    date: today,
    category: 'style',
    title: 'Wear one fitted outfit today',
    description:
      'Pick from your tighter color palette. A single well-fitting outfit beats five mediocre ones.',
    estimatedMinutes: 5,
    status: 'PENDING',
    completedAt: null,
  },
];
