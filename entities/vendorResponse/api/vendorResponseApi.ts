import { baseApi } from '@/shared/api';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';

export const vendorResponseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVendorResponses: build.query<VendorResponseDto[], void>({
      query: () => {
        return {
          url: 'vendor-responses',
        };
      },
    }),
    getVendorResponse: build.query<VendorResponseDto, string>({
      query: (id) => {
        return {
          url: `vendor-responses/${id}`,
        };
      },
    }),
  }),
});

export const { useGetVendorResponsesQuery, useGetVendorResponseQuery } = vendorResponseApi;
