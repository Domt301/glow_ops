import { reportId } from '@/types/report.types';
import { userId } from '@/types/user.types';
import type { Report } from '@/types';

const u = userId('usr_mock_001');

export const MOCK_INITIAL_REPORT: Report = {
  reportId: reportId('rpt_mock_001'),
  userId: u,
  scanId: 'scn_mock_001',
  type: 'INITIAL',
  createdAt: '2026-04-24T08:35:00Z',
  summary:
    'Your photo quality is the biggest unlock. Better lighting and angle selection will improve first impression faster than any product.',
  categoryScores: {
    photos: 48,
    hair: 55,
    style: 52,
    skin: 60,
    fitness: 64,
  },
  shareCardUrl: null,
  beforePhotoUrl: null,
  afterPhotoUrl: null,
};

export const MOCK_WEEKLY_REPORT: Report = {
  reportId: reportId('rpt_mock_002'),
  userId: u,
  scanId: null,
  type: 'WEEKLY',
  createdAt: '2026-05-01T09:00:00Z',
  summary:
    'Solid week. Your grooming consistency held and photo quality is trending up. Small wins compound.',
  categoryScores: {
    photos: 58,
    hair: 62,
    style: 60,
    skin: 65,
    fitness: 68,
  },
  shareCardUrl: null,
  beforePhotoUrl: null,
  afterPhotoUrl: null,
};
