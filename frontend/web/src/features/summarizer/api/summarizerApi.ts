import { apiSlice } from '@/features/app';
import type { SummarizerRequest, SummarizerResponse } from './interfaces';

export const summarizerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    summarize: builder.mutation<SummarizerResponse, SummarizerRequest>({
      query: (body) => ({
        url: '/summarizer/',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSummarizeMutation } = summarizerApi;
