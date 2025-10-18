import { User } from '@/assets/icons/User';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import * as React from 'react';
interface ProfilePictureProps extends React.HTMLAttributes<HTMLElement> {
  src?: string | undefined;
  className?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  className = '',
  ...props
}) => {
  return (
    <Avatar {...props} className={cn('', className.trim())}>
      <AvatarImage src={src} />
      <AvatarFallback className="bg-[var(--color-border)]">
        <User className="text-white w-2/3 h-2/3" />
      </AvatarFallback>
    </Avatar>
  );
};
