import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useInter, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts as useSora, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { useFonts as useMono, JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { colors } from '@/theme';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import { Text } from '@/components/primitives/Text';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

function Toast() {
  const toast = useUiStore((s) => s.activeToast);
  const hide = useUiStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hide, 3000);
    return () => clearTimeout(t);
  }, [toast, hide]);

  if (!toast) return null;
  const tint =
    toast.tone === 'success'
      ? colors.signalGreen
      : toast.tone === 'error'
        ? colors.crimson
        : colors.electricBlue;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: 48,
        left: 16,
        right: 16,
        backgroundColor: colors.gunmetal,
        borderColor: tint,
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <Text variant="body" color="platinum">
        {toast.message}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const [soraLoaded] = useSora({ Sora_600SemiBold, Sora_700Bold });
  const [monoLoaded] = useMono({ JetBrainsMono_500Medium, JetBrainsMono_700Bold });
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const fontsLoaded = interLoaded && soraLoaded && monoLoaded;
  const ready = fontsLoaded && isHydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.obsidian }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.obsidian },
            }}
          />
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
