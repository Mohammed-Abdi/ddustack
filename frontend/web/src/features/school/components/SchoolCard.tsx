import Edit from '@/assets/icons/Setting';
import {
  Button,
  Detail,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { openAlertDialog } from '@/features/app';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import type { School } from '../api/interfaces';

export interface SchoolCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'school'> {
  school: School;
  setModal: React.Dispatch<React.SetStateAction<School | 'new' | null>>;
  onDelete: (school: School) => Promise<void>;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  setModal,
  onDelete,
  ...props
}) => {
  const dispatch = useDispatch();

  const actions = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      method: (school: School) => setModal(school),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      method: (school: School) =>
        dispatch(
          openAlertDialog({
            title: 'Delete school',
            description: `Permanently remove ${school.name}?`,
            subDescription: `This action cannot be undone.`,
            action: {
              label: 'Delete',
              method: () => onDelete(school),
              target: '',
            },
          })
        ),
    },
  ];

  return (
    <div
      key={school.id}
      className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-(--color-container) text-sm hover:bg-(--color-surface) cursor-default"
      {...props}
    >
      <p className="w-20 truncate">
        <Detail value={school.id} copyable tooltipMessage="Copy School ID" />
      </p>
      <p className="w-50 truncate">{school.name}</p>
      <p className="w-30 truncate">
        {format(new Date(school.created_at), 'dd MMM yyyy, HH:mm')}
      </p>
      <p className="w-30 truncate">
        {format(new Date(school.updated_at), 'dd MMM yyyy, HH:mm')}
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <DropdownMenuItem
              onClick={() => action.method(school)}
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
