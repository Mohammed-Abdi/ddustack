import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../api/interfaces';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isInitializing = false;
    },
    startInitializing: (state) => {
      state.isInitializing = true;
    },
    stopInitializing: (state) => {
      state.isInitializing = false;
    },
  },
});

export const {
  setAccess,
  setUser,
  updateUser,
  logout,
  startInitializing,
  stopInitializing,
} = authSlice.actions;

export default authSlice.reducer;
