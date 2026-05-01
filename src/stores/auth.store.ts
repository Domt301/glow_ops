import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '@/types';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (user: User) => void;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const ACCESS_KEY = 'glowops.accessToken';
const REFRESH_KEY = 'glowops.refreshToken';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,
  setSession: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
    set({ user, accessToken });
  },
  setUser: (user) => set({ user }),
  clearSession: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    set({ user: null, accessToken: null });
  },
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    set({ accessToken, isHydrated: true });
  },
}));
