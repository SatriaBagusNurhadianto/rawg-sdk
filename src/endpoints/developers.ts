import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString } from '../utils/serialization';
import { validatePagination } from '../utils/validation';
import type { CompanyInfo } from '../types/common';
import type { PaginatedResponse } from '../types/common';

/**
 * Developer details from RAWG API
 */
export interface DeveloperDetail extends CompanyInfo {
  name_original: string;
  image_background: string | null;
  description: string;
  games_count: number;
}

/**
 * Developers endpoint handler
 */
export class DevelopersEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of all developers
   * @param pagination - Pagination parameters
   * @returns Paginated list of developers
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
      `/developers?${queryString}`,
    );
  }

  /**
   * Get developer details by ID
   * @param id - Developer ID
   * @returns Detailed developer information
   */
  async getById(id: number): Promise<HttpResponse<DeveloperDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Developer ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<DeveloperDetail>(
      `/developers/${id}?${queryString}`,
    );
  }

  /**
   * Get developer by slug
   * @param slug - Developer slug (e.g., 'cd-projekt-red')
   * @returns Detailed developer information
   */
  async getBySlug(slug: string): Promise<HttpResponse<DeveloperDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Developer slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<DeveloperDetail>(
      `/developers/${slug.trim()}?${queryString}`,
    );
  }
}