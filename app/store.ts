import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api';
import { geoSlice } from '@/entities/geo/geoSlice';
import { serviceRequestSlice } from '@/entities/serviceRequest/serviceRequestSlice';
import { vendorSlice } from '@/entities/vendors/vendorSlice';
import { authSlice } from '@/entities/account/authSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [geoSlice.reducerPath]: geoSlice.reducer,
    [vendorSlice.reducerPath]: vendorSlice.reducer,
    [serviceRequestSlice.reducerPath]: serviceRequestSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: true,
});

// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
