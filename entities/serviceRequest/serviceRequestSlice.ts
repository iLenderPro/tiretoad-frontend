import { createSlice } from '@reduxjs/toolkit';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState: { serviceRequest: {} as ServiceRequestDto, isUpdating: false },
  reducers: (create) => ({
    setServiceRequest: create.reducer<Partial<ServiceRequestDto>>((state, action) => {
      return { ...state, serviceRequest: { ...state.serviceRequest, ...action.payload } };
    }),
    setServiceRequestUpdating: create.reducer<Partial<boolean>>((state, action) => {
      return { ...state, isUpdating: action.payload };
    }),
  }),
  selectors: {
    selectServiceRequest: (state) => state.serviceRequest,
    isServiceRequestUpdating: (state) => state.isUpdating,
  },
});

export const { setServiceRequest, setServiceRequestUpdating } = serviceRequestSlice.actions;
export const { selectServiceRequest, isServiceRequestUpdating } = serviceRequestSlice.selectors;
