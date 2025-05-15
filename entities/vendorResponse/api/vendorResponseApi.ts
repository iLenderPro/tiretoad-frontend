import { baseApi } from '@/shared/api';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { SERVICE_REQUEST, VENDOR_RESPONSE } from '@/shared/api/tags';

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
          method: 'PUT',
          body: vendorResponseDto,
        };
      },
      invalidatesTags: [VENDOR_RESPONSE, SERVICE_REQUEST],
    }),
    selectForJob: build.mutation<VendorResponseDto, Partial<VendorResponseDto>>({
      query: (vendorResponseDto) => {
        return {
          url: `vendor-responses/${vendorResponseDto.id}/select`,
          method: 'PUT',
          body: vendorResponseDto,
        };
      },
      invalidatesTags: [VENDOR_RESPONSE, SERVICE_REQUEST],
    }),
    submitQuote: build.mutation<VendorResponseDto, Partial<VendorResponseDto>>({
      query: (vendorResponseDto) => {
        return {
          url: `vendor-responses/${vendorResponseDto.id}/submit-quote`,
          method: 'PUT',
          body: vendorResponseDto,
        };
      },
      invalidatesTags: [VENDOR_RESPONSE, SERVICE_REQUEST],
    }),
    submitPrice: build.mutation<VendorResponseDto, Partial<VendorResponseDto>>({
      query: (vendorResponseDto) => {
        return {
          url: `vendor-responses/${vendorResponseDto.id}/submit-price`,
          method: 'PUT',
          body: vendorResponseDto,
        };
      },
      invalidatesTags: [VENDOR_RESPONSE, SERVICE_REQUEST],
    }),
  }),
});

export const { useGetVendorResponsesQuery, useGetVendorResponseQuery, useSelectForJobMutation, useSubmitQuoteMutation, useSubmitPriceMutation } = vendorResponseApi;
