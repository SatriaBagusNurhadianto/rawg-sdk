/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  /** Page number (starting from 1) */
  page?: number;
  /** Number of results per page */
  pageSize?: number;
}

/**
 * Paginated response structure from RAWG API
 */
export interface PaginatedResponse<T> {
  /** Total count of items */
  count: number;
  /** URL to next page (null if last page) */
  next: string | null;
  /** URL to previous page (null if first page) */
  previous: string | null;
  /** Array of items in current page */
  results: T[];
}

/**
 * Common platform information
 */
export interface PlatformInfo {
  id: number;
  name: string;
  slug: string;
}

/**
 * Common developer/publisher information
 */
export interface CompanyInfo {
  id: number;
  name: string;
  slug: string;
}

/**
 * Common genre information
 */
export interface GenreInfo {
  id: number;
  name: string;
  slug: string;
}

/**
 * Common tag information
 */
export interface TagInfo {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
}

/**
 * Store information
 */
export interface StoreInfo {
  id: number;
  name: string;
  slug: string;
  domain: string;
  games_count: number;
  image_background: string;
}

/**
 * Rating object from RAWG
 */
export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ImageData {
  id: number;
  image: string;
  is_primary: boolean;
  width: number;
  height: number;
}

/**
 * Search query type
 */
export type SearchQuery = string;

/**
 * Ordering field for list queries
 */
export type OrderingField = string;

/**
 * Date range format
 */
export type DateRange = `${number}-${number}-${number},${number}-${number}-${number}`;