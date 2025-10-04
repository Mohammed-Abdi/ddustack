import { apiSlice } from '@/features/api/baseApi';
import appReducer from '@/features/app/appSlice';
import authReducer from '@/features/auth/authSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['app.alertDialog.action.method'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_DEV === 'true',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
