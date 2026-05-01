import { View } from 'react-native';
import { Image } from 'expo-image';
import type { Photo } from '@/types';
import { radius, spacing } from '@/theme';

export type PhotoGridProps = {
  photos: Photo[];
  columns?: number;
};

export function PhotoGrid({ photos, columns = 3 }: PhotoGridProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {photos.map((p) => (
        <View
          key={p.photoId}
          style={{
            width: `${100 / columns - 2}%`,
            aspectRatio: 1,
            borderRadius: radius.md,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: p.uri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      ))}
    </View>
  );
}
