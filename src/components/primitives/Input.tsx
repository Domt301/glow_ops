import { TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { colors, radius, spacing } from '@/theme';
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
  return (
    <Stack gap="xs">
      {label ? (
        <Text variant="label" color="steel">
          {label}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.gunmetal,
          borderColor: error ? colors.crimson : colors.border,
          borderWidth: 1,
          borderRadius: radius.md,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.md,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.steelDim}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          style={{ color: colors.platinum, fontSize: 15, padding: 0 }}
        />
      </View>
      {error ? (
        <Text variant="caption" color="crimson">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
