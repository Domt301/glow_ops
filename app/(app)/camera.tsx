import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, Columns2, ImagePlus } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Screen } from '@/components/primitives/Screen';
import { Stack } from '@/components/primitives/Stack';
import { Row } from '@/components/primitives/Row';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/components/primitives/Card';
import { useUploadPhoto } from '@/hooks/mutations/useUploadPhoto';
import { useUiStore } from '@/stores/ui.store';
import { colors } from '@/theme';
import type { PhotoKind } from '@/types';

type Option = {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
};

export default function CameraScreen() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const upload = useUploadPhoto();

  const uploadAsset = async (asset: ImagePicker.ImagePickerAsset, kind: PhotoKind) => {
    return new Promise<void>((resolve) => {
      upload.mutate(
        {
          kind,
          localUri: asset.uri,
          width: asset.width,
          height: asset.height,
          sizeBytes: asset.fileSize ?? 0,
        },
        {
          onSuccess: () => {
            showToast({ message: 'Uploaded.', tone: 'success' });
            resolve();
          },
          onError: (e) => {
            showToast({ message: e.message, tone: 'error' });
            resolve();
          },
        },
      );
    });
  };

  const handleProgressPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      showToast({ message: 'Camera access is required.', tone: 'error' });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled) return;
    await uploadAsset(result.assets[0], 'selfie_front');
  };

  const handleDatingPhotos = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showToast({ message: 'Photo library access is required.', tone: 'error' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.8,
    });
    if (result.canceled) return;
    for (const asset of result.assets) {
      await uploadAsset(asset, 'dating_profile');
    }
  };

  const options: Option[] = [
    {
      icon: CameraIcon,
      title: 'Take progress photo',
      description: 'Same lighting and angle as your baseline.',
      onPress: handleProgressPhoto,
    },
    {
      icon: ImagePlus,
      title: 'Upload dating profile photos',
      description: 'Pick up to 6. We’ll review them in your audit.',
      onPress: handleDatingPhotos,
    },
    {
      icon: Columns2,
      title: 'Compare before / after',
      description: 'See how your baseline shifted.',
      onPress: () => router.push('/compare'),
    },
  ];

  return (
    <Screen scrollable>
      <Stack gap="lg">
        <Text variant="h2" color="platinum">
          Camera
        </Text>
        <Stack gap="md">
          {options.map((o) => {
            const Icon = o.icon;
            return (
              <Card key={o.title} onPress={o.onPress}>
                <Row gap="base" align="center">
                  <Icon size={28} color={colors.electricBlue} />
                  <Stack gap="xs" flex={1}>
                    <Text variant="bodyMedium" color="platinum">
                      {o.title}
                    </Text>
                    <Text variant="caption" color="steel">
                      {o.description}
                    </Text>
                  </Stack>
                </Row>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Screen>
  );
}
