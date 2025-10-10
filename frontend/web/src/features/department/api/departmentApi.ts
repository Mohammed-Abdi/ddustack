import { apiSlice } from '@/features/app';
import type { CreateDepartmentRequest, Department } from './interfaces';

export const departmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], { schoolId?: string } | void>({
      query: (params) => ({
        url: '/departments/',
        params: params?.schoolId ? { school: params.schoolId } : {},
      }),
    }),
    getDepartment: builder.query<Department, string>({
      query: (id) => `/departments/${id}/`,
    }),
    createDepartment: builder.mutation<Department, CreateDepartmentRequest>({
      query: (body) => ({ url: '/departments/', method: 'POST', body }),
    }),
    updateDepartment: builder.mutation<Department, Partial<Department>>({
      query: ({ id, ...body }) => ({
        url: `/departments/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({ url: `/departments/${id}/`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useLazyGetDepartmentsQuery,
  useLazyGetDepartmentQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
