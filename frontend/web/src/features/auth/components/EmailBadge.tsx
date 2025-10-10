import { UserCircle } from 'lucide-react';
import * as React from 'react';

interface EmailBadgeProps extends React.HTMLAttributes<HTMLElement> {
  email: string;
  className?: string;
}

export const EmailBadge: React.FC<EmailBadgeProps> = ({
  email,
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={`flex items-center gap-2.5 w-fit p-2 mx-auto outline outline-[var(--color-border)] rounded-full ${className.trim()}`}
    >
      <UserCircle className="w-5 h-5" />{' '}
      <span className="text-sm font-medium">{email}</span>
    </div>
  );
};
