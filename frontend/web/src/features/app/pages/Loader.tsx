import { Spinner } from '@/assets/animations/Spinner';
import * as React from 'react';

interface LoaderProps {
  message?: string;
  icon?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({ message, icon }) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center gap-5 absolute top-1/2 left-1/2 -translate-1/2">
      {Icon || <Spinner className="w-10 h-10" />}
      <span aria-live="polite" className="text-[15px]">
        {message ? `${message}…` : 'One moment please…'}
      </span>
    </div>
  );
};
