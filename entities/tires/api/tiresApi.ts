import { baseApi } from '@/shared/api';
import { MakeDto } from '@/entities/tires/api/dto/makeDto';
import { ModelDto } from '@/entities/tires/api/dto/modelDto';
import { TireDto } from '@/entities/tires/api/dto/tireDto';

export const tiresApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMakes: build.query<MakeDto[], void>({
      query: () => ({
        url: `/makes`,
      }),
      transformResponse: (response: MakeDto[]) => response,
    }),
    getModels: build.query<ModelDto[], { yearId: number; makeId: string }>({
      query: ({ yearId, makeId }) => ({
        url: `/models/${yearId}/${makeId}`,
      }),
      transformResponse: (response: ModelDto[]) => response,
    }),
    getTrims: build.query<ModelDto[], { yearId: number; makeId: string; modelId: string }>({
      query: ({ makeId, yearId, modelId }) => ({
        url: `/trims/${yearId}/${makeId}/${modelId}`,
      }),
      transformResponse: (response: ModelDto[]) => response,
    }),
    getTires: build.query<TireDto[], { yearId: number; makeId: string; modelId: string; trimId: string }>({
      query: ({ makeId, yearId, modelId, trimId }) => ({
        url: `/tires/${yearId}/${makeId}/${modelId}/${trimId}`,
      }),
      transformResponse: (response: TireDto[]) => response,
    }),
  }),
});

export const { useGetMakesQuery, useGetModelsQuery, useGetTrimsQuery, useGetTiresQuery } = tiresApi;
