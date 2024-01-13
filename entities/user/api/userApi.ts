import { baseApi } from '@/shared/api';
import { UserDto } from '@/entities/user/api/dto/UserDto';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<UserDto[], void>({
      query: () => ({
        url: `/users`,
      }),
    }),
  }),
});

export const { useGetLocationQuery } = userApi;
