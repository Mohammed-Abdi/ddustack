import { cn } from '@/lib/utils';
import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  color?: string;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  color,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn('py-1 px-2 w-fit rounded-sm text-xs', className.trim())}
      style={{
        background: color,
      }}
    >
      {children}
    </div>
  );
};
