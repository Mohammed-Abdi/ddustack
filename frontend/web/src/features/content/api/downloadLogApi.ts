import { apiSlice } from '@/features/app';
import type { DownloadLog } from './interfaces';

export const downloadLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDownloadLogs: builder.query<
      {
        results: DownloadLog[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        page?: number;
        contentId?: string;
      }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', String(params.page));
        if (params?.contentId) query.append('content_id', params.contentId);

        const queryString = query.toString();
        return {
          url: `/download-logs/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),

    getDownloadLog: builder.query<DownloadLog, string>({
      query: (id) => ({
        url: `/download-logs/${id}/`,
        method: 'GET',
      }),
    }),

    createDownloadLog: builder.mutation<DownloadLog, { content: string }>({
      query: (body) => ({
        url: '/download-logs/',
        method: 'POST',
        body,
      }),
    }),

    deleteDownloadLog: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/download-logs/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDownloadLogsQuery,
  useLazyGetDownloadLogsQuery,
  useGetDownloadLogQuery,
  useLazyGetDownloadLogQuery,
  useCreateDownloadLogMutation,
  useDeleteDownloadLogMutation,
} = downloadLogApi;
