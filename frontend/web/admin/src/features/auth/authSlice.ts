import { getLocalStorageItem } from '@/utils/storage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from './interfaces';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isRefreshing: boolean;
}

const persistedUser: User | null = getLocalStorageItem<User>('user');

const initialState: AuthState = {
  accessToken: null,
  user: persistedUser,
  isRefreshing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: User | null }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isRefreshing = false;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setAccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isRefreshing = false;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isRefreshing = false;
      localStorage.removeItem('user');
    },
    startRefreshing: (state) => {
      state.isRefreshing = true;
    },
    stopRefreshing: (state) => {
      state.isRefreshing = false;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setAccess,
  logout,
  startRefreshing,
  stopRefreshing,
} = authSlice.actions;

export default authSlice.reducer;
