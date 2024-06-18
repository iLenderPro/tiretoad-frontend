import { baseApi } from '@/shared/api';
import { UploadDto } from '@/entities/file/api/dto/UploadDto';
import { FileDto } from '@/entities/file/api/dto/FileDto';
import { awsApi } from '@/shared/api/awsApi';

export const fileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUploadUrl: build.query<{ url: string; key: string }, UploadDto>({
      query: (dto) => {
        return {
          url: `/files/upload`,
          method: 'GET',
          params: dto,
        };
      },
    }),
  }),
});

export const uploadApi = awsApi.injectEndpoints({
  endpoints: (build) => ({
    upload: build.mutation<void, FileDto>({
      query: (dto) => {
        return {
          url: dto.url,
          method: 'PUT',
          body: dto.file,
          headers: { 'Content-Type': dto.file.type, 'Content-Disposition': 'inline' },
        };
      },
    }),
  }),
});

export const { useLazyGetUploadUrlQuery } = fileApi;
export const { useUploadMutation } = uploadApi;
