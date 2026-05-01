import { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { scanId as makeScanId } from '@/types/scan.types';
import type { ProtocolType } from '@/types';
import { useAudit } from '@/hooks/queries/useAudit';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Stat } from '@/components/primitives/Stat';
import { Card } from '@/components/primitives/Card';
import { LoadingState } from '@/components/primitives/LoadingState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { AuditCategoryCard } from '@/components/audit/AuditCategoryCard';
import { BlurredPaywallOverlay } from '@/components/paywall/BlurredPaywallOverlay';
import { analyticsService } from '@/services';

const PROTOCOL_DAYS: Record<ProtocolType, number> = {
  '14_DAY': 14,
  '30_DAY': 30,
  '90_DAY': 90,
};

function formatStamp(iso: string | undefined): string {
  if (!iso) return 'AUDIT';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'AUDIT';
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `Audit · ${yyyy}.${mm}.${dd}`;
}

export default function AuditResultScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const router = useRouter();
  const sid = scanId ? makeScanId(String(scanId)) : undefined;
  const audit = useAudit(sid);

  useEffect(() => {
    analyticsService.track('audit_result_viewed');
  }, []);

  const stamp = useMemo(() => formatStamp(audit.data?.generatedAt), [audit.data?.generatedAt]);

  if (audit.isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading your audit" />
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
  const [hero, ...rest] = top;
  const visibleRest = rest.slice(0, 2);
  const locked = rest.slice(2, 4);
  const protocolDays = PROTOCOL_DAYS[audit.data.recommendedProtocolType];

  return (
    <Screen scrollable>
      <Stack gap="xl">
        <Stack gap="sm">
          <Eyebrow>{stamp}</Eyebrow>
          <Text variant="display" color="platinum">
            Top opportunities.
          </Text>
          <Text variant="bodyLarge" color="steel">
            Ranked by highest ROI. Start at one.
          </Text>
        </Stack>

        {hero ? <AuditCategoryCard result={hero} hero /> : null}

        {visibleRest.length > 0 ? (
          <Stack gap="md">
            <Eyebrow>Next priorities</Eyebrow>
            <Stack gap="sm">
              {visibleRest.map((r) => (
                <AuditCategoryCard key={r.category} result={r} />
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Card tone="raised" padding="lg">
          <Row gap="lg" align="center" justify="between">
            <Stack gap="xs" flex={1}>
              <Eyebrow>Recommended protocol</Eyebrow>
              <Text variant="bodyLarge" color="platinum">
                Built for your top three.
              </Text>
            </Stack>
            <Stat value={protocolDays} unit="days" size="lg" color="accent" align="right" />
          </Row>
        </Card>

        {locked.length > 0 ? (
          <Stack gap="md">
            <Eyebrow>Locked priorities</Eyebrow>
            <BlurredPaywallOverlay
              cta="Unlock full protocol"
              onUnlock={() => router.push('/paywall')}
            >
              <Stack gap="sm">
                {locked.map((r) => (
                  <AuditCategoryCard key={r.category} result={r} />
                ))}
              </Stack>
            </BlurredPaywallOverlay>
          </Stack>
        ) : null}
      </Stack>
    </Screen>
  );
}
