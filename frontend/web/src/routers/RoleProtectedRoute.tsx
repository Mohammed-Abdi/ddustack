import type { Role } from '@/features/auth';
import type { RootState } from '@/store/store';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [checked, setChecked] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!user || checked) return;

    if (!allowedRoles.includes(user.role)) {
      toast.warning('Access Denied', {
        description: 'You have no privilege to access the requested page',
      });
      navigate('/for-you', { replace: true });
    }

    setChecked(true);
  }, [user, allowedRoles, navigate, checked]);

  if (!user) return null;

  return <>{children}</>;
};

export default RoleProtectedRoute;
