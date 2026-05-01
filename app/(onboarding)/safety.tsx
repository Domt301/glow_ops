import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Button } from '@/components/primitives/Button';
import { useUpdateUser } from '@/hooks/mutations/useUpdateUser';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';
import { colors, spacing } from '@/theme';

const RULES: { title: string; body: string }[] = [
  {
    title: 'Guidance, not medicine',
    body: 'Glowops gives you guidance, not medical advice. For health concerns, talk to a qualified professional.',
  },
  {
    title: 'No unsafe shortcuts',
    body: 'We never recommend surgery, steroids, SARMs, or extreme dieting. If you’re struggling with body image or mental health, please reach out for support.',
  },
  {
    title: 'Your photos stay private',
    body: 'We don’t post, sell, or train models on your images without explicit consent.',
  },
];

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <Row gap="md" align="start">
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.accent,
          marginTop: spacing.sm + 2,
        }}
      />
      <Stack gap="xs" flex={1}>
        <Text variant="bodyMedium" color="platinum">
          {title}
        </Text>
        <Text variant="body" color="steel">
          {body}
        </Text>
      </Stack>
    </Row>
  );
}

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
      <Stack gap="xl" justify="between" flex={1}>
        <Stack gap="lg">
          <Stack gap="sm">
            <Eyebrow>Step 02 / 04</Eyebrow>
            <Text variant="display" color="platinum">
              Ground rules.
            </Text>
          </Stack>
          <Stack gap="lg">
            {RULES.map((r) => (
              <Rule key={r.title} title={r.title} body={r.body} />
            ))}
          </Stack>
        </Stack>
        <Button
          label="I understand"
          onPress={handleAccept}
          loading={updateUser.isPending}
          fullWidth
          size="lg"
        />
      </Stack>
    </Screen>
  );
}
