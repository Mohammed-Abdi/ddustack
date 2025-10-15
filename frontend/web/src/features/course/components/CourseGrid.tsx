import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Folder } from '@/assets/icons/Folder';
import { Badge, Item } from '@/components/ui';
import type { User } from '@/features/auth';
import type { Content } from '@/features/content';
import { normalizeCapitalization } from '@/utils/format';
import type { Course } from '../api/interfaces';

interface CourseGridProps {
  user: User | null;
  sortedCourses: Course[];
  contents: Content[];
  isLoading: boolean;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  user,
  sortedCourses,
  contents,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (sortedCourses.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[85dvh]">
        <div className="flex items-center flex-col gap-2.5 text-center">
          <img
            src="/public/illustrations/book-lover.svg"
            alt=""
            className="w-2xs translate-y-5"
          />
          <h1 className="text-xl md:text-2xl font-medium">
            No courses available this semester
          </h1>
          <p>Check back later or contact your department for updates</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <article className="flex flex-col gap-2.5 py-2.5 truncate">
        <h1 className="text-2xl font-bold">Hey there, {user?.first_name}</h1>
        <p className="text-[15px] text-[var(--color-text-muted)] truncate w-full">
          Here’s what’s relevant to your studies this semester
        </p>
      </article>

      <ul className="grid w-full grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-5">
        {sortedCourses.map((course) => {
          const isReady = contents.some(
            (content: Content) =>
              content.course?.trim().toLowerCase() ===
              course.id?.trim().toLowerCase()
          );

          return (
            <Item
              key={course.id}
              onClick={() => {
                if (isReady) {
                  navigate(`/my-courses/${course.id}`);
                } else {
                  toast.error('We are working on this course', {
                    description: 'It will be available very soon.',
                  });
                }
              }}
              disable={!isReady}
              isLoading={isLoading}
              className="h-full"
            >
              <Badge
                color="var(--color-info-muted)"
                className="flex items-center justify-center w-9 h-9 opacity-90"
              >
                <Folder className="opacity-70" />
              </Badge>
              <h1 className="font-medium truncate mr-2.5 whitespace-nowrap w-full">
                {course.name}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] truncate mr-2.5 whitespace-nowrap w-full">
                {isReady
                  ? course.description
                  : '🚧 We are working on this course'}
              </p>
              <div className="flex items-center gap-2.5 mt-auto">
                <Badge color="var(--color-info-muted)" className="opacity-90">
                  {course.code}
                </Badge>
                <Badge color="var(--color-info-muted)" className="opacity-90">
                  {normalizeCapitalization(course.status)}
                </Badge>
              </div>
            </Item>
          );
        })}
      </ul>
    </div>
  );
};
