import { createSlice } from '@reduxjs/toolkit';

type SnackbarState = { state: boolean; type?: 'error' | 'success' | 'info' | 'warning'; content?: string };

const initialState: SnackbarState = { state: false };

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: (create) => ({
    showSnackbar: create.reducer<Omit<SnackbarState, 'state'>>((state, action) => ({
      state: true,
      type: action.payload.type,
      content: action.payload.content,
    })),
    hideSnackbar: create.reducer((state, action) => ({
      state: false,
      type: undefined,
      content: undefined,
    })),
  }),
  selectors: { selectSnackbarState: (state) => state },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export const { selectSnackbarState } = snackbarSlice.selectors;
