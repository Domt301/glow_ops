import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { IconButton } from '@/components/primitives/IconButton';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { PaywallSheet } from '@/components/paywall/PaywallSheet';
import { usePaywallOffering } from '@/hooks/queries/usePaywallOffering';
import { usePurchase } from '@/hooks/mutations/usePurchase';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';

export default function PaywallScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const offering = usePaywallOffering();
  const purchase = usePurchase();

  useEffect(() => {
    analyticsService.track('paywall_viewed');
  }, []);

  const handleClose = () => {
    analyticsService.track('paywall_dismissed');
    router.back();
  };

  const handlePurchase = (productId: string) => {
    analyticsService.track('tier_selected', { productId });
    // TODO(agent): replace 'mock_receipt' with RevenueCat purchaseProduct() result at cutover, see mobile_app.md §15
    purchase.mutate(
      { productId, receiptToken: 'mock_receipt' },
      {
        onSuccess: () => router.replace('/(app)/home'),
        onError: (e) => showToast({ message: e.message, tone: 'error' }),
      },
    );
  };

  return (
    <Screen scrollable>
      <Stack gap="base">
        <Row justify="end">
          <IconButton icon={X} onPress={handleClose} accessibilityLabel="Close" />
        </Row>
        {offering.isLoading ? (
          <View style={{ minHeight: 400 }}>
            <LoadingState />
          </View>
        ) : offering.error || !offering.data ? (
          <ErrorState
            error={offering.error ?? new Error('Paywall unavailable')}
            onRetry={() => offering.refetch()}
          />
        ) : (
          <PaywallSheet
            offering={offering.data}
            onPurchase={handlePurchase}
            onDismiss={handleClose}
            isPurchasing={purchase.isPending}
          />
        )}
      </Stack>
    </Screen>
  );
}
