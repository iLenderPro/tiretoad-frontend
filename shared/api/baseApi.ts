import { createApi } from '@reduxjs/toolkit/query/react';
import { AUTH_TAG } from '@/shared/api/tags';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReAuth';

export const baseApi = createApi({
  tagTypes: [AUTH_TAG],
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
