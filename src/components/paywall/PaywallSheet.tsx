import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { PaywallOffering } from '@/types';
import { subscriptionService } from '@/services';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { TierCard } from './TierCard';

export type PaywallSheetProps = {
  offering: PaywallOffering;
  onPurchase: (productId: string) => void;
  onDismiss: () => void;
  isPurchasing?: boolean;
};

export function PaywallSheet({ offering, onPurchase, onDismiss, isPurchasing }: PaywallSheetProps) {
  const recommended = offering.options.find((o) => o.isRecommended) ?? offering.options[0];
  const [selectedId, setSelectedId] = useState<string>(recommended.productId);

  const restore = useMutation({
    mutationFn: async () => {
      const result = await subscriptionService.restorePurchases();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text variant="h1" color="platinum">
          Unlock your personalized Glow Protocol.
        </Text>
        <Text variant="body" color="steel">
          Start the trial. Cancel anytime.
        </Text>
      </Stack>
      <Stack gap="md">
        {offering.options.map((option) => (
          <TierCard
            key={option.productId}
            option={option}
            onSelect={() => setSelectedId(option.productId)}
            isSelected={selectedId === option.productId}
          />
        ))}
      </Stack>
      <Button
        label="Continue"
        onPress={() => onPurchase(selectedId)}
        loading={isPurchasing}
        fullWidth
      />
      <Button
        label="Restore purchases"
        variant="ghost"
        onPress={() => restore.mutate()}
        loading={restore.isPending}
        fullWidth
      />
      <Button label="Not now" variant="ghost" onPress={onDismiss} fullWidth />
    </Stack>
  );
}
