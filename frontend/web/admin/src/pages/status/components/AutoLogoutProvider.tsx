import { logout } from '@/features/auth/authSlice';
import type { AppDispatch } from '@/store/store';
import type { ReactNode } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';

interface AutoLogoutProviderProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

const LOGOUT_KEY = 'notAllowedLogoutTime';
const COUNTDOWN_SECONDS = 45;

const AutoLogoutProvider: React.FC<AutoLogoutProviderProps> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [secondsLeft, setSecondsLeft] = React.useState(COUNTDOWN_SECONDS);

  React.useLayoutEffect(() => {
    const storedTime = localStorage.getItem(LOGOUT_KEY);
    const now = Date.now();
    const logoutTime = storedTime
      ? parseInt(storedTime, 10)
      : now + COUNTDOWN_SECONDS * 1000;

    if (!storedTime) localStorage.setItem(LOGOUT_KEY, logoutTime.toString());

    const updateTimer = () => {
      const diff = Math.max(0, Math.ceil((logoutTime - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) {
        dispatch(logout());
        localStorage.removeItem(LOGOUT_KEY);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <>
      {children}
      <div className="flex flex-wrap absolute bottom-5 font-medium text-[15px] text-[var(--color-text-muted)]">
        You’ll be logged out in{' '}
        <div className="w-6 text-center text-[var(--color-text-primary)]">
          {secondsLeft < 10 && 0}
          {secondsLeft}
        </div>{' '}
        second{secondsLeft !== 1 ? 's' : ''}
      </div>
    </>
  );
};

export default AutoLogoutProvider;
