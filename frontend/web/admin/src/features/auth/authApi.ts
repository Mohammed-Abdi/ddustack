import { apiSlice } from '../api/baseApi';
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
    oauthLogin: builder.mutation<
      LoginResponse,
      {
        provider: 'google' | 'github' | 'apple';
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
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyCheckEmailQuery,
  useRefreshTokenMutation,
  useMeQuery,
  useOauthLoginMutation,
} = authApi;
