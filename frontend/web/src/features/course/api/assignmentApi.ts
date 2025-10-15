import { apiSlice } from '@/features/app';
import type { CourseAssignment } from './interfaces';

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseAssignments: builder.query<
      {
        results: CourseAssignment[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        userId?: string;
        courseId?: string;
        page?: number;
      }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.userId) query.append('userId', params.userId);
        if (params?.courseId) query.append('courseId', params.courseId);
        if (params?.page) query.append('page', String(params.page));
        const queryString = query.toString();
        return {
          url: `/course-assignments/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getCourseAssignment: builder.query<CourseAssignment, string>({
      query: (id) => ({
        url: `/course-assignments/${id}/`,
        method: 'GET',
      }),
    }),
    createCourseAssignment: builder.mutation<
      CourseAssignment,
      Partial<CourseAssignment>
    >({
      query: (body) => ({
        url: '/course-assignments/',
        method: 'POST',
        body,
      }),
    }),
    updateCourseAssignment: builder.mutation<
      CourseAssignment,
      { id: string; data: Partial<CourseAssignment> }
    >({
      query: ({ id, data }) => ({
        url: `/course-assignments/${id}/`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCourseAssignment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/course-assignments/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCourseAssignmentsQuery,
  useLazyGetCourseAssignmentsQuery,
  useGetCourseAssignmentQuery,
  useLazyGetCourseAssignmentQuery,
  useCreateCourseAssignmentMutation,
  useUpdateCourseAssignmentMutation,
  useDeleteCourseAssignmentMutation,
} = assignmentApi;
