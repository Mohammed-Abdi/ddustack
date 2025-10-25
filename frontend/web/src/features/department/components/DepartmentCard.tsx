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
import type { Department } from '../api/interfaces';

export interface DepartmentCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'department'> {
  department: Department;
  schoolName?: string;
  setModal: React.Dispatch<React.SetStateAction<Department | 'new' | null>>;
  onDelete: (department: Department) => Promise<void>;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  schoolName,
  setModal,
  onDelete,
  ...props
}) => {
  const dispatch = useDispatch();

  const actions = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      method: (department: Department) => setModal(department),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      method: (department: Department) =>
        dispatch(
          openAlertDialog({
            title: 'Delete department',
            description: `Permanently remove ${department.name}?`,
            subDescription: `This action cannot be undone.`,
            action: {
              label: 'Delete',
              method: () => onDelete(department),
              target: '',
            },
          })
        ),
    },
  ];

  return (
    <div
      key={department.id}
      className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-(--color-container) text-sm hover:bg-(--color-surface) cursor-default"
      {...props}
    >
      <p className="w-20">
        <Detail
          value={department.id}
          copyable
          tooltipMessage="Copy Department ID"
        />
      </p>
      <p className="w-50 truncate">{department.name}</p>
      <p className="w-40 truncate">{schoolName || 'Unknown School'}</p>
      <p className="w-20 truncate">{department.year}</p>
      <p className="w-30 truncate">
        {format(new Date(department.created_at), 'dd MMM yyyy, HH:mm')}
      </p>
      <p className="w-30 truncate">
        {format(new Date(department.updated_at), 'dd MMM yyyy, HH:mm')}
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
              onClick={() => action.method(department)}
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
