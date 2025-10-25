import { Repo } from '@/assets/icons/Repo';
import Edit from '@/assets/icons/Setting';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { openAlertDialog } from '@/features/app';
import { normalizeCapitalization } from '@/utils/format';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import type { Course } from '../api/interfaces';

export interface CourseCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'course'> {
  course: Course;
  setModal: React.Dispatch<React.SetStateAction<Course | 'new' | null>>;
  onDelete: (course: Course) => Promise<void>;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  setModal,
  onDelete,
  ...props
}) => {
  const dispatch = useDispatch();

  const actions = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      method: (course: Course) => setModal(course),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      method: (course: Course) =>
        dispatch(
          openAlertDialog({
            title: 'Delete Course',
            description: `Permanently remove ${course.name}?`,
            subDescription: `This action cannot be undone.`,
            action: {
              label: 'Delete',
              method: () => onDelete(course),
              target: '',
            },
          })
        ),
    },
  ];

  return (
    <div
      key={course.id}
      className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-(--color-container) text-sm hover:bg-(--color-surface) cursor-default"
      {...props}
    >
      <article className="flex items-center gap-2 w-50">
        <Repo className="size-5" />
        <h1 className="w-full truncate">{course.name}</h1>
      </article>

      <p className="w-20">{course?.abbreviation || '—'}</p>
      <p className="w-20">{course?.code || '—'}</p>
      <p className="w-20">{normalizeCapitalization(course?.status) || '—'}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <DropdownMenuItem
              onClick={() => action.method(course)}
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
