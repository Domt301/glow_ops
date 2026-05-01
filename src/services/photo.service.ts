import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import { generateId } from '@/utils/id';
import { photoId } from '@/types/photo.types';
import { userId as makeUserId } from '@/types/user.types';
import { MOCK_USER } from '@/mocks/users.mock';
import type {
  ApiResult,
  Photo,
  PhotoId,
  UploadPhotoRequest,
  UploadPhotoResponse,
} from '@/types';

async function _uploadPhotoMock(req: UploadPhotoRequest): Promise<ApiResult<UploadPhotoResponse>> {
  await mockDelay();
  const photo: Photo = {
    photoId: photoId(generateId('pho')),
    userId: makeUserId(MOCK_USER.userId),
    kind: req.kind,
    uri: req.localUri,
    uploadedAt: new Date().toISOString(),
    width: req.width,
    height: req.height,
    sizeBytes: req.sizeBytes,
  };
  return { ok: true, data: { photo } };
}
async function _uploadPhotoReal(req: UploadPhotoRequest): Promise<ApiResult<UploadPhotoResponse>> {
  return httpClient.post<UploadPhotoResponse>('/photos', req);
}
export async function uploadPhoto(
  req: UploadPhotoRequest,
): Promise<ApiResult<UploadPhotoResponse>> {
  return env.USE_MOCKS ? _uploadPhotoMock(req) : _uploadPhotoReal(req);
}

async function _deletePhotoMock(_id: PhotoId): Promise<ApiResult<void>> {
  await mockDelay();
  return { ok: true, data: undefined };
}
async function _deletePhotoReal(id: PhotoId): Promise<ApiResult<void>> {
  return httpClient.delete<void>(`/photos/${id}`);
}
export async function deletePhoto(id: PhotoId): Promise<ApiResult<void>> {
  return env.USE_MOCKS ? _deletePhotoMock(id) : _deletePhotoReal(id);
}

async function _listUserPhotosMock(): Promise<ApiResult<Photo[]>> {
  await mockDelay();
  return { ok: true, data: [] };
}
async function _listUserPhotosReal(): Promise<ApiResult<Photo[]>> {
  return httpClient.get<Photo[]>('/photos');
}
export async function listUserPhotos(): Promise<ApiResult<Photo[]>> {
  return env.USE_MOCKS ? _listUserPhotosMock() : _listUserPhotosReal();
}
