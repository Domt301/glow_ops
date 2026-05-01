import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { useUpdateUser } from '@/hooks/mutations/useUpdateUser';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';

export default function AgeGateScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const updateUser = useUpdateUser();

  const handleYes = () => {
    updateUser.mutate(
      { ageGateAccepted: true },
      {
        onSuccess: () => {
          analyticsService.track('age_gate_accepted');
          router.push('/(onboarding)/safety');
        },
        onError: (e) => showToast({ message: e.message, tone: 'error' }),
      },
    );
  };

  const handleNo = () => {
    analyticsService.track('age_gate_declined');
    router.push('/(onboarding)/soft-block');
  };

  return (
    <Screen>
      <Stack gap="xl" justify="center" flex={1}>
        <Text variant="h1" color="platinum">
          Are you 18 or older?
        </Text>
        <Stack gap="md">
          <Button
            label="Yes, I'm 18+"
            onPress={handleYes}
            loading={updateUser.isPending}
            fullWidth
          />
          <Button label="No" variant="ghost" onPress={handleNo} fullWidth />
        </Stack>
      </Stack>
    </Screen>
  );
}
