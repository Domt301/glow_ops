import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';
import { Input } from '@/components/primitives/Input';
import { Button } from '@/components/primitives/Button';
import { signInSchema, type SignInInput } from '@/utils/validation';
import { useSignIn } from '@/hooks/mutations/useSignIn';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';

export default function SignInScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const signIn = useSignIn();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: SignInInput) => {
    signIn.mutate(values, {
      onSuccess: () => {
        analyticsService.track('sign_in_completed');
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
            GlowOps
          </Text>
          <Text variant="body" color="steel">
            Sign in to continue your protocol.
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
          label="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={signIn.isPending}
          fullWidth
        />

        <Pressable onPress={() => router.push('/(auth)/sign-up')} hitSlop={8}>
          <Text variant="caption" color="electricBlue" align="center">
            New here? Create an account
          </Text>
        </Pressable>
      </Stack>
    </Screen>
  );
}
