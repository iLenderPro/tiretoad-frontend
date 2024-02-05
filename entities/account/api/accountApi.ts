import { baseApi } from '@/shared/api';
import { UserDto } from '@/entities/user/api/dto/UserDto';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { AuthDto } from '@/entities/account/authSlice';

export const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserSession: build.query<UserDto, void>({
      query: () => ({
        url: `auth`,
      }),
    }),
    loginUser: build.mutation<AuthDto, AccountDto['login']>({
      query: (dto) => {
        return {
          url: `auth`,
          method: 'POST',
          body: dto,
        };
      },
    }),
    registerUser: build.mutation<UserDto, AccountDto['registration']>({
      query: (dto) => {
        return {
          url: `users/register`,
          method: 'POST',
          body: dto,
        };
      },
    }),
    verifyUser: build.mutation<UserDto, AccountDto['verification']>({
      query: (dto) => {
        return {
          url: `users/verify`,
          method: 'POST',
          body: dto,
        };
      },
    }),
  }),
});

export const { useRegisterUserMutation, useVerifyUserMutation, useLoginUserMutation, useGetUserSessionQuery } = accountApi;
