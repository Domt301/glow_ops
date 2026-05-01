import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { MOCK_AUTH_RESPONSE } from '@/mocks/users.mock';
import type { ApiResult, AuthResponse, SignInRequest, SignUpRequest } from '@/types';

async function _signUpMock(_req: SignUpRequest): Promise<ApiResult<AuthResponse>> {
  await mockDelay();
  return { ok: true, data: MOCK_AUTH_RESPONSE };
}
async function _signUpReal(req: SignUpRequest): Promise<ApiResult<AuthResponse>> {
  return httpClient.post<AuthResponse>('/auth/sign-up', req);
}
export async function signUp(req: SignUpRequest): Promise<ApiResult<AuthResponse>> {
  return env.USE_MOCKS ? _signUpMock(req) : _signUpReal(req);
}

async function _signInMock(_req: SignInRequest): Promise<ApiResult<AuthResponse>> {
  await mockDelay();
  return { ok: true, data: MOCK_AUTH_RESPONSE };
}
async function _signInReal(req: SignInRequest): Promise<ApiResult<AuthResponse>> {
  return httpClient.post<AuthResponse>('/auth/sign-in', req);
}
export async function signIn(req: SignInRequest): Promise<ApiResult<AuthResponse>> {
  return env.USE_MOCKS ? _signInMock(req) : _signInReal(req);
}

async function _signOutMock(): Promise<ApiResult<void>> {
  await mockDelay(100);
  return { ok: true, data: undefined };
}
async function _signOutReal(): Promise<ApiResult<void>> {
  return httpClient.post<void>('/auth/sign-out', {});
}
export async function signOut(): Promise<ApiResult<void>> {
  return env.USE_MOCKS ? _signOutMock() : _signOutReal();
}

async function _refreshTokenMock(_token: string): Promise<ApiResult<AuthResponse>> {
  await mockDelay();
  return { ok: true, data: MOCK_AUTH_RESPONSE };
}
async function _refreshTokenReal(token: string): Promise<ApiResult<AuthResponse>> {
  return httpClient.post<AuthResponse>('/auth/refresh', { refreshToken: token });
}
export async function refreshToken(token: string): Promise<ApiResult<AuthResponse>> {
  return env.USE_MOCKS ? _refreshTokenMock(token) : _refreshTokenReal(token);
}
