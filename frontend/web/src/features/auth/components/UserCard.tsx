import { Password } from '@/assets/icons/Password';
import { User as UserIcon } from '@/assets/icons/User';
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
import { useGetDepartmentQuery } from '@/features/department';
import { normalizeCapitalization } from '@/utils/format';
import { getOrdinalSuffix } from '@/utils/numerals';
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
  const { data: department } = useGetDepartmentQuery(user.department || '', {
    skip: !user.department,
  });

  const handleNavigation = (id: string) => {
    navigate(`/users/${id}`);
  };

  const actions = [
    {
      label: 'View details',
      icon: <UserIcon className="w-4 h-4" />,
      method: () => handleNavigation(user.id ?? ''),
    },
    {
      label: 'Reset Password',
      icon: <Password className="w-4 h-4" />,
      method: (user: User) =>
        dispatch(
          openAlertDialog({
            title: 'Reset password',
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
    {
      label: 'Delete user',
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
  ];

  return (
    <div
      key={user.id}
      className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-[var(--color-container)] text-sm hover:bg-[var(--color-surface)]"
      {...props}
    >
      <article className="flex items-center gap-2 w-50">
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
        <h1 className="flex items-center gap-1.5 truncate">
          {user.first_name} {user.last_name}
        </h1>
      </article>
      <p className="w-60">{normalizeCapitalization(user.email || '—')}</p>
      <p className="w-30">{normalizeCapitalization(user.role || '—')}</p>
      <p className="w-10 text-center">{department?.code || '—'}</p>
      <p className="w-10 text-center">
        {user.year ? getOrdinalSuffix(user.year) : '—'}
      </p>
      <p className="w-10 text-center">
        {user.semester ? getOrdinalSuffix(user.semester) : '—'}
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action) => (
            <DropdownMenuItem
              onClick={() => action.method(user)}
              variant={
                ['delete', 'delete user', 'remove'].includes(
                  action.label.toLowerCase()
                )
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
