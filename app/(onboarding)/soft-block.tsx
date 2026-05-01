import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';

export default function SoftBlockScreen() {
  return (
    <Screen>
      <Stack gap="base" justify="center" flex={1}>
        <Text variant="h1" color="platinum">
          GlowOps is currently 18+.
        </Text>
        <Text variant="body" color="steel">
          Come back when you&apos;re 18 or older. We&apos;re not going anywhere.
        </Text>
      </Stack>
    </Screen>
  );
}
