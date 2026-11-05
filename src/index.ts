// Version
export const VERSION = '1.1.0';

// Main client
export { RAWGClient, type RAWGClientConfig } from './client';

// Error classes
export {
  RAWGError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  ResponseParseError,
  NetworkError,
  ServerError,
} from './errors';

// Types - Common
export type {
  PaginationParams,
  PaginatedResponse,
  PlatformInfo,
  CompanyInfo,
  GenreInfo,
  TagInfo,
  StoreInfo,
  Rating,
  SearchQuery,
  OrderingField,
  DateRange,
} from './types/common';

// Types - Games
export type {
  Game,
  GameDetail,
  GameScreenshot,
  GameTrailer,
  GamesListParams,
  GamesSearchParams,
} from './types/games';

// Endpoints
export { GamesEndpoint } from './endpoints/games';
export { PlatformsEndpoint } from './endpoints/platforms';
export { GenresEndpoint } from './endpoints/genres';
export { DevelopersEndpoint, type DeveloperDetail } from './endpoints/developers';
export { PublishersEndpoint, type PublisherDetail } from './endpoints/publishers';
export { TagsEndpoint, type TagDetail } from './endpoints/tags';
export { StoresEndpoint, type StoreDetail } from './endpoints/stores';

// HTTP utilities
export { HttpClient, type HttpResponse, type HttpRequestOptions } from './utils/http';

// Validation utilities
export {
  validateRequired,
  validateRange,
  validatePagination,
  validateDateFormat,
  validateCommaSeparatedIds,
  validateEnum,
} from './utils/validation';

// Pagination utilities
export { fetchAll, type FetchAllResult, type FetchAllOptions } from './utils/pagination';
export {
  serializeQueryParams,
  normalizeOrdering,
  formatDateRange,
  escapeSearchQuery,
  camelToSnakeCase,
  buildQueryString,
} from './utils/serialization';