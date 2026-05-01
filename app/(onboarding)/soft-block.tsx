import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';

export default function SoftBlockScreen() {
  return (
    <Screen>
      <Stack gap="md" justify="center" flex={1}>
        <Eyebrow color="amber">Access restricted</Eyebrow>
        <Text variant="display" color="platinum">
          Glowops is 18+.
        </Text>
        <Text variant="bodyLarge" color="steel">
          Come back when you&apos;re 18 or older. We&apos;re not going anywhere.
        </Text>
      </Stack>
    </Screen>
  );
}
