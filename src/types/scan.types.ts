import type { IsoDate } from './api.types';
import type { UserId } from './user.types';
import type { PhotoId } from './photo.types';

export type ScanId = string & { __brand: 'ScanId' };
export const scanId = (s: string): ScanId => s as ScanId;

export type ScanStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export type Scan = {
  scanId: ScanId;
  userId: UserId;
  status: ScanStatus;
  photoIds: PhotoId[];
  createdAt: IsoDate;
  completedAt: IsoDate | null;
  reportId: string | null;
  failureReason: string | null;
};

export type CreateScanRequest = {
  photoIds: PhotoId[];
};

export type CreateScanResponse = {
  scan: Scan;
};
