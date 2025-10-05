import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import * as React from 'react';

interface EmblemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  color?: string;
  text?: string;
  className?: string;
}

const Emblem: React.FC<EmblemProps> = ({
  children,
  className = '',
  color = '#ee384d',
  text = '#ffffff',
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'flex items-center justify-center w-20 h-20 rounded-full outline-8',
        className
      )}
      style={{
        backgroundColor: color,
        outlineColor: color + '35',
        color: text,
      }}
    >
      {children}
    </div>
  );
};

export default Emblem;
