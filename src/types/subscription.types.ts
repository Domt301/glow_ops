import type { SubscriptionTier } from './user.types';

export type SubscriptionEntitlement = {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  willRenew: boolean;
  productIdentifier: string | null;
  provisional: boolean;
};

export type PricingOption = {
  productId: string;
  tier: SubscriptionTier;
  displayPrice: string;
  pricePerMonth: number;
  billingPeriod: 'monthly' | 'annual' | 'lifetime' | 'one_time';
  trialDays: number | null;
  features: string[];
  isRecommended: boolean;
};

export type PaywallOffering = {
  offeringId: string;
  options: PricingOption[];
};

export type PurchaseRequest = {
  productId: string;
  receiptToken: string;
};

export type PurchaseResponse = {
  entitlement: SubscriptionEntitlement;
  receipt: string;
};
