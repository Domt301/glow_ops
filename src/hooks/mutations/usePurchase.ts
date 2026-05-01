import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsService, subscriptionService } from '@/services';
import type { PurchaseRequest, PurchaseResponse } from '@/types';

export function usePurchase() {
  const qc = useQueryClient();
  return useMutation<PurchaseResponse, Error, PurchaseRequest>({
    mutationFn: async (req) => {
      const result = await subscriptionService.purchase(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['subscription', 'entitlement'] });
      analyticsService.track('subscription_started', {
        productId: variables.productId,
        tier: data.entitlement.tier,
      });
    },
  });
}
