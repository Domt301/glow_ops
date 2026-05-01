import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';
import type { User } from '@/types';

export function useUser() {
  return useQuery<User, Error>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const result = await userService.getCurrentUser();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
