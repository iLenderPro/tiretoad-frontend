import { type FetchArgs, type FetchBaseQueryError, type FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { BaseQueryFn, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    // const { accessToken } = (getState() as { session: { accessToken: string } }).session;
    //
    // if (accessToken) {
    //   headers.set('Authorization', `Bearer ${accessToken}`);
    // }

    return headers;
  },
});
