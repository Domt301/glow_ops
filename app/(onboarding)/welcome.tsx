import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Button } from '@/components/primitives/Button';
import { analyticsService } from '@/services';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    analyticsService.track('onboarding_started');
  }, []);

  return (
    <Screen>
      <Stack gap="xl" justify="between" flex={1}>
        <Stack gap="lg" justify="center" flex={1}>
          <Eyebrow color="accent">Glowops</Eyebrow>
          <Text variant="display" color="platinum">
            Build your Glow Protocol.
          </Text>
          <Text variant="bodyLarge" color="steel">
            Upload a few photos. Get a private appearance audit and a step-by-step plan, ranked by
            highest ROI.
          </Text>
        </Stack>
        <Button
          label="Start audit"
          iconRight={ArrowRight}
          onPress={() => router.push('/(onboarding)/age-gate')}
          fullWidth
          size="lg"
        />
      </Stack>
    </Screen>
  );
}
