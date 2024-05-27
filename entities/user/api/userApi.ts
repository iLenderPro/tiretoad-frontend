import { baseApi } from '@/shared/api';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<ClientDto[], void>({
      query: () => ({
        url: `/users`,
      }),
    }),
  }),
});

export const { useGetLocationQuery } = userApi;
