import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString } from '../utils/serialization';
import { validatePagination } from '../utils/validation';
import type { StoreInfo } from '../types/common';
import type { PaginatedResponse } from '../types/common';

/**
 * Store details from RAWG API
 */
export interface StoreDetail {
  id: number;
  name: string;
  slug: string;
  name_original: string;
  image_background: string | null;
  description: string;
  games_count: number;
  domain: string | null;
}

/**
 * Stores endpoint handler
 */
export class StoresEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of all stores
   * @param pagination - Pagination parameters
   * @returns Paginated list of stores
   */
  async list(
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<HttpResponse<PaginatedResponse<StoreInfo>>> {
    validatePagination(pagination.page, pagination.pageSize);

    const queryString = buildQueryString(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<StoreInfo>>(
      `/stores?${queryString}`,
    );
  }

  /**
   * Get store details by ID
   * @param id - Store ID
   * @returns Detailed store information
   */
  async getById(id: number): Promise<HttpResponse<StoreDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Store ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<StoreDetail>(
      `/stores/${id}?${queryString}`,
    );
  }

  /**
   * Get store by slug
   * @param slug - Store slug (e.g., 'steam', 'epic-games', 'playstation-store')
   * @returns Detailed store information
   */
  async getBySlug(slug: string): Promise<HttpResponse<StoreDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Store slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<StoreDetail>(
      `/stores/${slug.trim()}?${queryString}`,
    );
  }
}