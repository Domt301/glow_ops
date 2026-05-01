import { useUiStore } from '@/stores/ui.store';

describe('ui store', () => {
  beforeEach(() => {
    useUiStore.setState({ activeToast: null });
  });

  it('shows and hides toast state', () => {
    useUiStore.getState().showToast({ message: 'Saved', tone: 'success' });

    expect(useUiStore.getState().activeToast).toEqual({ message: 'Saved', tone: 'success' });

    useUiStore.getState().hideToast();

    expect(useUiStore.getState().activeToast).toBeNull();
  });
});
