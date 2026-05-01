import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthResponse, SignInRequest } from '@/types';

export function useSignIn() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResponse, Error, SignInRequest>({
    mutationFn: async (req) => {
      const result = await authService.signIn(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: async (data) => {
      await setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
