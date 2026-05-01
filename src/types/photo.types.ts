import type { IsoDate } from './api.types';
import type { UserId } from './user.types';

export type PhotoId = string & { __brand: 'PhotoId' };
export const photoId = (s: string): PhotoId => s as PhotoId;

export type PhotoKind =
  | 'selfie_front'
  | 'selfie_side'
  | 'full_body'
  | 'beard_hair'
  | 'dating_profile';

export type Photo = {
  photoId: PhotoId;
  userId: UserId;
  kind: PhotoKind;
  uri: string;
  uploadedAt: IsoDate | null;
  width: number;
  height: number;
  sizeBytes: number;
};

export type UploadPhotoRequest = {
  kind: PhotoKind;
  localUri: string;
  width: number;
  height: number;
  sizeBytes: number;
};

export type UploadPhotoResponse = {
  photo: Photo;
};
