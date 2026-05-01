import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { BeforeAfterSlider } from '@/components/progress/BeforeAfterSlider';

const BEFORE = 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800';
const AFTER = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800';

export default function CompareScreen() {
  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Text variant="h2" color="platinum">
          Before / after
        </Text>
        <Text variant="caption" color="steel">
          Drag the divider to compare.
        </Text>
        <BeforeAfterSlider beforeUri={BEFORE} afterUri={AFTER} />
      </Stack>
    </Screen>
  );
}
