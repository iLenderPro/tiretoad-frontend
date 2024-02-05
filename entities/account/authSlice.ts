import { createSlice } from '@reduxjs/toolkit';
import { UserDto } from '@/entities/user/api/dto/UserDto';

export type AuthDto = {
  user?: UserDto;
  authToken?: string | null;
};

const initialState: AuthDto = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    setUserSession: create.reducer<AuthDto>((state, action) => ({ ...state, ...action.payload })),
  }),
  selectors: { selectUserSession: (state) => state },
});

export const { setUserSession } = authSlice.actions;
export const { selectUserSession } = authSlice.selectors;
