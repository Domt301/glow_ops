import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info';

export type Toast = {
  message: string;
  tone: ToastTone;
};

type UiState = {
  activeToast: Toast | null;
  showToast: (toast: Toast) => void;
  hideToast: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeToast: null,
  showToast: (toast) => set({ activeToast: toast }),
  hideToast: () => set({ activeToast: null }),
}));
