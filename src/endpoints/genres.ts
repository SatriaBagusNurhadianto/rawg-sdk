import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString } from '../utils/serialization';
import { validatePagination } from '../utils/validation';
import type { GenreInfo } from '../types/common';
import type { PaginatedResponse } from '../types/common';

/**
 * Genre details from RAWG API
 */
export interface GenreDetail extends GenreInfo {
  name_original: string;
  image_background: string | null;
  description: string;
  games_count: number;
}

/**
 * Genres endpoint handler
 */
export class GenresEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of all genres
   * @param pagination - Pagination parameters
   * @returns Paginated list of genres
   */
  async list(
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<HttpResponse<PaginatedResponse<GenreInfo>>> {
    validatePagination(pagination.page, pagination.pageSize);

    const queryString = buildQueryString(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<GenreInfo>>(
      `/genres?${queryString}`,
    );
  }

  /**
   * Get genre details by ID
   * @param id - Genre ID
   * @returns Detailed genre information
   */
  async getById(id: number): Promise<HttpResponse<GenreDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Genre ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<GenreDetail>(
      `/genres/${id}?${queryString}`,
    );
  }

  /**
   * Get genre by slug
   * @param slug - Genre slug (e.g., 'action', 'rpg', 'strategy')
   * @returns Detailed genre information
   */
  async getBySlug(slug: string): Promise<HttpResponse<GenreDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Genre slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<GenreDetail>(
      `/genres/${slug.trim()}?${queryString}`,
    );
  }
}