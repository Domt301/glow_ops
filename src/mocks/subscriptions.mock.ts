import type { PaywallOffering, SubscriptionEntitlement } from '@/types';

export const MOCK_FREE_ENTITLEMENT: SubscriptionEntitlement = {
  tier: 'free',
  isActive: true,
  expiresAt: null,
  willRenew: false,
  productIdentifier: null,
  provisional: false,
};

export const MOCK_PRO_ENTITLEMENT: SubscriptionEntitlement = {
  tier: 'pro',
  isActive: true,
  expiresAt: '2027-04-24T00:00:00Z',
  willRenew: true,
  productIdentifier: 'glowops_pro_annual',
  provisional: false,
};

export const MOCK_PAYWALL_OFFERING: PaywallOffering = {
  offeringId: 'default',
  options: [
    {
      productId: 'glowops_basic_monthly',
      tier: 'basic',
      displayPrice: '$6.99/month',
      pricePerMonth: 6.99,
      billingPeriod: 'monthly',
      trialDays: null,
      features: ['Daily missions', 'Streak tracking', 'Weekly reports'],
      isRecommended: false,
    },
    {
      productId: 'glowops_pro_monthly',
      tier: 'pro',
      displayPrice: '$14.99/month',
      pricePerMonth: 14.99,
      billingPeriod: 'monthly',
      trialDays: 7,
      features: [
        'Full Glow Audit',
        '30-day Protocol',
        'Daily missions',
        'Progress tracking',
        'Dating Profile Mode',
      ],
      isRecommended: true,
    },
    {
      productId: 'glowops_elite_monthly',
      tier: 'elite',
      displayPrice: '$29.99/month',
      pricePerMonth: 29.99,
      billingPeriod: 'monthly',
      trialDays: 7,
      features: [
        'Everything in Pro',
        'Executive Presence Mode',
        '90-day Transformation Protocol',
        'Priority support',
      ],
      isRecommended: false,
    },
  ],
};
