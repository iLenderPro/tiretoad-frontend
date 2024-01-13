import { baseApi } from '@/shared/api';
import { UserDto } from '@/entities/user/api/dto/UserDto';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';

export const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useRegisterUserMutation, useVerifyUserMutation } = accountApi;
