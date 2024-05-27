import { createSlice } from '@reduxjs/toolkit';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';

export type AuthDto = {
  user?: ClientDto | VendorDto | undefined;
  authToken?: string | undefined;
};

const initialState: AuthDto = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    setUserSession: create.reducer<AuthDto>((state, action) => action.payload),
  }),
  selectors: { selectUserSession: (state) => state },
});

export const { setUserSession } = authSlice.actions;
export const { selectUserSession } = authSlice.selectors;
