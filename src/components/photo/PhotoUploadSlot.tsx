import { ActivityIndicator, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import type { Photo, PhotoKind } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { CornerFrame } from '@/components/primitives/CornerFrame';

export type PhotoUploadSlotProps = {
  kind: PhotoKind;
  photo?: Photo;
  onPick: () => void;
  uploading?: boolean;
};

const KIND_LABELS: Record<PhotoKind, string> = {
  selfie_front: 'Front',
  selfie_side: 'Side',
  full_body: 'Body',
  beard_hair: 'Beard / Hair',
  dating_profile: 'Dating',
};

export function PhotoUploadSlot({ kind, photo, onPick, uploading }: PhotoUploadSlotProps) {
  const captured = !!photo;
  const bracketColor = captured ? colors.accent : colors.steelDim;

  return (
    <Pressable
      onPress={onPick}
      style={({ pressed }) => ({
        flex: 1,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <CornerFrame size={18} thickness={2} color={bracketColor} inset={0}>
        <View
          style={{
            aspectRatio: 1,
            backgroundColor: colors.slate,
            borderRadius: radius.md,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {captured ? (
            <Image
              source={{ uri: photo.uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <Stack gap="sm" align="center">
              <Plus size={22} color={colors.steel} strokeWidth={2} />
              <Eyebrow color="steel">{KIND_LABELS[kind]}</Eyebrow>
            </Stack>
          )}
          {uploading ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.overlay,
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing.sm,
              }}
            >
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : null}
        </View>
      </CornerFrame>
    </Pressable>
  );
}
