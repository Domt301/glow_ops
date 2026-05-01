import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';

export default function PrivacyScreen() {
  return (
    <Screen scrollable>
      <Stack gap="base">
        <Text variant="h1" color="platinum">
          Privacy
        </Text>
        <Text variant="body" color="platinum">
          Your photos are private by default. GlowOps does not post, sell, or expose your images.
          You control your data.
        </Text>
      </Stack>
    </Screen>
  );
}
