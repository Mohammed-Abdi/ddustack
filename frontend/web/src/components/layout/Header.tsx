import { cn } from '@/lib/utils';
import * as React from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <header
      className={cn(
        'flex p-2.5 items-center justify-between sticky top-0 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)] z-20',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
};

export default Header;
