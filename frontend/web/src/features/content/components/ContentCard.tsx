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
import { useGetCourseQuery } from '@/features/course';
import { normalizeCapitalization } from '@/utils/format';
import { getFileIcon } from '@/utils/getFileIcon';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import type { Content } from '../api/interfaces';

export interface ContentCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'content'> {
  content: Content;
  setModal: React.Dispatch<React.SetStateAction<Content | 'new' | null>>;
  onDelete: (content: Content) => Promise<void>;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  setModal,
  onDelete,
  ...props
}) => {
  const dispatch = useDispatch();
  const { data: course } = useGetCourseQuery(content.course);

  const actions = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      method: (content: Content) => setModal(content),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      method: (content: Content) =>
        dispatch(
          openAlertDialog({
            title: 'Delete Content',
            description: `Permanently remove ${content.title}?`,
            subDescription: `This action cannot be undone.`,
            action: {
              label: 'Delete',
              method: () => onDelete(content),
              target: '',
            },
          })
        ),
    },
  ];

  return (
    <div
      key={content.id}
      className="flex items-center pl-5 p-2.5 gap-5 justify-between border-y border-(--color-container) text-sm hover:bg-(--color-surface) cursor-default"
      {...props}
    >
      <article className="flex items-center gap-2 w-50">
        {getFileIcon(content.file.extension)}
        <h1 className="w-full truncate">{content.title}</h1>
      </article>

      <p className="w-15">{normalizeCapitalization(content.type || '—')}</p>
      <p className="w-12">{course?.abbreviation || '—'}</p>
      <p className="w-12 text-center">
        {normalizeCapitalization(content.chapter || '—')}
      </p>
      <Detail
        className="w-50"
        value={content.path || '—'}
        copyable
        tooltipMessage="Copy Path"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <DropdownMenuItem
              onClick={() => action.method(content)}
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
