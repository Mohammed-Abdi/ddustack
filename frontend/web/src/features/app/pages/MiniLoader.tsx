import { SpinnersBarsRotateFade } from '@/assets/animations/Spinner';
import * as React from 'react';

export const MiniLoader: React.FC = () => {
  return (
    <div className="flex justify-center p-5">
      <SpinnersBarsRotateFade />
    </div>
  );
};
