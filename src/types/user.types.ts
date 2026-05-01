import type { IsoDate } from './api.types';

export type UserId = string & { __brand: 'UserId' };
export const userId = (s: string): UserId => s as UserId;

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite' | 'lifetime';

export type User = {
  userId: UserId;
  email: string;
  displayName: string | null;
  createdAt: IsoDate;
  lastActiveAt: IsoDate;
  subscriptionTier: SubscriptionTier;
  onboardingComplete: boolean;
  ageGateAccepted: boolean;
  safetyAcknowledgementAccepted: boolean;
};

export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
