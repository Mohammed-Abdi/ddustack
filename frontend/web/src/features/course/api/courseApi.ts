import { apiSlice } from '@/features/app';
import type { Course } from './interfaces';

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<
      {
        results: Course[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        search?: string;
        page?: number;
        departmentId?: string;
        year?: string;
        semester?: string;
      }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.page) query.append('page', String(params.page));
        if (params?.departmentId)
          query.append('departmentId', params.departmentId);
        if (params?.year) query.append('year', params.year);
        if (params?.semester) query.append('semester', params.semester);
        const queryString = query.toString();
        return {
          url: `/courses/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => ({
        url: `/courses/${id}/`,
        method: 'GET',
      }),
    }),
    createCourse: builder.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: '/courses/',
        method: 'POST',
        body,
      }),
    }),
    updateCourse: builder.mutation<
      Course,
      { id: string; data: Partial<Course> }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}/`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCourse: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/courses/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCoursesQuery,
  useLazyGetCoursesQuery,
  useGetCourseQuery,
  useLazyGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
