import { Emblem } from '@/components/ui';
import { X } from 'lucide-react';
import * as React from 'react';

export const Forbidden: React.FC = () => {
  return (
    <main className="flex items-center justify-center min-h-[85dvh]">
      <div className="flex flex-col justify-center items-center gap-5">
        <Emblem color="#ee384d" className="w-30 h-30">
          <X className="w-15 h-15" />
        </Emblem>
        <h1 className="text-3xl font-semibold">Access Denied</h1>
        <p>You have no privilege to access this page</p>
      </div>
    </main>
  );
};
