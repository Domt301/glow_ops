import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { MOCK_AUDIT } from '@/mocks/audits.mock';
import type { ApiResult, Audit, ScanId } from '@/types';

async function _getAuditByScanMock(_id: ScanId): Promise<ApiResult<Audit>> {
  await mockDelay();
  return { ok: true, data: MOCK_AUDIT };
}
async function _getAuditByScanReal(id: ScanId): Promise<ApiResult<Audit>> {
  return httpClient.get<Audit>(`/audits/by-scan/${id}`);
}
export async function getAuditByScan(id: ScanId): Promise<ApiResult<Audit>> {
  return env.USE_MOCKS ? _getAuditByScanMock(id) : _getAuditByScanReal(id);
}
