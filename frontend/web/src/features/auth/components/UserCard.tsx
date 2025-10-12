import { Password } from '@/assets/icons/Password';
import { Verified } from '@/assets/icons/Verified';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { openAlertDialog } from '@/features/app';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { User } from '../api/interfaces';

export interface UserCardProps extends React.HTMLAttributes<HTMLElement> {
  user: User;
  onDelete: (user: User) => Promise<void>;
  onResetPassword: (user: User) => Promise<void>;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onDelete,
  onResetPassword,
  ...props
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigation = (id: string) => {
    navigate(`/users/${id}`);
  };

  const actions = [
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      method: (user: User) =>
        dispatch(
          openAlertDialog({
            title: 'Delete User',
            description: `Permanently remove ${user.first_name} ${user.last_name}?`,
            subDescription: `This action cannot be undone.`,
            action: {
              label: 'Delete',
              method: () => onDelete(user),
              target: '',
            },
          })
        ),
    },
    {
      label: 'Reset Password',
      icon: <Password className="w-4 h-4" />,
      method: (user: User) =>
        dispatch(
          openAlertDialog({
            title: 'Reset Password',
            description: `Reset password for ${user.first_name}?`,
            subDescription: `A new temporary password will be generated.`,
            action: {
              label: 'Reset',
              method: () => onResetPassword(user),
              target: '',
            },
          })
        ),
    },
  ];

  return (
    <div
      onClick={() => handleNavigation(user.id ?? '')}
      key={user.id}
      className="flex items-center p-5 border-y border-[var(--color-container)] hover:bg-[var(--color-surface)] cursor-default"
      {...props}
    >
      <Avatar className="mr-2">
        <AvatarImage src={user?.avatar ?? undefined} />
        <AvatarFallback>
          <img
            src="/illustrations/pfp-fallback.webp"
            alt="default profile picture"
            className="w-full h-full"
          />
        </AvatarFallback>
      </Avatar>
      <article className="w-full">
        <h1 className="flex items-center gap-1.5 truncate">
          {user.first_name} {user.last_name}{' '}
          {user.is_verified && (
            <Verified className="w-4 h-4 text-[var(--color-info)]" />
          )}
        </h1>
        <p className="text-sm truncate text-[var(--color-text-muted)]">
          {user.email}
        </p>
      </article>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" className="ml-auto">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <DropdownMenuItem
              onClick={() => action.method(user)}
              variant={
                ['delete', 'remove'].includes(action.label.toLowerCase())
                  ? 'destructive'
                  : 'default'
              }
            >
              <Button variant="ghost">
                {action.icon} {action.label}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserCard;
