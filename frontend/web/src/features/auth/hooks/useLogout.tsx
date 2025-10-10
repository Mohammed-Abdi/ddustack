import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useLogoutMutation } from '../api/authApi';
import { logout as logoutAction } from '../slices/authSlice';

export const useLogout = () => {
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading, error }] = useLogoutMutation();

  const logout = React.useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
    } catch {
      toast.error('Logout failed');
    }
  }, [dispatch, logoutMutation]);

  return { logout, isLoading, error };
};
