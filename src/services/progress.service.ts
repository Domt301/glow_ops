import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import type { ApiResult, CategoryScore, ProgressOverview, Streak, WeeklyProgress } from '@/types';

const MOCK_STREAK: Streak = {
  currentDays: 7,
  longestDays: 12,
  lastCompletedDate: '2026-04-26',
};

const SCORE_TRENDS: CategoryScore[] = [
  { category: 'photos', score: 58, trend: 'up', changeFromLastWeek: 6 },
  { category: 'hair', score: 62, trend: 'up', changeFromLastWeek: 4 },
  { category: 'style', score: 60, trend: 'flat', changeFromLastWeek: 0 },
  { category: 'skin', score: 65, trend: 'up', changeFromLastWeek: 3 },
  { category: 'fitness', score: 64, trend: 'down', changeFromLastWeek: -2 },
];

const WEEKLY: WeeklyProgress[] = [
  {
    weekStartDate: '2026-04-20',
    missionsCompleted: 18,
    missionsTotal: 21,
    photosUploaded: 4,
    scoreTrends: SCORE_TRENDS,
  },
  {
    weekStartDate: '2026-04-13',
    missionsCompleted: 15,
    missionsTotal: 21,
    photosUploaded: 3,
    scoreTrends: SCORE_TRENDS.map((s) => ({ ...s, score: s.score - 4 })),
  },
  {
    weekStartDate: '2026-04-06',
    missionsCompleted: 12,
    missionsTotal: 21,
    photosUploaded: 2,
    scoreTrends: SCORE_TRENDS.map((s) => ({ ...s, score: s.score - 7 })),
  },
  {
    weekStartDate: '2026-03-30',
    missionsCompleted: 9,
    missionsTotal: 21,
    photosUploaded: 1,
    scoreTrends: SCORE_TRENDS.map((s) => ({ ...s, score: s.score - 10 })),
  },
];

const MOCK_OVERVIEW: ProgressOverview = {
  streak: MOCK_STREAK,
  weeklyProgress: WEEKLY,
  totalMissionsCompleted: 54,
  protocolsCompleted: 0,
};

async function _getOverviewMock(): Promise<ApiResult<ProgressOverview>> {
  await mockDelay();
  return { ok: true, data: MOCK_OVERVIEW };
}
async function _getOverviewReal(): Promise<ApiResult<ProgressOverview>> {
  return httpClient.get<ProgressOverview>('/progress/overview');
}
export async function getProgressOverview(): Promise<ApiResult<ProgressOverview>> {
  return env.USE_MOCKS ? _getOverviewMock() : _getOverviewReal();
}

async function _getStreakMock(): Promise<ApiResult<Streak>> {
  await mockDelay();
  return { ok: true, data: MOCK_STREAK };
}
async function _getStreakReal(): Promise<ApiResult<Streak>> {
  return httpClient.get<Streak>('/progress/streak');
}
export async function getStreak(): Promise<ApiResult<Streak>> {
  return env.USE_MOCKS ? _getStreakMock() : _getStreakReal();
}
