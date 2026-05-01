import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services';
import type { PaywallOffering } from '@/types';

export function usePaywallOffering() {
  return useQuery<PaywallOffering, Error>({
    queryKey: ['subscription', 'paywall'],
    queryFn: async () => {
      const result = await subscriptionService.getPaywallOffering();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
