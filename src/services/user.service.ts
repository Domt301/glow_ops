import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { MOCK_USER } from '@/mocks/users.mock';
import type { ApiResult, User } from '@/types';

export type UpdateUserPatch = Partial<
  Pick<User, 'displayName' | 'ageGateAccepted' | 'safetyAcknowledgementAccepted'>
>;

let _mockCurrent: User = { ...MOCK_USER };

async function _getCurrentUserMock(): Promise<ApiResult<User>> {
  await mockDelay();
  return { ok: true, data: _mockCurrent };
}
async function _getCurrentUserReal(): Promise<ApiResult<User>> {
  return httpClient.get<User>('/user/me');
}
export async function getCurrentUser(): Promise<ApiResult<User>> {
  return env.USE_MOCKS ? _getCurrentUserMock() : _getCurrentUserReal();
}

async function _updateUserMock(patch: UpdateUserPatch): Promise<ApiResult<User>> {
  await mockDelay();
  _mockCurrent = { ..._mockCurrent, ...patch };
  return { ok: true, data: _mockCurrent };
}
async function _updateUserReal(patch: UpdateUserPatch): Promise<ApiResult<User>> {
  return httpClient.put<User>('/user/me', patch);
}
export async function updateUser(patch: UpdateUserPatch): Promise<ApiResult<User>> {
  return env.USE_MOCKS ? _updateUserMock(patch) : _updateUserReal(patch);
}

async function _deleteAccountMock(): Promise<ApiResult<void>> {
  await mockDelay();
  return { ok: true, data: undefined };
}
async function _deleteAccountReal(): Promise<ApiResult<void>> {
  return httpClient.delete<void>('/user/me');
}
export async function deleteAccount(): Promise<ApiResult<void>> {
  return env.USE_MOCKS ? _deleteAccountMock() : _deleteAccountReal();
}
