import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString } from '../utils/serialization';
import { validatePagination } from '../utils/validation';
import type { TagInfo } from '../types/common';
import type { PaginatedResponse } from '../types/common';

/**
 * Tag details from RAWG API
 */
export interface TagDetail extends TagInfo {
  name_original: string;
  image_background: string | null;
  description: string;
  games_count: number;
}

/**
 * Tags endpoint handler
 */
export class TagsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of all tags
   * @param pagination - Pagination parameters
   * @returns Paginated list of tags
   */
  async list(
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<HttpResponse<PaginatedResponse<TagInfo>>> {
    validatePagination(pagination.page, pagination.pageSize);

    const queryString = buildQueryString(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<TagInfo>>(
      `/tags?${queryString}`,
    );
  }

  /**
   * Get tag details by ID
   * @param id - Tag ID
   * @returns Detailed tag information
   */
  async getById(id: number): Promise<HttpResponse<TagDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Tag ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<TagDetail>(
      `/tags/${id}?${queryString}`,
    );
  }

  /**
   * Get tag by slug
   * @param slug - Tag slug (e.g., 'singleplayer', 'multiplayer')
   * @returns Detailed tag information
   */
  async getBySlug(slug: string): Promise<HttpResponse<TagDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Tag slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<TagDetail>(
      `/tags/${slug.trim()}?${queryString}`,
    );
  }
}