import { apiSlice } from '@/features/app';
import type { CourseOffering } from './interfaces';

export const offeringApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseOfferings: builder.query<
      {
        results: CourseOffering[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        departmentId?: string;
        year?: string;
        semester?: string;
        page?: number;
      }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.departmentId)
          query.append('departmentId', params.departmentId);
        if (params?.year) query.append('year', params.year);
        if (params?.semester) query.append('semester', params.semester);
        if (params?.page) query.append('page', String(params.page));
        const queryString = query.toString();
        return {
          url: `/course-offerings/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getCourseOffering: builder.query<CourseOffering, string>({
      query: (id) => ({
        url: `/course-offerings/${id}/`,
        method: 'GET',
      }),
    }),
    createCourseOffering: builder.mutation<
      CourseOffering,
      Partial<CourseOffering>
    >({
      query: (body) => ({
        url: '/course-offerings/',
        method: 'POST',
        body,
      }),
    }),
    updateCourseOffering: builder.mutation<
      CourseOffering,
      { id: string; data: Partial<CourseOffering> }
    >({
      query: ({ id, data }) => ({
        url: `/course-offerings/${id}/`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCourseOffering: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/course-offerings/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCourseOfferingsQuery,
  useLazyGetCourseOfferingsQuery,
  useGetCourseOfferingQuery,
  useLazyGetCourseOfferingQuery,
  useCreateCourseOfferingMutation,
  useUpdateCourseOfferingMutation,
  useDeleteCourseOfferingMutation,
} = offeringApi;
