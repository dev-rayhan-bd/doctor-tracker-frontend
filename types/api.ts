/**
 * Standard API response envelope matching backend sendResponse structure:
 * {
 *   statusCode: number,
 *   success: boolean,
 *   message: string,
 *   data: T,
 *   meta?: PaginationMeta
 * }
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode: number;
  success: false;
  message: string;
  errorMessages?: Array<{
    path: string | number;
    message: string;
  }>;
  stack?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
  [key: string]: string | number | boolean | undefined;
}

