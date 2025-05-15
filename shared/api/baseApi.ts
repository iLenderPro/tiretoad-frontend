import { createApi } from '@reduxjs/toolkit/query/react';
import { AUTH_TAG, SERVICE_REQUEST, VENDOR_RESPONSE } from '@/shared/api/tags';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReAuth';

export const baseApi = createApi({
  tagTypes: [AUTH_TAG, SERVICE_REQUEST, VENDOR_RESPONSE],
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
