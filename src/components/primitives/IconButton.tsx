import { Pressable } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, type ColorToken } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export type IconButtonProps = {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
  color?: ColorToken;
  accessibilityLabel?: string;
};

export function IconButton({
  icon: Icon,
  onPress,
  size = 24,
  color = 'platinum',
  accessibilityLabel,
}: IconButtonProps) {
  const haptics = useHaptics();
  return (
    <Pressable
      onPress={() => {
        haptics.light();
        onPress();
      }}
      hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Icon size={size} color={colors[color]} />
    </Pressable>
  );
}
