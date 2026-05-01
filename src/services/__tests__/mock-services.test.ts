import { getAuditByScan } from '@/services/audit.service';
import { refreshToken, signIn, signOut, signUp } from '@/services/auth.service';
import { httpClient } from '@/services/http/client';
import {
  completeMission,
  getMission,
  getMissionHistory,
  getTodayMissions,
  skipMission,
} from '@/services/mission.service';
import { deletePhoto, listUserPhotos, uploadPhoto } from '@/services/photo.service';
import {
  getActiveProtocol,
  pauseProtocol,
  resumeProtocol,
  startProtocol,
} from '@/services/protocol.service';
import { getProgressOverview, getStreak } from '@/services/progress.service';
import { generateShareCard, getReport, listReports } from '@/services/report.service';
import { createScan, getLatestScan, getScan } from '@/services/scan.service';
import {
  getEntitlement,
  getPaywallOffering,
  purchase,
  restorePurchases,
} from '@/services/subscription.service';
import { deleteAccount, getCurrentUser, updateUser } from '@/services/user.service';
import { MOCK_AUDIT } from '@/mocks/audits.mock';
import { MOCK_TODAY_MISSIONS } from '@/mocks/missions.mock';
import { MOCK_PROTOCOL } from '@/mocks/protocols.mock';
import { MOCK_INITIAL_REPORT, MOCK_WEEKLY_REPORT } from '@/mocks/reports.mock';
import { MOCK_SCAN_READY } from '@/mocks/scans.mock';
import {
  MOCK_FREE_ENTITLEMENT,
  MOCK_PAYWALL_OFFERING,
  MOCK_PRO_ENTITLEMENT,
} from '@/mocks/subscriptions.mock';
import { MOCK_AUTH_RESPONSE, MOCK_USER } from '@/mocks/users.mock';
import { missionId } from '@/types/mission.types';
import { photoId } from '@/types/photo.types';
import { protocolId } from '@/types/protocol.types';
import { reportId } from '@/types/report.types';
import { scanId } from '@/types/scan.types';

jest.mock('@/services/http/mock-delay', () => ({
  mockDelay: jest.fn(async () => undefined),
}));

