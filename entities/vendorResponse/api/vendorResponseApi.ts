import { baseApi } from '@/shared/api';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { VENDOR_RESPONSE } from '@/shared/api/tags';

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
      providesTags: [VENDOR_RESPONSE],
    }),
    updateVendorResponse: build.mutation<VendorResponseDto, Partial<VendorResponseDto>>({
      query: (vendorResponseDto) => {
        return {
          url: `vendor-responses/${vendorResponseDto.id}`,
          method: 'POST',
          body: vendorResponseDto,
        };
      },
      invalidatesTags: [VENDOR_RESPONSE],
    }),
  }),
});

export const { useGetVendorResponsesQuery, useGetVendorResponseQuery, useUpdateVendorResponseMutation } = vendorResponseApi;
