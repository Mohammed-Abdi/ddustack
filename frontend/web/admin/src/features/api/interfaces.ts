export interface ApiError {
  status?: number;
  data?: {
    detail?: string;
    [key: string]: string | string[] | undefined;
  };
  message?: string;
  name?: string;
}
