import { apiSlice } from '../api/baseApi';
import type { Intake, IntakeStatus } from './interfaces';

export const intakeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIntakes: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: Intake[];
      },
      { type?: string; status?: string; search?: string; page?: number }
    >({
      query: (params) => ({
        url: '/intakes/',
        method: 'GET',
        params,
      }),
    }),
    getIntakeById: builder.query<Intake, string>({
      query: (id) => ({
        url: `/intakes/${id}/`,
        method: 'GET',
      }),
    }),
    createIntake: builder.mutation<Intake, Partial<Intake>>({
      query: (body) => ({
        url: '/intakes/',
        method: 'POST',
        body,
      }),
    }),
    updateIntake: builder.mutation<
      Intake,
      { id: string; body: Partial<Intake> }
    >({
      query: ({ id, body }) => ({
        url: `/intakes/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    patchIntake: builder.mutation<
      Intake,
      { id: string; body: Partial<Intake> }
    >({
      query: ({ id, body }) => ({
        url: `/intakes/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteIntake: builder.mutation<void, string>({
      query: (id) => ({
        url: `/intakes/${id}/`,
        method: 'DELETE',
      }),
    }),
    checkUser: builder.mutation<
      { exist: boolean; status: IntakeStatus | null },
      { user_id: string }
    >({
      query: (body) => ({
        url: '/intakes/check-user/',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIntakesQuery,
  useGetIntakeByIdQuery,
  useCreateIntakeMutation,
  useUpdateIntakeMutation,
  usePatchIntakeMutation,
  useDeleteIntakeMutation,
  useCheckUserMutation,
} = intakeApi;
