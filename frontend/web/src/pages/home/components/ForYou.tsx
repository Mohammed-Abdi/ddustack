import type { RootState } from '@/store/store';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { Loader } from '@/features/app';
import type { Content } from '@/features/content';
import { useGetContentsQuery } from '@/features/content';
import {
  CourseGrid,
  ProfileSetup,
  useGetCoursesQuery,
  type Course,
} from '@/features/course';
import { useGetDepartmentsQuery } from '@/features/department';

const ForYou: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data: departments, isLoading: departmentsLoading } =
    useGetDepartmentsQuery();

  const profileReady =
    currentUser?.department && currentUser.year && currentUser.semester;

  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery(
    profileReady
      ? {
          departmentId: String(currentUser.department),
          year: String(currentUser.year),
          semester: String(currentUser.semester),
        }
      : ({} as const),
    { skip: !profileReady }
  );

  const courses: Course[] = React.useMemo(
    () => coursesData?.results ?? [],
    [coursesData?.results]
  );

  const { data: contentsData, isLoading: contentsLoading } =
    useGetContentsQuery({});

  const contents: Content[] = React.useMemo(
    () => contentsData?.results ?? [],
    [contentsData?.results]
  );

  const isLoading = coursesLoading || departmentsLoading || contentsLoading;

  const sortedCourses = React.useMemo(() => {
    if (!courses.length) return [];

    const contentCountMap: Record<string, number> = {};
    contents.forEach((content: Content) => {
      const courseId = content.course?.trim().toLowerCase();
      if (!courseId) return;
      contentCountMap[courseId] = (contentCountMap[courseId] || 0) + 1;
    });

    return [...courses].sort(
      (a, b) => (contentCountMap[b.id] || 0) - (contentCountMap[a.id] || 0)
    );
  }, [courses, contents]);

  const incompleteProfile =
    !currentUser?.department || !currentUser.semester || !currentUser.year;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-5 h-full">
        <Loader message="Loading your courses..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {incompleteProfile ? (
        <ProfileSetup departments={departments} />
      ) : (
        <CourseGrid
          user={currentUser}
          sortedCourses={sortedCourses}
          contents={contents}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ForYou;
