import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/stores/auth.store';
import { MOCK_USER } from '@/mocks/users.mock';

const resetSecureStore = SecureStore as typeof SecureStore & { __reset: () => void };

describe('auth store', () => {
  beforeEach(() => {
    resetSecureStore.__reset();
    useAuthStore.setState({ user: null, accessToken: null, isHydrated: false });
    jest.clearAllMocks();
  });

  it('persists tokens and stores the active session', async () => {
    await useAuthStore
      .getState()
      .setSession(MOCK_USER, 'access-token', 'refresh-token');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('glowops.accessToken', 'access-token');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('glowops.refreshToken', 'refresh-token');
    expect(useAuthStore.getState()).toMatchObject({
      user: MOCK_USER,
      accessToken: 'access-token',
    });
  });

  it('hydrates the access token from secure storage', async () => {
    await SecureStore.setItemAsync('glowops.accessToken', 'stored-access-token');

    await useAuthStore.getState().hydrate();

    expect(useAuthStore.getState()).toMatchObject({
      accessToken: 'stored-access-token',
      isHydrated: true,
    });
  });

  it('clears tokens and active user on sign out', async () => {
    await useAuthStore
      .getState()
      .setSession(MOCK_USER, 'access-token', 'refresh-token');

    await useAuthStore.getState().clearSession();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('glowops.accessToken');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('glowops.refreshToken');
    expect(useAuthStore.getState()).toMatchObject({ user: null, accessToken: null });
  });

  it('updates only the user object', () => {
    useAuthStore.setState({ user: MOCK_USER, accessToken: 'access-token', isHydrated: true });

    useAuthStore.getState().setUser({ ...MOCK_USER, displayName: 'Taylor' });

    expect(useAuthStore.getState()).toMatchObject({
      user: { displayName: 'Taylor' },
      accessToken: 'access-token',
      isHydrated: true,
    });
  });
});
