import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { MOCK_PROTOCOL } from '@/mocks/protocols.mock';
import type {
  ApiResult,
  Protocol,
  ProtocolId,
  StartProtocolRequest,
  StartProtocolResponse,
} from '@/types';

async function _startProtocolMock(
  _req: StartProtocolRequest,
): Promise<ApiResult<StartProtocolResponse>> {
  await mockDelay();
  return { ok: true, data: { protocol: MOCK_PROTOCOL } };
}
async function _startProtocolReal(
  req: StartProtocolRequest,
): Promise<ApiResult<StartProtocolResponse>> {
  return httpClient.post<StartProtocolResponse>('/protocols', req);
}
export async function startProtocol(
  req: StartProtocolRequest,
): Promise<ApiResult<StartProtocolResponse>> {
  return env.USE_MOCKS ? _startProtocolMock(req) : _startProtocolReal(req);
}

async function _getActiveProtocolMock(): Promise<ApiResult<Protocol | null>> {
  await mockDelay();
  return { ok: true, data: MOCK_PROTOCOL };
}
async function _getActiveProtocolReal(): Promise<ApiResult<Protocol | null>> {
  return httpClient.get<Protocol | null>('/protocols/active');
}
export async function getActiveProtocol(): Promise<ApiResult<Protocol | null>> {
  return env.USE_MOCKS ? _getActiveProtocolMock() : _getActiveProtocolReal();
}

async function _pauseProtocolMock(_id: ProtocolId): Promise<ApiResult<Protocol>> {
  await mockDelay();
  return { ok: true, data: { ...MOCK_PROTOCOL, status: 'PAUSED' } };
}
async function _pauseProtocolReal(id: ProtocolId): Promise<ApiResult<Protocol>> {
  return httpClient.post<Protocol>(`/protocols/${id}/pause`, {});
}
export async function pauseProtocol(id: ProtocolId): Promise<ApiResult<Protocol>> {
  return env.USE_MOCKS ? _pauseProtocolMock(id) : _pauseProtocolReal(id);
}

async function _resumeProtocolMock(_id: ProtocolId): Promise<ApiResult<Protocol>> {
  await mockDelay();
  return { ok: true, data: { ...MOCK_PROTOCOL, status: 'ACTIVE' } };
}
async function _resumeProtocolReal(id: ProtocolId): Promise<ApiResult<Protocol>> {
  return httpClient.post<Protocol>(`/protocols/${id}/resume`, {});
}
export async function resumeProtocol(id: ProtocolId): Promise<ApiResult<Protocol>> {
  return env.USE_MOCKS ? _resumeProtocolMock(id) : _resumeProtocolReal(id);
}
