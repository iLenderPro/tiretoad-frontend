import { baseApi } from '@/shared/api';
import { VehicleDto } from '@/entities/vin/api/dto';

export const vinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    decode: build.query<VehicleDto, string>({
      query: (vin) => ({
        url: `/decode/${vin}`,
      }),
      transformResponse: (response: VehicleDto) => response,
    }),
  }),
});

export const { useLazyDecodeQuery } = vinApi;
