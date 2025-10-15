import { Incognito } from '@/assets/icons/User';
import { Verified } from '@/assets/icons/Verified';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import type { User } from '@/features/auth';
import { cn } from '@/lib/utils';
import { normalizeCapitalization } from '@/utils/format';
import * as React from 'react';

interface CreditProps extends React.HTMLAttributes<HTMLElement> {
  user: Partial<User> | null;
  label: string;
  className?: string;
}

export const Credit: React.FC<CreditProps> = ({
  user,
  className = '',
  label,
  ...props
}) => {
  return (
    <div {...props} className={cn('flex flex-col gap-2', className.trim())}>
      <span className="text-xs opacity-70">{label}</span>
      <div className="flex items-center gap-2">
        {user ? (
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback className="w-7 h-7">
              <img
                src="/illustrations/pfp-fallback.webp"
                alt="default profile picture"
                className="w-full h-full"
              />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center justify-center bg-[#303030] text-white w-7 h-7 rounded-full">
            <Incognito className="w-4 h-4" />
          </div>
        )}
        <article className="flex flex-col">
          <div className="flex items-center gap-1">
            {user ? (
              <p className="text-[0.9375rem] font-medium">
                {normalizeCapitalization(user?.first_name || '')}{' '}
                {normalizeCapitalization(user?.last_name || '')}
              </p>
            ) : (
              <p className="text-[0.9375rem] font-medium">Anonymous user</p>
            )}
            {user?.is_verified && (
              <Verified className="w-3 h-3 text-[var(--color-info)]" />
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
