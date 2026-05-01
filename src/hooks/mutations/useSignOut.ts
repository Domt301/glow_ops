import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';

export function useSignOut() {
  const qc = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const result = await authService.signOut();
      if (!result.ok) throw new Error(result.error.message);
    },
    onSuccess: async () => {
      await clearSession();
      qc.clear();
    },
  });
}
