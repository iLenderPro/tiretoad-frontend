import { baseApi } from '@/shared/api';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { AuthDto } from '@/entities/account/authSlice';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';

export const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserSession: build.query<ClientDto, void>({
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
    logout: build.mutation({
      query: () => {
        return {
          url: `auth/logout`,
          method: 'POST',
        };
      },
    }),
    registerUser: build.mutation<ClientDto, ClientDto>({
      query: (dto) => {
        return {
          url: `users/register`,
          method: 'POST',
          body: dto,
        };
      },
    }),
    registerVendor: build.mutation<VendorDto, VendorDto>({
      query: (dto) => {
        return {
          url: `vendors/register`,
          method: 'POST',
          body: dto,
        };
      },
    }),
    verifyUser: build.mutation<ClientDto | VendorDto, AccountDto['verification']>({
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

export const { useRegisterUserMutation, useRegisterVendorMutation, useVerifyUserMutation, useLoginUserMutation, useLogoutMutation, useGetUserSessionQuery } = accountApi;
