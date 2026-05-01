import { useMutation } from '@tanstack/react-query';
import { photoService } from '@/services';
import type { UploadPhotoRequest, UploadPhotoResponse } from '@/types';

export function useUploadPhoto() {
  return useMutation<UploadPhotoResponse, Error, UploadPhotoRequest>({
    mutationFn: async (req) => {
      const result = await photoService.uploadPhoto(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
