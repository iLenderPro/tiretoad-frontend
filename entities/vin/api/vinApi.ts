import { baseApi } from '@/shared/api';
import { VehicleDto } from '@/entities/vin/api/dto';
import { MakeDto, ModelDto } from '@/entities/tires/api/dto';

export const vinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    decode: build.query<VehicleDto, string>({
      query: (vin) => ({
        url: `/vin/decode/${vin}`,
      }),
      transformResponse: (response: VehicleDto) => response,
      providesTags: ['VIN'],
    }),
    getMakes: build.query<MakeDto[], void>({
      query: () => ({
        url: `/vin/makes`,
      }),
      transformResponse: (response: MakeDto[]) => response,
    }),
    getModels: build.query<ModelDto[], { yearId: string; makeId: string }>({
      query: ({ yearId, makeId }) => ({
        url: `/vin/models/${yearId}/${makeId}`,
      }),
      transformResponse: (response: ModelDto[]) => response,
    }),
  }),
});

export const { useLazyDecodeQuery, useLazyGetMakesQuery, useLazyGetModelsQuery } = vinApi;
