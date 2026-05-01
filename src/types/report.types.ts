import type { IsoDate } from './api.types';
import type { UserId } from './user.types';
import type { ImprovementCategory } from './audit.types';

export type ReportId = string & { __brand: 'ReportId' };
export const reportId = (s: string): ReportId => s as ReportId;

export type ReportType = 'INITIAL' | 'WEEKLY' | 'MONTHLY' | 'FINAL';

export type Report = {
  reportId: ReportId;
  userId: UserId;
  scanId: string | null;
  type: ReportType;
  createdAt: IsoDate;
  summary: string;
  categoryScores: Partial<Record<ImprovementCategory, number>>;
  shareCardUrl: string | null;
  beforePhotoUrl: string | null;
  afterPhotoUrl: string | null;
};
