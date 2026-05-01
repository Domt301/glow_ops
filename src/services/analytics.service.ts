import type { UserId } from '@/types';

export type AnalyticsEvent =
  | 'app_opened'
  | 'sign_up_started'
  | 'sign_up_completed'
  | 'sign_in_completed'
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  | 'age_gate_accepted'
  | 'age_gate_declined'
  | 'safety_acknowledged'
  | 'photo_picked'
  | 'photo_uploaded'
  | 'scan_created'
  | 'audit_started'
  | 'audit_completed'
  | 'audit_result_viewed'
  | 'paywall_viewed'
  | 'paywall_dismissed'
  | 'tier_selected'
  | 'subscription_started'
  | 'subscription_restored'
  | 'protocol_started'
  | 'mission_viewed'
  | 'mission_completed'
  | 'mission_skipped'
  | 'streak_started'
  | 'streak_extended'
  | 'streak_broken'
  | 'progress_viewed'
  | 'report_viewed'
  | 'report_shared'
  | 'sign_out';

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (properties) {
    console.log('[analytics]', event, properties);
  } else {
    console.log('[analytics]', event);
  }
}

export function identify(userId: UserId, traits?: Record<string, unknown>): void {
  console.log('[analytics] identify', userId, traits ?? {});
}

export function reset(): void {
  console.log('[analytics] reset');
}
