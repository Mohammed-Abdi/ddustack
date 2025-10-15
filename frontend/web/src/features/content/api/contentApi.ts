import { apiSlice } from '@/features/app';
import type { Content } from './interfaces';

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContents: builder.query<
      {
        results: Content[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        search?: string;
        page?: number;
        courseId?: string;
      }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.page) query.append('page', String(params.page));
        if (params?.courseId) query.append('courseId', params.courseId);

        const queryString = query.toString();
        return {
          url: `/contents/${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),

    getContent: builder.query<Content, string>({
      query: (id) => ({
        url: `/contents/${id}/`,
        method: 'GET',
      }),
    }),

    createContent: builder.mutation<Content, Partial<Content>>({
      query: (body) => ({
        url: '/contents/',
        method: 'POST',
        body,
      }),
    }),

    updateContent: builder.mutation<
      Content,
      { id: string; data: Partial<Content> }
    >({
      query: ({ id, data }) => ({
        url: `/contents/${id}/`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteContent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/contents/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetContentsQuery,
  useLazyGetContentsQuery,
  useGetContentQuery,
  useLazyGetContentQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
} = contentApi;
