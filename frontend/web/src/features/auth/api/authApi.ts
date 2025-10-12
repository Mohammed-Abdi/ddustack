import { apiSlice } from '@/features/app';
import type { LoginResponse, User } from './interfaces';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (credentials) => ({
          url: '/auth/login/',
          method: 'POST',
          body: credentials,
        }),
      }
    ),
    register: builder.mutation<
      LoginResponse,
      { email: string; password: string; first_name: string; last_name: string }
    >({
      query: (data) => ({
        url: '/auth/register/',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.mutation<{ access_token: string }, void>({
      query: () => ({
        url: '/auth/refresh/',
        method: 'POST',
      }),
    }),
    me: builder.query<User, void>({
      query: () => ({
        url: '/users/me/',
        method: 'GET',
      }),
    }),
    updateMe: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users/me/',
        method: 'PUT',
        body: data,
      }),
    }),
    uploadAvatar: builder.mutation<{ avatar: string }, FormData>({
      query: (formData) => ({
        url: '/users/me/avatar/',
        method: 'POST',
        body: formData,
      }),
    }),
    oauthLogin: builder.mutation<
      LoginResponse,
      { provider: 'google' | 'github'; code?: string }
    >({
      query: ({ provider, ...body }) => ({
        url: `/auth/oauth/${provider}/`,
        method: 'POST',
        body,
      }),
    }),
    checkEmail: builder.query<{ exists: boolean }, string>({
      query: (email) => ({
        url: '/auth/check-email/',
        method: 'POST',
        body: { email },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
    }),
    getUsers: builder.query<
      {
        results: User[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        search?: string;
        page?: number;
      }
    >({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.search) query.append('search', params.search);
        if (params?.page) query.append('page', String(params.page));

        const queryString = query.toString();
        return {
          url: `/users/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getUser: builder.query<User, string>({
      query: (userId) => ({
        url: `/users/${userId}/`,
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation<User, { userId: string; data: Partial<User> }>(
      {
        query: ({ userId, data }) => ({
          url: `/users/${userId}/`,
          method: 'PUT',
          body: data,
        }),
      }
    ),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}/`,
        method: 'DELETE',
      }),
    }),
    resetPassword: builder.mutation<{ detail: string }, { user_id: string }>({
      query: (body) => ({
        url: '/users/reset-password/',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useMeQuery,
  useLazyMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useOauthLoginMutation,
  useCheckEmailQuery,
  useLazyCheckEmailQuery,
  useLogoutMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation,
} = authApi;
