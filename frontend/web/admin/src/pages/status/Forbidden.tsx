import { Clock } from '@/assets/icons/Clock';
import Button from '@/components/ui/Button';
import Emblem from '@/components/ui/Emblem';
import { logout } from '@/features/auth/authSlice';
import { useCheckUserMutation } from '@/features/intake/intakeApi';
import type { IntakeStatus } from '@/features/intake/interfaces';
import type { AppDispatch, RootState } from '@/store/store';
import { Check, LogOut, X } from 'lucide-react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Loader from './Loader';
import AccessRequestForm from './components/AccessRequestForm';
import AutoLogoutProvider from './components/AutoLogoutProvider';

const Forbidden: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [checkUser, { isLoading }] = useCheckUserMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [userIntake, setUserIntake] = React.useState<{
    exist: boolean;
    status: IntakeStatus | null;
  } | null>(null);

  const [showForm, setShowForm] = React.useState(false);

  const handleCheckUser = React.useCallback(async () => {
    try {
      const res = await checkUser({ user_id: user?.id as string }).unwrap();
      const newIntake = { exist: res.exist, status: res.status };
      setUserIntake(newIntake);
    } catch {
      toast.error('Failed to verify user status. Please try again.');
    }
  }, [checkUser, user?.id]);

  React.useLayoutEffect(() => {
    handleCheckUser();
  }, [handleCheckUser]);

  if (isLoading || !userIntake || !user) return <Loader />;

  const normalized = userIntake?.status?.toLowerCase();

  return (
    <main className="flex items-center justify-center min-h-[100dvh] p-5">
      {showForm ? (
        <AccessRequestForm
          handleCheckUser={handleCheckUser}
          setShowForm={setShowForm}
        />
      ) : normalized === 'pending' ? (
        <div className="flex flex-col items-center justify-center text-center gap-5 max-w-md p-5">
          <Emblem color="#fbbc05">
            <Clock className="w-15 h-15" />
          </Emblem>
          <h1 className="text-2xl font-semibold">Pending: Under Review</h1>
          <p>
            Your request is currently under review. You will be notified once
            the process is complete.
          </p>

          <Button variant="outline" onClick={() => dispatch(logout())}>
            <LogOut className="w-4.5 h-4.5" /> <span>Logout</span>
          </Button>
        </div>
      ) : normalized === 'approved' ? (
        <div className="flex flex-col items-center justify-center text-center gap-5 max-w-md p-5">
          <Emblem color="#34a853">
            <Check className="w-10 h-10" />
          </Emblem>
          <h1 className="text-2xl font-semibold">Request Approved</h1>
          <p>
            Your request has been approved. You will receive access shortly.
            This may take up to 48 hours.
          </p>

          <Button variant="outline" onClick={() => dispatch(logout())}>
            <LogOut className="w-4.5 h-4.5" /> <span>Logout</span>
          </Button>
        </div>
      ) : normalized === 'rejected' ? (
        <AutoLogoutProvider>
          <div className="flex flex-col items-center justify-center text-center gap-5 max-w-md p-5">
            <Emblem>
              <X className="w-8 h-8" />
            </Emblem>
            <h1 className="text-2xl font-semibold">Request Rejected</h1>
            <p>
              Your request was rejected. If you believe this was a mistake
              contact the administrators.
            </p>

            <Button variant="outline" onClick={() => dispatch(logout())}>
              <LogOut /> <span>Logout</span>
            </Button>
          </div>
        </AutoLogoutProvider>
      ) : (
        <AutoLogoutProvider>
          <div className="flex flex-col items-center justify-center text-center gap-5 max-w-md p-5">
            <img
              src="/illustrations/parachute.svg"
              alt="Access restricted illustration"
              className="w-60 h-60 -mt-16 translate-y-5"
            />
            <h1 className="text-2xl font-semibold">Access Restricted</h1>
            <p className="text-center max-w-md mx-auto">
              You are not eligible to access this site. If you believe you
              should have access, request permission.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Request Permission
            </Button>
          </div>
        </AutoLogoutProvider>
      )}
    </main>
  );
};

export default Forbidden;
