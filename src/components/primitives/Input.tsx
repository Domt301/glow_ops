import { TextInput, type KeyboardTypeOptions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, durations, fontFamilies, fontSizes, radius, spacing } from '@/theme';
import { Text } from './Text';
import { Stack } from './Stack';

export type InputProps = {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'name' | 'off';
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
}: InputProps) {
  const focus = useSharedValue(0);

  const animatedBorder = useAnimatedStyle(() => {
    const errorColor = colors.crimson;
    const restColor = colors.hairline;
    const activeColor = colors.accent;

    if (error) {
      return { borderColor: errorColor };
    }

    return {
      borderColor: interpolateColor(focus.value, [0, 1], [restColor, activeColor]),
    };
  });

  return (
    <Stack gap="xs">
      {label ? (
        <Text variant="eyebrow" color="steel">
          {label}
        </Text>
      ) : null}
      <Animated.View
        style={[
          {
            backgroundColor: colors.slate,
            borderWidth: 1,
            borderRadius: radius.md,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.md,
            minHeight: 48,
            justifyContent: 'center',
          },
          animatedBorder,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            focus.value = withTiming(1, { duration: durations.fast });
          }}
          onBlur={() => {
            focus.value = withTiming(0, { duration: durations.fast });
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.steelDim}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          selectionColor={colors.accent}
          style={{
            color: colors.platinum,
            fontFamily: fontFamilies.inter,
            fontSize: fontSizes.md,
            padding: 0,
          }}
        />
      </Animated.View>
      {error ? (
        <Text variant="caption" color="crimson">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
