import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import {
  MOCK_FREE_ENTITLEMENT,
  MOCK_PAYWALL_OFFERING,
  MOCK_PRO_ENTITLEMENT,
} from '@/mocks/subscriptions.mock';
import type {
  ApiResult,
  PaywallOffering,
  PurchaseRequest,
  PurchaseResponse,
  SubscriptionEntitlement,
} from '@/types';

let _entitlement: SubscriptionEntitlement = MOCK_FREE_ENTITLEMENT;

async function _getEntitlementMock(): Promise<ApiResult<SubscriptionEntitlement>> {
  await mockDelay();
  return { ok: true, data: _entitlement };
}
async function _getEntitlementReal(): Promise<ApiResult<SubscriptionEntitlement>> {
  return httpClient.get<SubscriptionEntitlement>('/subscription/entitlement');
}
export async function getEntitlement(): Promise<ApiResult<SubscriptionEntitlement>> {
  return env.USE_MOCKS ? _getEntitlementMock() : _getEntitlementReal();
}

async function _getPaywallOfferingMock(): Promise<ApiResult<PaywallOffering>> {
  await mockDelay();
  return { ok: true, data: MOCK_PAYWALL_OFFERING };
}
async function _getPaywallOfferingReal(): Promise<ApiResult<PaywallOffering>> {
  return httpClient.get<PaywallOffering>('/subscription/paywall');
}
export async function getPaywallOffering(): Promise<ApiResult<PaywallOffering>> {
  return env.USE_MOCKS ? _getPaywallOfferingMock() : _getPaywallOfferingReal();
}

async function _purchaseMock(req: PurchaseRequest): Promise<ApiResult<PurchaseResponse>> {
  await mockDelay();
  _entitlement = MOCK_PRO_ENTITLEMENT;
  return { ok: true, data: { entitlement: MOCK_PRO_ENTITLEMENT, receipt: req.receiptToken } };
}
async function _purchaseReal(req: PurchaseRequest): Promise<ApiResult<PurchaseResponse>> {
  return httpClient.post<PurchaseResponse>('/subscription/purchase', req);
}
export async function purchase(req: PurchaseRequest): Promise<ApiResult<PurchaseResponse>> {
  return env.USE_MOCKS ? _purchaseMock(req) : _purchaseReal(req);
}

async function _restorePurchasesMock(): Promise<ApiResult<SubscriptionEntitlement>> {
  await mockDelay();
  _entitlement = MOCK_PRO_ENTITLEMENT;
  return { ok: true, data: MOCK_PRO_ENTITLEMENT };
}
async function _restorePurchasesReal(): Promise<ApiResult<SubscriptionEntitlement>> {
  return httpClient.post<SubscriptionEntitlement>('/subscription/restore', {});
}
export async function restorePurchases(): Promise<ApiResult<SubscriptionEntitlement>> {
  return env.USE_MOCKS ? _restorePurchasesMock() : _restorePurchasesReal();
}
