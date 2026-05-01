import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import type { Photo, PhotoKind } from '@/types';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Stat } from '@/components/primitives/Stat';
import { Button } from '@/components/primitives/Button';
import { PhotoUploadSlot } from '@/components/photo/PhotoUploadSlot';
import { useUploadPhoto } from '@/hooks/mutations/useUploadPhoto';
import { useStartScan } from '@/hooks/mutations/useStartScan';
import { useOnboardingStore } from '@/stores/onboarding.store';
import { useUiStore } from '@/stores/ui.store';
import { analyticsService } from '@/services';

const SLOTS: PhotoKind[] = ['selfie_front', 'selfie_side', 'full_body', 'beard_hair'];
const REQUIRED = 3;

export default function PhotoUploadScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const addPhotoId = useOnboardingStore((s) => s.addPhotoId);
  const uploadedPhotoIds = useOnboardingStore((s) => s.uploadedPhotoIds);
  const upload = useUploadPhoto();
  const startScan = useStartScan();
  const [photos, setPhotos] = useState<Partial<Record<PhotoKind, Photo>>>({});
  const [activeKind, setActiveKind] = useState<PhotoKind | null>(null);

  const handlePick = async (kind: PhotoKind) => {
    analyticsService.track('photo_picked', { kind });
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showToast({ message: 'Photo library access is required.', tone: 'error' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];

    setActiveKind(kind);
    upload.mutate(
      {
        kind,
        localUri: asset.uri,
        width: asset.width,
        height: asset.height,
        sizeBytes: asset.fileSize ?? 0,
      },
      {
        onSuccess: (data) => {
          setPhotos((prev) => ({ ...prev, [kind]: data.photo }));
          addPhotoId(data.photo.photoId);
          analyticsService.track('photo_uploaded', { kind });
          setActiveKind(null);
        },
        onError: (e) => {
          showToast({ message: e.message, tone: 'error' });
          setActiveKind(null);
        },
      },
    );
  };

  const handleContinue = () => {
    startScan.mutate(
      { photoIds: uploadedPhotoIds },
      {
        onSuccess: (data) => {
          analyticsService.track('scan_created', { scanId: data.scan.scanId });
          router.push({
            pathname: '/(onboarding)/audit-loading',
            params: { scanId: data.scan.scanId },
          });
        },
        onError: (e) => showToast({ message: e.message, tone: 'error' }),
      },
    );
  };

  const captured = uploadedPhotoIds.length;
  const canContinue = captured >= REQUIRED;
  const counterColor = canContinue ? 'accent' : 'platinum';

  return (
    <Screen scrollable>
      <Stack gap="xl" justify="between" flex={1}>
        <Stack gap="lg">
          <Stack gap="sm">
            <Eyebrow>Step 03 / 04</Eyebrow>
            <Text variant="display" color="platinum">
              Upload photos.
            </Text>
            <Text variant="body" color="steel">
              Three minimum. They stay private.
            </Text>
          </Stack>

          <Row justify="between" align="center">
            <Stat
              value={`${captured}/${REQUIRED}`}
              label="Captured"
              size="lg"
              color={counterColor}
            />
            <Eyebrow color="steelDim">Tap a slot to upload</Eyebrow>
          </Row>

          <Stack gap="sm">
            <Row gap="sm">
              <PhotoUploadSlot
                kind={SLOTS[0]}
                photo={photos[SLOTS[0]]}
                onPick={() => handlePick(SLOTS[0])}
                uploading={upload.isPending && activeKind === SLOTS[0]}
              />
              <PhotoUploadSlot
                kind={SLOTS[1]}
                photo={photos[SLOTS[1]]}
                onPick={() => handlePick(SLOTS[1])}
                uploading={upload.isPending && activeKind === SLOTS[1]}
              />
            </Row>
            <Row gap="sm">
              <PhotoUploadSlot
                kind={SLOTS[2]}
                photo={photos[SLOTS[2]]}
                onPick={() => handlePick(SLOTS[2])}
                uploading={upload.isPending && activeKind === SLOTS[2]}
              />
              <PhotoUploadSlot
                kind={SLOTS[3]}
                photo={photos[SLOTS[3]]}
                onPick={() => handlePick(SLOTS[3])}
                uploading={upload.isPending && activeKind === SLOTS[3]}
              />
            </Row>
          </Stack>
        </Stack>

        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          loading={startScan.isPending}
          fullWidth
          size="lg"
        />
      </Stack>
    </Screen>
  );
}
