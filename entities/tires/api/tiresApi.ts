import { baseApi } from '@/shared/api';
import { MakeDto } from '@/entities/tires/api/dto/makeDto';
import { ModelDto } from '@/entities/tires/api/dto/modelDto';
import { TireDto } from '@/entities/tires/api/dto/tireDto';

export const tiresApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMakes: build.query<MakeDto[], { yearId: string }>({
      query: ({ yearId }) => ({
        url: `/tires/makes/${yearId}`,
      }),
      transformResponse: (response: MakeDto[]) => response,
    }),
    getModels: build.query<ModelDto[], { yearId: string; makeId: string }>({
      query: ({ yearId, makeId }) => ({
        url: `/tires/models/${yearId}/${makeId}`,
      }),
      transformResponse: (response: ModelDto[]) => response,
    }),
    getTrims: build.query<ModelDto[], { yearId: string; makeId: string; modelId: string }>({
      query: ({ makeId, yearId, modelId }) => ({
        url: `/tires/trims/${yearId}/${makeId}/${modelId}`,
      }),
      transformResponse: (response: ModelDto[]) => response,
    }),
    getTires: build.query<TireDto[], { yearId: string; makeId: string; modelId: string; trimId: string }>({
      query: ({ makeId, yearId, modelId, trimId }) => ({
        url: `/tires/tires/${yearId}/${makeId}/${modelId}/${trimId}`,
      }),
      transformResponse: (response: TireDto[]) => response,
    }),
  }),
});

export const { useLazyGetMakesQuery, useLazyGetModelsQuery, useLazyGetTrimsQuery, useLazyGetTiresQuery } = tiresApi;
