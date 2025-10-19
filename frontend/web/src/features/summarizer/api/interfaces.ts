export type SummaryStyle = 'formal' | 'creative';

export interface SummarizerRequest {
  lecture_text: string;
  style?: SummaryStyle;
  summary_length?: number;
}

export interface SummarizerResponse {
  summary: string;
}
