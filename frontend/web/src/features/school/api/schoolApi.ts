import { apiSlice } from '@/features/app';
import type { CreateSchoolRequest, School } from './interfaces';

export const schoolApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query<School[], void>({
      query: () => '/schools/',
    }),
    getSchool: builder.query<School, string>({
      query: (id) => `/schools/${id}/`,
    }),
    createSchool: builder.mutation<School, CreateSchoolRequest>({
      query: (body) => ({ url: '/schools/', method: 'POST', body }),
    }),
    updateSchool: builder.mutation<School, Partial<School>>({
      query: ({ id, ...body }) => ({
        url: `/schools/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteSchool: builder.mutation<void, string>({
      query: (id) => ({ url: `/schools/${id}/`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useLazyGetSchoolsQuery,
  useGetSchoolQuery,
  useLazyGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = schoolApi;
