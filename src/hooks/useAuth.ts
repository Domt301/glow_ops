import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = Boolean(accessToken);
  return { user, accessToken, isHydrated, isAuthenticated };
}

export { useAuthStore };
