import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { analyticsService } from '@/services';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    analyticsService.track('onboarding_started');
  }, []);

  return (
    <Screen>
      <Stack gap="xl" justify="center" flex={1}>
        <Text variant="display" color="platinum">
          GlowOps
        </Text>
        <Stack gap="base">
          <Text variant="h1" color="platinum">
            Build your Glow Protocol.
          </Text>
          <Text variant="body" color="steel">
            Upload a few photos. Get a private appearance audit and a step-by-step improvement plan.
          </Text>
        </Stack>
        <Button label="Start Audit" onPress={() => router.push('/(onboarding)/age-gate')} fullWidth />
      </Stack>
    </Screen>
  );
}
