import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLazyMeQuery,
  useRefreshTokenMutation,
} from './features/auth/api/authApi';
import {
  setAccess,
  setUser,
  stopInitializing,
} from './features/auth/slices/authSlice';
import Router from './routers/Router';
import type { AppDispatch, RootState } from './store/store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshToken] = useRefreshTokenMutation();
  const [fetchProfile] = useLazyMeQuery();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  React.useLayoutEffect(() => {
    if (accessToken) return;
    const initAuth = async () => {
      try {
        const res = await refreshToken().unwrap();
        dispatch(setAccess(res.access_token));
        const profile = await fetchProfile().unwrap();
        dispatch(setUser(profile));
      } catch {
        console.warn('failed to refresh');
      } finally {
        dispatch(stopInitializing());
      }
    };

    initAuth();
  }, [dispatch, refreshToken, fetchProfile, accessToken]);
  return <Router />;
};

export default App;
