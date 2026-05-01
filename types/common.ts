/**
 * Uygulama genelinde paylaşılan temel tipler.
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ServiceError {
  message: string;
  code?: number;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  hasMore: boolean;
}
