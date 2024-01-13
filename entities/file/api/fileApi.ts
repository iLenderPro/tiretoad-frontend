import { baseApi } from '@/shared/api';
import { FileDto } from './dto/FileDto';

export const fileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<{ key: string }, FileDto>({
      query: (dto) => {
        const formData = new FormData();
        formData.append('file', dto.file);
        return {
          url: `/files`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = fileApi;
