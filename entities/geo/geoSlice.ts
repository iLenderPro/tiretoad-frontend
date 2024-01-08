import { createSlice } from '@reduxjs/toolkit';
import { LocationDto } from '@/entities/geo/api/dto/LocationDto';

export const geoSlice = createSlice({
  name: 'geo',
  initialState: {} as LocationDto,
  reducers: (create) => ({
    setLocation: create.reducer<LocationDto>((state, action) => {
      return { ...action.payload };
    }),
  }),
  selectors: { selectLocation: (state) => state },
});

export const { setLocation } = geoSlice.actions;
export const { selectLocation } = geoSlice.selectors;
