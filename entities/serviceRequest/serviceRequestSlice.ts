import { createSlice } from '@reduxjs/toolkit';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState: {} as ServiceRequestDto,
  reducers: (create) => ({
    setServiceRequest: create.reducer<Partial<ServiceRequestDto>>((state, action) => {
      return { ...state, ...action.payload };
    }),
  }),
  selectors: { selectServiceRequest: (state) => state },
});

export const { setServiceRequest } = serviceRequestSlice.actions;
export const { selectServiceRequest } = serviceRequestSlice.selectors;
