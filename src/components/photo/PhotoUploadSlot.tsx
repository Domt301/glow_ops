import { ActivityIndicator, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import type { Photo, PhotoKind } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { Stack } from '@/components/primitives/Stack';
import { Text } from '@/components/primitives/Text';

export type PhotoUploadSlotProps = {
  kind: PhotoKind;
  photo?: Photo;
  onPick: () => void;
  uploading?: boolean;
};

const KIND_LABELS: Record<PhotoKind, string> = {
  selfie_front: 'Front selfie',
  selfie_side: 'Side profile',
  full_body: 'Full body',
  beard_hair: 'Beard / hair',
  dating_profile: 'Dating profile',
};

export function PhotoUploadSlot({ kind, photo, onPick, uploading }: PhotoUploadSlotProps) {
  return (
    <Pressable
      onPress={onPick}
      style={({ pressed }) => ({
        flex: 1,
        aspectRatio: 1,
        backgroundColor: colors.gunmetal,
        borderRadius: radius.lg,
        borderWidth: photo ? 0 : 1,
        borderStyle: 'dashed',
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {photo ? (
        <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : (
        <Stack gap="sm" align="center">
          <Camera size={28} color={colors.steel} />
          <Text variant="caption" color="steel">
            {KIND_LABELS[kind]}
          </Text>
        </Stack>
      )}
      {uploading ? (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.sm,
          }}
        >
          <ActivityIndicator color={colors.electricBlue} />
        </View>
      ) : null}
    </Pressable>
  );
}
