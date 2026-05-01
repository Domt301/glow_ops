import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/components/primitives/Card';
import { LoadingState } from '@/components/primitives/LoadingState';
import { useUser } from '@/hooks/queries/useUser';
import { useSubscription } from '@/hooks/queries/useSubscription';
import { useSignOut } from '@/hooks/mutations/useSignOut';
import { useAuthStore } from '@/stores/auth.store';
import { userService, analyticsService } from '@/services';
import { colors, radius, spacing } from '@/theme';
import type { ColorToken } from '@/theme';

const TIER_NAMES: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  elite: 'Elite',
  lifetime: 'Lifetime',
};

type ProfileRowItem = {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
};

function ProfileRow({ row }: { row: ProfileRowItem }) {
  const labelColor: ColorToken = row.destructive ? 'crimson' : 'platinum';
  return (
    <Card padding="md" onPress={row.onPress}>
      <Row gap="md" justify="between" align="center">
        <Text variant="bodyMedium" color={labelColor}>
          {row.label}
        </Text>
        {row.onPress ? <ChevronRight size={18} color={colors.steel} /> : null}
      </Row>
    </Card>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const userQ = useUser();
  const subQ = useSubscription();
  const signOut = useSignOut();
  const clearSession = useAuthStore((s) => s.clearSession);

  const sub = subQ.data;
  let subscriptionLabel = 'Subscription · Free';
  let subscriptionOnPress: (() => void) | undefined;
  if (sub) {
    if (sub.tier === 'free') {
      subscriptionLabel = 'Subscription · Free';
      subscriptionOnPress = () => router.push('/paywall');
    } else if (sub.provisional) {
      subscriptionLabel = `Subscription · ${TIER_NAMES[sub.tier] ?? sub.tier} · Confirming…`;
    } else {
      subscriptionLabel = `Subscription · ${TIER_NAMES[sub.tier] ?? sub.tier}`;
    }
  }

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You can come back anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          signOut.mutate(undefined, {
            onSuccess: () => {
              analyticsService.track('sign_out');
              router.replace('/');
            },
          });
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete account?',
      'This is permanent. Your photos, audits, and protocol history will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently delete account',
          style: 'destructive',
          onPress: async () => {
            const result = await userService.deleteAccount();
            if (result.ok) {
              await clearSession();
              router.replace('/');
            }
          },
        },
      ],
    );
  };

  if (userQ.isLoading || !userQ.data) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  const user = userQ.data;
  const initial = user.displayName?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase() ?? '?';

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Row gap="base" align="center">
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.pill,
              backgroundColor: colors.gunmetal,
              borderColor: colors.border,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="h2" color="platinum">
              {initial}
            </Text>
          </View>
          <Stack gap="xs" flex={1}>
            <Text variant="h3" color="platinum">
              {user.displayName ?? 'GlowOps user'}
            </Text>
            <Text variant="caption" color="steel">
              {user.email}
            </Text>
          </Stack>
        </Row>

        <Stack gap="sm">
          <ProfileRow row={{ label: subscriptionLabel, onPress: subscriptionOnPress }} />
          <ProfileRow row={{ label: 'Notifications' }} />
          <ProfileRow
            row={{ label: 'Privacy & data', onPress: () => router.push('/profile/privacy') }}
          />
          <ProfileRow row={{ label: 'Safety settings' }} />
          <ProfileRow row={{ label: 'Sign out', onPress: handleSignOut }} />
          <ProfileRow row={{ label: 'Delete account', onPress: handleDelete, destructive: true }} />
        </Stack>

        <View style={{ height: spacing.xl }} />
      </Stack>
    </Screen>
  );
}
