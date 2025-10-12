import type React from 'react';
import type { ReactNode } from 'react';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      {...props}
      className={`text-[8px] py-0.75 px-1.5 rounded-full font-bold bg-[var(--color-primary-muted)] text-[var(--color-text-inverse)] cursor-help ${className.trim()}`}
    >
      {children}
    </span>
  );
};
