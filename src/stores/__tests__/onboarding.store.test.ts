import { useOnboardingStore } from '@/stores/onboarding.store';
import { photoId } from '@/types/photo.types';

describe('onboarding store', () => {
  beforeEach(() => {
    useOnboardingStore.setState({ step: 'welcome', uploadedPhotoIds: [] });
  });

  it('tracks the active onboarding step', () => {
    useOnboardingStore.getState().setStep('photos');

    expect(useOnboardingStore.getState().step).toBe('photos');
  });

  it('appends uploaded photo ids in order', () => {
    useOnboardingStore.getState().addPhotoId(photoId('pho_1'));
    useOnboardingStore.getState().addPhotoId(photoId('pho_2'));

    expect(useOnboardingStore.getState().uploadedPhotoIds).toEqual([
      photoId('pho_1'),
      photoId('pho_2'),
    ]);
  });

  it('resets onboarding state', () => {
    useOnboardingStore.setState({ step: 'audit', uploadedPhotoIds: [photoId('pho_1')] });

    useOnboardingStore.getState().reset();

    expect(useOnboardingStore.getState()).toMatchObject({
      step: 'welcome',
      uploadedPhotoIds: [],
    });
  });
});
