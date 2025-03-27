
// Base model type that all entities extend
export interface BaseModel {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Pagination parameters type
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Search params
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// Response type for paginated data
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
