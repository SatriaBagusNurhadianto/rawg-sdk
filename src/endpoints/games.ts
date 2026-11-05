import { HttpClient, type HttpResponse } from '../utils/http';
import { buildQueryString, escapeSearchQuery } from '../utils/serialization';
import { validatePagination, validateRange } from '../utils/validation';
import { fetchAll } from '../utils/pagination';
import type {
  Game,
  GameDetail,
  GameScreenshot,
  GameTrailer,
  GamesListParams,
  GamesSearchParams,
} from '../types/games';
import type { PaginatedResponse } from '../types/common';

/**
 * Games endpoint handler
 */
export class GamesEndpoint {
  constructor(
    private httpClient: HttpClient,
    private apiKey: string,
  ) {}

  /**
   * Get list of games
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of games
   */
  async list(
    params: GamesListParams = {},
  ): Promise<HttpResponse<PaginatedResponse<Game>>> {
    // Validate pagination
    validatePagination(params.page, params.pageSize);

    // Validate rating range if provided
    if (params.minRating !== undefined) {
      validateRange(params.minRating, 0, 5, 'minRating');
    }
    if (params.maxRating !== undefined) {
      validateRange(params.maxRating, 0, 5, 'maxRating');
    }

    const queryString = buildQueryString(
      this.normalizeParams(params),
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<Game>>(
      `/games?${queryString}`,
    );
  }

  /**
   * Fetch all games across pages (capped).
   */
  async listAll(
    params: GamesListParams = {},
    options: { maxPages?: number; maxItems?: number } = {},
  ): Promise<{ items: Game[]; truncated: boolean }> {
    return fetchAll<Game>(async (page, pageSize) => {
      const res = await this.list({ ...params, page, pageSize });
      return res.data.results ?? [];
    }, {
      maxPages: options.maxPages,
      maxItems: options.maxItems,
      pageSize: params.pageSize,
    });
  }

  /**
   * Search games by name
   * @returns Paginated list of matching games
   */
  async search(
    params: GamesSearchParams,
  ): Promise<HttpResponse<PaginatedResponse<Game>>> {
    validatePagination(params.page, params.pageSize);

    const searchParams: GamesListParams = {
      ...params,
      search: escapeSearchQuery(params.search),
      searchExact: params.searchExact,
    };

    return this.list(searchParams);
  }

  /**
   * Get game details by ID
   * @param id - Game ID
   * @returns Detailed game information
   */
  async getById(id: number): Promise<HttpResponse<GameDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Game ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<GameDetail>(
      `/games/${id}?${queryString}`,
    );
  }

  /**
   * Get game by slug (URL-friendly identifier)
   * @param slug - Game slug (e.g., 'the-witcher-3-wild-hunt')
   * @returns Detailed game information
   */
  async getBySlug(slug: string): Promise<HttpResponse<GameDetail>> {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Game slug is required');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<GameDetail>(
      `/games/${slug.trim()}?${queryString}`,
    );
  }

  /**
   * Get screenshots for a game
   * @param gameId - Game ID
   * @param pagination - Pagination parameters
   * @returns Paginated list of screenshots
   */
  async getScreenshots(
    gameId: number,
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<HttpResponse<PaginatedResponse<GameScreenshot>>> {
    if (!Number.isInteger(gameId) || gameId <= 0) {
      throw new Error('Game ID must be a positive integer');
    }

    validatePagination(pagination.page, pagination.pageSize);

    const queryString = buildQueryString(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      this.apiKey,
    );

    return this.httpClient.get<PaginatedResponse<GameScreenshot>>(
      `/games/${gameId}/screenshots?${queryString}`,
    );
  }

  /**
   * Get videos/trailers for a game
   * @param gameId - Game ID
   * @returns List of videos
   */
  async getVideos(
    gameId: number,
  ): Promise<HttpResponse<PaginatedResponse<GameTrailer>>> {
    if (!Number.isInteger(gameId) || gameId <= 0) {
      throw new Error('Game ID must be a positive integer');
    }

    const queryString = buildQueryString({}, this.apiKey);
    return this.httpClient.get<PaginatedResponse<GameTrailer>>(
      `/games/${gameId}/movies?${queryString}`,
    );
  }

  /**
   * Normalize parameters for API
   * Convert camelCase to snake_case as required by RAWG API
   */
  private normalizeParams(
    params: GamesListParams,
  ): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    if (params.page !== undefined) normalized.page = params.page;
    if (params.pageSize !== undefined) normalized.page_size = params.pageSize;
    if (params.genres !== undefined) normalized.genres = params.genres;
    if (params.platforms !== undefined) normalized.platforms = params.platforms;
    if (params.developers !== undefined) normalized.developers = params.developers;
    if (params.publishers !== undefined) normalized.publishers = params.publishers;
    if (params.dates !== undefined) normalized.dates = params.dates;
    if (params.excludeCollection !== undefined)
      normalized.exclude_collection = params.excludeCollection;
    if (params.minRating !== undefined) normalized.min_rating = params.minRating;
    if (params.maxRating !== undefined) normalized.max_rating = params.maxRating;
    if (params.excludePlatforms !== undefined)
      normalized.exclude_platforms = params.excludePlatforms;
    if (params.stores !== undefined) normalized.stores = params.stores;
    if (params.ordering !== undefined) normalized.ordering = params.ordering;
    if (params.search !== undefined) normalized.search = params.search;
    if (params.searchExact !== undefined)
      normalized.search_exact = params.searchExact;
    if (params.parentPlatforms !== undefined)
      normalized.parent_platforms = params.parentPlatforms;
    if (params.esrbRatings !== undefined)
      normalized.esrb_ratings = params.esrbRatings;

    return normalized;
  }
}