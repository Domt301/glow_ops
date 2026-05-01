import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import type { UpdateUserPatch } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/types';

export function useUpdateUser() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation<User, Error, UpdateUserPatch>({
    mutationFn: async (patch) => {
      const result = await userService.updateUser(patch);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: ['user', 'me'] });
      setUser(user);
    },
  });
}
