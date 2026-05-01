export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'PAYWALL_REQUIRED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export type Pagination = {
  cursor: string | null;
  limit: number;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};

export type IsoDate = string;
