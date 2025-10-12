import { Spinner } from '@/assets/animations/Spinner';
import * as React from 'react';

interface LoaderProps {
  message?: string;
  full?: boolean;
  icon?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({
  message,
  icon,
  full = true,
}) => {
  const Icon = icon;
  return (
    <main
      role="status"
      className="flex items-center justify-center p-5"
      style={{
        height: full ? '100dvh' : '85dvh',
      }}
    >
      <div className="flex flex-col items-center justify-center gap-5">
        {Icon || <Spinner className="w-10 h-10" />}
        <span aria-live="polite" className="text-[15px]">
          {message ? `${message}…` : 'One moment please…'}
        </span>
      </div>
    </main>
  );
};
