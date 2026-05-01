import type { ImprovementCategory } from './audit.types';

export type Streak = {
  currentDays: number;
  longestDays: number;
  lastCompletedDate: string | null;
};

export type CategoryScore = {
  category: ImprovementCategory;
  score: number;
  trend: 'up' | 'down' | 'flat';
  changeFromLastWeek: number;
};

export type WeeklyProgress = {
  weekStartDate: string;
  missionsCompleted: number;
  missionsTotal: number;
  photosUploaded: number;
  scoreTrends: CategoryScore[];
};

export type ProgressOverview = {
  streak: Streak;
  weeklyProgress: WeeklyProgress[];
  totalMissionsCompleted: number;
  protocolsCompleted: number;
};
