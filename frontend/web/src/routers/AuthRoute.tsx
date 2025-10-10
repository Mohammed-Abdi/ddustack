import type { RootState } from '@/store/store';
import type React from 'react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface AuthRouteProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);

  if (accessToken && user) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AuthRoute;
