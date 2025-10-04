import { Spinner } from '@/assets/animations/Spinner';
import type React from 'react';

interface LoaderProps {
  message?: string;
  full?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message, full = true }) => {
  return (
    <main
      role="status"
      className="flex items-center justify-center p-5"
      style={{
        height: full ? '100dvh' : '',
      }}
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <Spinner className="w-10 h-10" />
        <span aria-live="polite">
          {message ? `${message}…` : 'One moment please…'}
        </span>
      </div>
    </main>
  );
};

export default Loader;
