import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const awsApi = createApi({
  reducerPath: 'aws',
  baseQuery: fetchBaseQuery(),
  endpoints: () => ({}),
});
