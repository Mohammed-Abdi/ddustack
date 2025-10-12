import { Loader } from '@/features/app';
import type { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, accessToken, isInitializing } = useSelector(
    (state: RootState) => state.auth
  );

  if (isInitializing) return <Loader />;

  if (!user && !accessToken) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
