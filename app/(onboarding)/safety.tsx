import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { useUpdateUser } from '@/hooks/mutations/useUpdateUser';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';

export default function SafetyScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const updateUser = useUpdateUser();

  const handleAccept = () => {
    updateUser.mutate(
      { safetyAcknowledgementAccepted: true },
      {
        onSuccess: () => {
          analyticsService.track('safety_acknowledged');
          router.push('/(onboarding)/photo-upload');
        },
        onError: (e) => showToast({ message: e.message, tone: 'error' }),
      },
    );
  };

  return (
    <Screen scrollable>
      <Stack gap="lg" justify="between" flex={1}>
        <Stack gap="base">
          <Text variant="h1" color="platinum">
            A few ground rules.
          </Text>
          <Text variant="body" color="platinum">
            GlowOps gives you guidance, not medical advice.
          </Text>
          <Text variant="body" color="steel">
            We do not recommend surgery, steroids, SARMs, extreme dieting, or any unsafe
            modification. If you&apos;re struggling with body image or mental health, please speak
            with a qualified professional.
          </Text>
          <Text variant="body" color="steel">
            Your photos stay private. We do not post, sell, or train models on your images without
            explicit consent.
          </Text>
        </Stack>
        <Button
          label="I understand"
          onPress={handleAccept}
          loading={updateUser.isPending}
          fullWidth
        />
      </Stack>
    </Screen>
  );
}
