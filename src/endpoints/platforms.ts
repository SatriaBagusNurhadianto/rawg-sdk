import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString } from '../utils/serialization';
import { validatePagination } from '../utils/validation';
import type { PlatformInfo } from '../types/common';
import type { PaginatedResponse } from '../types/common';

/**
 * Platform details from RAWG API
 */
export interface PlatformDetail extends PlatformInfo {
  name_original: string;
  image_background: string | null;
  year_start: number | null;
  year_end: number | null;
  games_count: number;
  image: string | null;
  description: string;
}

/**
 * Platforms endpoint handler
 */
export class PlatformsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of all platforms
   * @param pagination - Pagination parameters
   * @returns Paginated list of platforms
   */
  async list(
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<HttpResponse<PaginatedResponse<PlatformInfo>>> {
    validatePagination(pagination.page, pagination.pageSize);

    const queryString = buildQueryString(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<PlatformInfo>>(
      `/platforms?${queryString}`,
    );
  }

  /**
   * Get platform details by ID
   * @param id - Platform ID
   * @returns Detailed platform information
   */
  async getById(id: number): Promise<HttpResponse<PlatformDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Platform ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<PlatformDetail>(
      `/platforms/${id}?${queryString}`,
    );
  }

  /**
   * Get platform by slug
   * @param slug - Platform slug (e.g., 'pc', 'playstation5')
   * @returns Detailed platform information
   */
  async getBySlug(slug: string): Promise<HttpResponse<PlatformDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Platform slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<PlatformDetail>(
      `/platforms/${slug.trim()}?${queryString}`,
    );
  }
}