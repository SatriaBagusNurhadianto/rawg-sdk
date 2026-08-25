import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString } from '../utils/serialization';
import { validatePagination } from '../utils/validation';
import type { CompanyInfo } from '../types/common';
import type { PaginatedResponse } from '../types/common';

/**
 * Publisher details from RAWG API
 */
export interface PublisherDetail extends CompanyInfo {
  name_original: string;
  image_background: string | null;
  description: string;
  games_count: number;
}

/**
 * Publishers endpoint handler
 */
export class PublishersEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of all publishers
   * @param pagination - Pagination parameters
   * @returns Paginated list of publishers
   */
  async list(
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<HttpResponse<PaginatedResponse<CompanyInfo>>> {
    validatePagination(pagination.page, pagination.pageSize);

    const queryString = buildQueryString(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<CompanyInfo>>(
      `/publishers?${queryString}`,
    );
  }

  /**
   * Get publisher details by ID
   * @param id - Publisher ID
   * @returns Detailed publisher information
   */
  async getById(id: number): Promise<HttpResponse<PublisherDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Publisher ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<PublisherDetail>(
      `/publishers/${id}?${queryString}`,
    );
  }

  /**
   * Get publisher by slug
   * @param slug - Publisher slug (e.g., 'electronic-arts')
   * @returns Detailed publisher information
   */
  async getBySlug(slug: string): Promise<HttpResponse<PublisherDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Publisher slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<PublisherDetail>(
      `/publishers/${slug.trim()}?${queryString}`,
    );
  }
}