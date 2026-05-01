import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { generateId } from '@/utils/id';
import { scanId as makeScanId } from '@/types/scan.types';
import { MOCK_SCAN_PROCESSING, MOCK_SCAN_READY } from '@/mocks/scans.mock';
import type {
  ApiResult,
  CreateScanRequest,
  CreateScanResponse,
  Scan,
  ScanId,
} from '@/types';

async function _createScanMock(req: CreateScanRequest): Promise<ApiResult<CreateScanResponse>> {
  await mockDelay();
  const scan: Scan = {
    ...MOCK_SCAN_PROCESSING,
    scanId: makeScanId(generateId('scn')),
    photoIds: req.photoIds,
    createdAt: new Date().toISOString(),
  };
  return { ok: true, data: { scan } };
}
async function _createScanReal(req: CreateScanRequest): Promise<ApiResult<CreateScanResponse>> {
  return httpClient.post<CreateScanResponse>('/scans', req);
}
export async function createScan(req: CreateScanRequest): Promise<ApiResult<CreateScanResponse>> {
  return env.USE_MOCKS ? _createScanMock(req) : _createScanReal(req);
}

async function _getScanMock(_id: ScanId): Promise<ApiResult<Scan>> {
  await mockDelay();
  return { ok: true, data: MOCK_SCAN_READY };
}
async function _getScanReal(id: ScanId): Promise<ApiResult<Scan>> {
  return httpClient.get<Scan>(`/scans/${id}`);
}
export async function getScan(id: ScanId): Promise<ApiResult<Scan>> {
  return env.USE_MOCKS ? _getScanMock(id) : _getScanReal(id);
}

async function _getLatestScanMock(): Promise<ApiResult<Scan | null>> {
  await mockDelay();
  return { ok: true, data: MOCK_SCAN_READY };
}
async function _getLatestScanReal(): Promise<ApiResult<Scan | null>> {
  return httpClient.get<Scan | null>('/scans/latest');
}
export async function getLatestScan(): Promise<ApiResult<Scan | null>> {
  return env.USE_MOCKS ? _getLatestScanMock() : _getLatestScanReal();
}
