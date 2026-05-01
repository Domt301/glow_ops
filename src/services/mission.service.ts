import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { MOCK_TODAY_MISSIONS } from '@/mocks/missions.mock';
import type {
  ApiResult,
  CompleteMissionRequest,
  CompleteMissionResponse,
  Mission,
  MissionId,
} from '@/types';

async function _getTodayMissionsMock(): Promise<ApiResult<Mission[]>> {
  await mockDelay();
  return { ok: true, data: MOCK_TODAY_MISSIONS };
}
async function _getTodayMissionsReal(): Promise<ApiResult<Mission[]>> {
  return httpClient.get<Mission[]>('/missions/today');
}
export async function getTodayMissions(): Promise<ApiResult<Mission[]>> {
  return env.USE_MOCKS ? _getTodayMissionsMock() : _getTodayMissionsReal();
}

async function _getMissionMock(id: MissionId): Promise<ApiResult<Mission>> {
  await mockDelay();
  const found = MOCK_TODAY_MISSIONS.find((m) => m.missionId === id) ?? MOCK_TODAY_MISSIONS[0];
  return { ok: true, data: found };
}
async function _getMissionReal(id: MissionId): Promise<ApiResult<Mission>> {
  return httpClient.get<Mission>(`/missions/${id}`);
}
export async function getMission(id: MissionId): Promise<ApiResult<Mission>> {
  return env.USE_MOCKS ? _getMissionMock(id) : _getMissionReal(id);
}

async function _completeMissionMock(
  req: CompleteMissionRequest,
): Promise<ApiResult<CompleteMissionResponse>> {
  await mockDelay();
  const base = MOCK_TODAY_MISSIONS.find((m) => m.missionId === req.missionId) ?? MOCK_TODAY_MISSIONS[0];
  const mission: Mission = {
    ...base,
    status: 'COMPLETED',
    completedAt: new Date().toISOString(),
  };
  return { ok: true, data: { mission, newStreakDays: 7 } };
}
async function _completeMissionReal(
  req: CompleteMissionRequest,
): Promise<ApiResult<CompleteMissionResponse>> {
  return httpClient.post<CompleteMissionResponse>(`/missions/${req.missionId}/complete`, {});
}
export async function completeMission(
  req: CompleteMissionRequest,
): Promise<ApiResult<CompleteMissionResponse>> {
  return env.USE_MOCKS ? _completeMissionMock(req) : _completeMissionReal(req);
}

async function _skipMissionMock(id: MissionId): Promise<ApiResult<Mission>> {
  await mockDelay();
  const base = MOCK_TODAY_MISSIONS.find((m) => m.missionId === id) ?? MOCK_TODAY_MISSIONS[0];
  return { ok: true, data: { ...base, status: 'SKIPPED', completedAt: null } };
}
async function _skipMissionReal(id: MissionId): Promise<ApiResult<Mission>> {
  return httpClient.post<Mission>(`/missions/${id}/skip`, {});
}
export async function skipMission(id: MissionId): Promise<ApiResult<Mission>> {
  return env.USE_MOCKS ? _skipMissionMock(id) : _skipMissionReal(id);
}

async function _getMissionHistoryMock(
  _from: string,
  _to: string,
): Promise<ApiResult<Mission[]>> {
  await mockDelay();
  return { ok: true, data: MOCK_TODAY_MISSIONS };
}
async function _getMissionHistoryReal(from: string, to: string): Promise<ApiResult<Mission[]>> {
  return httpClient.get<Mission[]>(`/missions/history?from=${from}&to=${to}`);
}
export async function getMissionHistory(
  from: string,
  to: string,
): Promise<ApiResult<Mission[]>> {
  return env.USE_MOCKS ? _getMissionHistoryMock(from, to) : _getMissionHistoryReal(from, to);
}
