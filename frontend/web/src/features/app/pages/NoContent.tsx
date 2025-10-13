import { ErrorIcon } from '@/assets/icons/Error';
import * as React from 'react';

interface NoContentProps extends React.HTMLAttributes<HTMLElement> {
  message?: React.ReactNode;
  icon?: React.ReactNode;
}

export const NoContent: React.FC<NoContentProps> = ({ message, icon }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center gap-5">
      {icon || <ErrorIcon className="w-15 h-15" />}
      <p>{message || 'No content found'}</p>
    </div>
  );
};
