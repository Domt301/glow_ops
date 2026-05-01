import { create } from 'zustand';
import type { PhotoId } from '@/types';

export type OnboardingStep = 'welcome' | 'age_gate' | 'safety' | 'photos' | 'audit' | 'done';

type OnboardingState = {
  step: OnboardingStep;
  uploadedPhotoIds: PhotoId[];
  setStep: (step: OnboardingStep) => void;
  addPhotoId: (id: PhotoId) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 'welcome',
  uploadedPhotoIds: [],
  setStep: (step) => set({ step }),
  addPhotoId: (id) => set((s) => ({ uploadedPhotoIds: [...s.uploadedPhotoIds, id] })),
  reset: () => set({ step: 'welcome', uploadedPhotoIds: [] }),
}));
