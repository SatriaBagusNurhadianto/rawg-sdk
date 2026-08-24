import { HttpClient } from './utils/http';
import { GamesEndpoint } from './endpoints/games';
import { PlatformsEndpoint } from './endpoints/platforms';
import { GenresEndpoint } from './endpoints/genres';
import { AuthenticationError } from './errors';

/**
 * RAWG SDK Client Configuration
 */
export interface RAWGClientConfig {
  /** RAWG API key (get from https://rawg.io/apireference) */
  apiKey: string;
  /** API base URL (default: https://api.rawg.io/api) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Main RAWG SDK Client
 * Provides access to all RAWG API endpoints
 */
export class RAWGClient {
  private httpClient: HttpClient;
  private apiKey: string;

  /** Games endpoint */
  readonly games: GamesEndpoint;

  /** Platforms endpoint */
  readonly platforms: PlatformsEndpoint;

  /** Genres endpoint */
  readonly genres: GenresEndpoint;

  constructor(config: RAWGClientConfig) {
    // Validate API key
    if (!config.apiKey || typeof config.apiKey !== 'string' || config.apiKey.trim() === '') {
      throw new AuthenticationError('API key is required to initialize RAWG client');
    }

    this.apiKey = config.apiKey.trim();

    // Initialize HTTP client
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl ?? 'https://api.rawg.io/api',
      timeout: config.timeout ?? 30000,
      headers: {
        'User-Agent': 'RAWG-SDK/1.0.0',
      },
    });

    // Initialize endpoints
    this.games = new GamesEndpoint(this.httpClient, this.apiKey);
    this.platforms = new PlatformsEndpoint(this.httpClient, this.apiKey);
    this.genres = new GenresEndpoint(this.httpClient, this.apiKey);
  }

  /**
   * Get API key (masked for security)
   */
  getApiKeyMasked(): string {
    const masked = this.apiKey.substring(0, 4) + '*'.repeat(Math.max(0, this.apiKey.length - 8)) + this.apiKey.substring(this.apiKey.length - 4);
    return masked;
  }

  /**
   * Check if client is properly initialized
   */
  isInitialized(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }
}