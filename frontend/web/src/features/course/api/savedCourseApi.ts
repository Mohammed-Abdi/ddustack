import { apiSlice } from '@/features/app';
import type { SavedCourse } from './interfaces';

export const savedCourseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedCourses: builder.query<
      {
        results: SavedCourse[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      { page?: number }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', String(params.page));
        const queryString = query.toString();

        return {
          url: `/saved-courses/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),

    addSavedCourse: builder.mutation<SavedCourse, { course: string }>({
      query: (body) => ({
        url: '/saved-courses/',
        method: 'POST',
        body,
      }),
    }),

    deleteSavedCourse: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/saved-courses/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSavedCoursesQuery,
  useLazyGetSavedCoursesQuery,
  useAddSavedCourseMutation,
  useDeleteSavedCourseMutation,
} = savedCourseApi;
