import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services';
import type { SubscriptionEntitlement } from '@/types';

export function useSubscription() {
  return useQuery<SubscriptionEntitlement, Error>({
    queryKey: ['subscription', 'entitlement'],
    queryFn: async () => {
      const result = await subscriptionService.getEntitlement();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    refetchInterval: (query) => (query.state.data?.provisional ? 5000 : false),
  });
}
