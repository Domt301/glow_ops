import { scanId } from '@/types/scan.types';
import { photoId } from '@/types/photo.types';
import { userId } from '@/types/user.types';
import type { Scan } from '@/types';

const u = userId('usr_mock_001');

export const MOCK_SCAN_READY: Scan = {
  scanId: scanId('scn_mock_001'),
  userId: u,
  status: 'READY',
  photoIds: [photoId('pho_mock_001'), photoId('pho_mock_002'), photoId('pho_mock_003')],
  createdAt: '2026-04-24T08:30:00Z',
  completedAt: '2026-04-24T08:35:00Z',
  reportId: 'rpt_mock_001',
  failureReason: null,
};

export const MOCK_SCAN_PROCESSING: Scan = {
  scanId: scanId('scn_mock_002'),
  userId: u,
  status: 'PROCESSING',
  photoIds: [photoId('pho_mock_004'), photoId('pho_mock_005'), photoId('pho_mock_006')],
  createdAt: '2026-04-24T09:00:00Z',
  completedAt: null,
  reportId: null,
  failureReason: null,
};

export const MOCK_SCAN_FAILED: Scan = {
  scanId: scanId('scn_mock_003'),
  userId: u,
  status: 'FAILED',
  photoIds: [photoId('pho_mock_007')],
  createdAt: '2026-04-23T11:00:00Z',
  completedAt: '2026-04-23T11:01:00Z',
  reportId: null,
  failureReason: 'Image quality too low. Retake in better lighting.',
};
