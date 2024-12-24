export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiRequest<T = any> {
  body?: T;
  params?: Record<string, string>;
  query?: Record<string, string>;
} 