describe('mock-backed services', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-01T12:00:00Z'));
    Math.random = jest.fn(() => 0);
  });

  afterEach(() => {
    jest.useRealTimers();
    Math.random = originalRandom;
  });

  it('returns mock auth responses', async () => {
    await expect(signUp({ email: 'demo@glowops.app', password: 'password123' })).resolves.toEqual({
      ok: true,
      data: MOCK_AUTH_RESPONSE,
    });
    await expect(signIn({ email: 'demo@glowops.app', password: 'password123' })).resolves.toEqual({
      ok: true,
      data: MOCK_AUTH_RESPONSE,
    });
    await expect(refreshToken('refresh-token')).resolves.toEqual({
      ok: true,
      data: MOCK_AUTH_RESPONSE,
    });
    await expect(signOut()).resolves.toEqual({ ok: true, data: undefined });
  });

  it('reads and mutates the mock current user', async () => {
    await expect(getCurrentUser()).resolves.toEqual({ ok: true, data: MOCK_USER });

    await expect(updateUser({ displayName: 'Taylor', ageGateAccepted: false })).resolves.toMatchObject({
      ok: true,
      data: { displayName: 'Taylor', ageGateAccepted: false },
    });
    await expect(getCurrentUser()).resolves.toMatchObject({
      ok: true,
      data: { displayName: 'Taylor', ageGateAccepted: false },
    });
    await expect(deleteAccount()).resolves.toEqual({ ok: true, data: undefined });
  });

  it('serves missions and stateful mission actions', async () => {
    await expect(getTodayMissions()).resolves.toEqual({ ok: true, data: MOCK_TODAY_MISSIONS });
    await expect(getMission(MOCK_TODAY_MISSIONS[1].missionId)).resolves.toEqual({
      ok: true,
      data: MOCK_TODAY_MISSIONS[1],
    });
    await expect(getMission(missionId('missing'))).resolves.toEqual({
      ok: true,
      data: MOCK_TODAY_MISSIONS[0],
    });

    await expect(completeMission({ missionId: MOCK_TODAY_MISSIONS[1].missionId })).resolves.toMatchObject({
      ok: true,
      data: { mission: { status: 'COMPLETED' }, newStreakDays: 7 },
    });
    await expect(skipMission(MOCK_TODAY_MISSIONS[2].missionId)).resolves.toMatchObject({
      ok: true,
      data: { status: 'SKIPPED', completedAt: null },
    });
    await expect(getMissionHistory('2026-04-01', '2026-05-01')).resolves.toEqual({
      ok: true,
      data: MOCK_TODAY_MISSIONS,
    });
  });

  it('serves and transitions protocol state', async () => {
    await expect(startProtocol({ auditId: 'aud_mock_001', type: '30_DAY' })).resolves.toEqual({
      ok: true,
      data: { protocol: MOCK_PROTOCOL },
    });
    await expect(getActiveProtocol()).resolves.toEqual({ ok: true, data: MOCK_PROTOCOL });
    await expect(pauseProtocol(protocolId('prt_mock_001'))).resolves.toMatchObject({
      ok: true,
      data: { status: 'PAUSED' },
    });
    await expect(resumeProtocol(protocolId('prt_mock_001'))).resolves.toMatchObject({
      ok: true,
      data: { status: 'ACTIVE' },
    });
  });

  it('creates, fetches, and lists scan data', async () => {
    const photoIds = [photoId('pho_1'), photoId('pho_2')];

    await expect(createScan({ photoIds })).resolves.toMatchObject({
      ok: true,
      data: {
        scan: {
          scanId: expect.stringMatching(/^scn_/),
          status: 'PROCESSING',
          photoIds,
          createdAt: '2026-05-01T12:00:00.000Z',
        },
      },
    });
    await expect(getScan(scanId('scn_mock_001'))).resolves.toEqual({ ok: true, data: MOCK_SCAN_READY });
    await expect(getLatestScan()).resolves.toEqual({ ok: true, data: MOCK_SCAN_READY });
  });

  it('uploads, deletes, and lists photos', async () => {
    await expect(
      uploadPhoto({
        kind: 'selfie_front',
        localUri: 'file:///tmp/selfie.jpg',
        width: 1200,
        height: 1600,
        sizeBytes: 2048,
      }),
    ).resolves.toMatchObject({
      ok: true,
      data: {
        photo: {
          photoId: expect.stringMatching(/^pho_/),
          kind: 'selfie_front',
          uri: 'file:///tmp/selfie.jpg',
          uploadedAt: '2026-05-01T12:00:00.000Z',
          width: 1200,
          height: 1600,
          sizeBytes: 2048,
        },
      },
    });
    await expect(deletePhoto(photoId('pho_1'))).resolves.toEqual({ ok: true, data: undefined });
    await expect(listUserPhotos()).resolves.toEqual({ ok: true, data: [] });
  });

  it('serves progress, reports, audits, and subscriptions', async () => {
    await expect(getProgressOverview()).resolves.toMatchObject({
      ok: true,
      data: { streak: { currentDays: 7 }, totalMissionsCompleted: 54 },
    });
    await expect(getStreak()).resolves.toMatchObject({ ok: true, data: { longestDays: 12 } });
    await expect(getReport(reportId('rpt_mock_002'))).resolves.toEqual({
      ok: true,
      data: MOCK_WEEKLY_REPORT,
    });
    await expect(getReport(reportId('missing'))).resolves.toEqual({
      ok: true,
      data: MOCK_INITIAL_REPORT,
    });
    await expect(listReports()).resolves.toEqual({
      ok: true,
      data: [MOCK_WEEKLY_REPORT, MOCK_INITIAL_REPORT],
    });
    await expect(generateShareCard(reportId('rpt_mock_001'))).resolves.toEqual({
      ok: true,
      data: { url: 'https://mock.glowops.app/cards/mock.png' },
    });
    await expect(getAuditByScan(scanId('scn_mock_001'))).resolves.toEqual({
      ok: true,
      data: MOCK_AUDIT,
    });
    await expect(getEntitlement()).resolves.toEqual({ ok: true, data: MOCK_FREE_ENTITLEMENT });
    await expect(getPaywallOffering()).resolves.toEqual({
      ok: true,
      data: MOCK_PAYWALL_OFFERING,
    });
    await expect(purchase({ productId: 'glowops_pro_monthly', receiptToken: 'receipt' })).resolves.toEqual({
      ok: true,
      data: { entitlement: MOCK_PRO_ENTITLEMENT, receipt: 'receipt' },
    });
    await expect(getEntitlement()).resolves.toEqual({ ok: true, data: MOCK_PRO_ENTITLEMENT });
    await expect(restorePurchases()).resolves.toEqual({ ok: true, data: MOCK_PRO_ENTITLEMENT });
  });
});

describe('http client placeholder', () => {
  it('throws actionable errors until real networking is implemented', async () => {
    await expect(httpClient.get('/health')).rejects.toThrow(
      'HttpClient.get not implemented (path: /health). Set USE_MOCKS=true.',
    );
    await expect(httpClient.post('/health', {})).rejects.toThrow(
      'HttpClient.post not implemented (path: /health). Set USE_MOCKS=true.',
    );
    await expect(httpClient.put('/health', {})).rejects.toThrow(
      'HttpClient.put not implemented (path: /health). Set USE_MOCKS=true.',
    );
    await expect(httpClient.delete('/health')).rejects.toThrow(
      'HttpClient.delete not implemented (path: /health). Set USE_MOCKS=true.',
    );
  });
});
