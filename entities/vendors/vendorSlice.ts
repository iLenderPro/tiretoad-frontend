import { createSlice } from '@reduxjs/toolkit';
import { PlaceDto } from '@/entities/vendors/api/dto/placeDto';

export const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {} as PlaceDto[],
  reducers: (create) => ({
    setPlacesWithinRadius: create.reducer<PlaceDto[]>((state, action) => {
      return [...action.payload];
    }),
  }),
  selectors: { selectPlacesWithinRadius: (state) => state },
});

export const { setPlacesWithinRadius } = vendorSlice.actions;
export const { selectPlacesWithinRadius } = vendorSlice.selectors;
