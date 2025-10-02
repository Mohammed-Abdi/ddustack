import { logout, setAccess } from '@/features/auth/authSlice';
import type { RootState } from '@/store/store';
import type {
  FetchArgs,
  FetchBaseQueryError,
  QueryReturnValue,
} from '@reduxjs/toolkit/query';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
  credentials: 'include',
});

type BaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

export const baseQueryWithReauth: BaseQuery = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();

  let result = (await baseQuery(args, api, extraOptions)) as QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    Record<string, unknown>
  >;

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = (await baseQuery(
          { url: '/auth/refresh/', method: 'POST' },
          api,
          extraOptions
        )) as QueryReturnValue<{ access: string }, FetchBaseQueryError>;

        if (refreshResult.data) {
          api.dispatch(setAccess(refreshResult.data.access));
          result = (await baseQuery(
            args,
            api,
            extraOptions
          )) as QueryReturnValue<
            unknown,
            FetchBaseQueryError,
            Record<string, unknown>
          >;
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = (await baseQuery(args, api, extraOptions)) as QueryReturnValue<
        unknown,
        FetchBaseQueryError,
        Record<string, unknown>
      >;
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
