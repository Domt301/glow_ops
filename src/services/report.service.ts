import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { MOCK_INITIAL_REPORT, MOCK_WEEKLY_REPORT } from '@/mocks/reports.mock';
import type { ApiResult, Report, ReportId } from '@/types';

async function _getReportMock(id: ReportId): Promise<ApiResult<Report>> {
  await mockDelay();
  const found =
    [MOCK_INITIAL_REPORT, MOCK_WEEKLY_REPORT].find((r) => r.reportId === id) ??
    MOCK_INITIAL_REPORT;
  return { ok: true, data: found };
}
async function _getReportReal(id: ReportId): Promise<ApiResult<Report>> {
  return httpClient.get<Report>(`/reports/${id}`);
}
export async function getReport(id: ReportId): Promise<ApiResult<Report>> {
  return env.USE_MOCKS ? _getReportMock(id) : _getReportReal(id);
}

async function _listReportsMock(): Promise<ApiResult<Report[]>> {
  await mockDelay();
  return { ok: true, data: [MOCK_WEEKLY_REPORT, MOCK_INITIAL_REPORT] };
}
async function _listReportsReal(): Promise<ApiResult<Report[]>> {
  return httpClient.get<Report[]>('/reports');
}
export async function listReports(): Promise<ApiResult<Report[]>> {
  return env.USE_MOCKS ? _listReportsMock() : _listReportsReal();
}

async function _generateShareCardMock(_id: ReportId): Promise<ApiResult<{ url: string }>> {
  await mockDelay();
  return { ok: true, data: { url: 'https://mock.glowops.app/cards/mock.png' } };
}
async function _generateShareCardReal(id: ReportId): Promise<ApiResult<{ url: string }>> {
  return httpClient.post<{ url: string }>(`/reports/${id}/share-card`, {});
}
export async function generateShareCard(id: ReportId): Promise<ApiResult<{ url: string }>> {
  return env.USE_MOCKS ? _generateShareCardMock(id) : _generateShareCardReal(id);
}
