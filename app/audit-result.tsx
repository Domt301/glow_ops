import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { scanId as makeScanId } from '@/types/scan.types';
import { useAudit } from '@/hooks/queries/useAudit';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { AuditCategoryCard } from '@/components/audit/AuditCategoryCard';
import { BlurredPaywallOverlay } from '@/components/paywall/BlurredPaywallOverlay';
import { analyticsService } from '@/services';

export default function AuditResultScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const router = useRouter();
  const sid = scanId ? makeScanId(String(scanId)) : undefined;
  const audit = useAudit(sid);

  useEffect(() => {
    analyticsService.track('audit_result_viewed');
  }, []);

  if (audit.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (audit.error || !audit.data) {
    return (
      <Screen>
        <ErrorState
          error={audit.error ?? new Error('Audit not found')}
          onRetry={() => audit.refetch()}
        />
      </Screen>
    );
  }

  const top = audit.data.topImprovements;
  const visible = top.slice(0, 3);
  const locked = top.slice(3, 5);

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text variant="h1" color="platinum">
            Your top opportunities are clear.
          </Text>
          <Text variant="body" color="steel">
            Ranked by highest ROI. Start at #1.
          </Text>
        </Stack>

        <Stack gap="md">
          {visible.map((r) => (
            <AuditCategoryCard key={r.category} result={r} />
          ))}
        </Stack>

        {locked.length > 0 ? (
          <BlurredPaywallOverlay
            cta="Unlock Full Protocol"
            onUnlock={() => router.push('/paywall')}
          >
            <Stack gap="md">
              {locked.map((r) => (
                <AuditCategoryCard key={r.category} result={r} />
              ))}
            </Stack>
          </BlurredPaywallOverlay>
        ) : null}
      </Stack>
    </Screen>
  );
}
