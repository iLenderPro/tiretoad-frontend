import { baseApi } from '@/shared/api';
import { PlaceDto } from '@/entities/vendors/api/dto/placeDto';

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPlaces: build.query<PlaceDto[], void>({
      query: () => ({
        url: `/places`,
      }),
      transformResponse: (response: PlaceDto[]) => response,
    }),
  }),
});

export const { useGetPlacesQuery } = vendorApi;
