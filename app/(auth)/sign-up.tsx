import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Input } from '@/components/primitives/Input';
import { Button } from '@/components/primitives/Button';
import { signUpSchema, type SignUpInput } from '@/utils/validation';
import { useSignUp } from '@/hooks/mutations/useSignUp';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';

export default function SignUpScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const signUp = useSignUp();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: SignUpInput) => {
    analyticsService.track('sign_up_started');
    signUp.mutate(values, {
      onSuccess: () => {
        analyticsService.track('sign_up_completed');
        router.replace('/');
      },
      onError: (e) => showToast({ message: e.message, tone: 'error' }),
    });
  };

  return (
    <Screen scrollable>
      <Stack gap="lg" justify="center" flex={1}>
        <Stack gap="xs">
          <Text variant="display" color="platinum">
            Create account
          </Text>
          <Text variant="body" color="steel">
            Build your Glow Protocol.
          </Text>
        </Stack>

        <Stack gap="base">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoComplete="email"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="Password"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="At least 8 characters"
                secureTextEntry
                autoComplete="password"
                error={errors.password?.message}
              />
            )}
          />
        </Stack>

        <Button
          label="Create account"
          onPress={handleSubmit(onSubmit)}
          loading={signUp.isPending}
          fullWidth
        />

        <Pressable onPress={() => router.push('/(auth)/sign-in')} hitSlop={8}>
          <Text variant="caption" color="electricBlue" align="center">
            Already have an account? Sign in
          </Text>
        </Pressable>
      </Stack>
    </Screen>
  );
}
