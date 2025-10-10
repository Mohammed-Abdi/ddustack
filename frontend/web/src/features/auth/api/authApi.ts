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
      {
        provider: 'google' | 'github';
        code?: string;
      }
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
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useOauthLoginMutation,
  useMeQuery,
  useCheckEmailQuery,
  useLazyMeQuery,
  useLazyCheckEmailQuery,
  useLogoutMutation,
} = authApi;
