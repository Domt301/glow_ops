import { userId } from '@/types/user.types';
import type { AuthResponse, User } from '@/types';

export const MOCK_USER: User = {
  userId: userId('usr_mock_001'),
  email: 'demo@glowops.app',
  displayName: 'Alex',
  createdAt: '2026-04-01T10:00:00Z',
  lastActiveAt: '2026-04-24T08:30:00Z',
  subscriptionTier: 'free',
  onboardingComplete: true,
  ageGateAccepted: true,
  safetyAcknowledgementAccepted: true,
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  user: MOCK_USER,
  accessToken: 'mock_access_token_abc123',
  refreshToken: 'mock_refresh_token_xyz789',
};
