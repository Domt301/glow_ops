import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { useUser } from '@/hooks/queries/useUser';
import { LoadingState } from '@/components/primitives/LoadingState';
import { Screen } from '@/components/primitives/Screen';

export default function Index() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userQuery = useUser();

  if (!isHydrated) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (!accessToken) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (userQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (userQuery.data && !userQuery.data.onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(app)/home" />;
}
