import { baseApi } from '@/shared/api';
import { LocationDto } from '@/entities/geo/api/dto/LocationDto';
import { setLocation } from '@/entities/geo/geoSlice';

export const geoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<LocationDto, void>({
      query: () => ({
        url: `/geo/location`,
      }),
      transformResponse: (response: LocationDto) => response,
      async onCacheEntryAdded(params, { dispatch, cacheDataLoaded }) {
        const { data } = await cacheDataLoaded;
        dispatch(setLocation(data));
      },
    }),
  }),
});

export const { useGetLocationQuery } = geoApi;
