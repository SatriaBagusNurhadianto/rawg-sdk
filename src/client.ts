import { HttpClient } from './utils/http';
import { GamesEndpoint } from './endpoints/games';
import { PlatformsEndpoint } from './endpoints/platforms';
import { GenresEndpoint } from './endpoints/genres';
import { DevelopersEndpoint } from './endpoints/developers';
import { PublishersEndpoint } from './endpoints/publishers';
import { TagsEndpoint } from './endpoints/tags';
import { StoresEndpoint } from './endpoints/stores';
import { AuthenticationError } from './errors';
import { ValidationError } from './errors';

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

  /** Developers endpoint */
  readonly developers: DevelopersEndpoint;

  /** Publishers endpoint */
  readonly publishers: PublishersEndpoint;

  /** Tags endpoint */
  readonly tags: TagsEndpoint;

  /** Stores endpoint */
  readonly stores: StoresEndpoint;

  constructor(config: RAWGClientConfig) {
    // Validate API key
    if (!config.apiKey || typeof config.apiKey !== 'string' || config.apiKey.trim() === '') {
      throw new AuthenticationError('API key is required to initialize RAWG client');
    }

    // Validate base URL
    const resolvedBaseUrl = config.baseUrl ?? 'https://api.rawg.io/api';
    try {
      const parsed = new URL(resolvedBaseUrl);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('invalid protocol');
      }
    } catch {
      throw new ValidationError('Invalid baseUrl', { field: 'baseUrl' });
    }

    this.apiKey = config.apiKey.trim();

    // Initialize HTTP client
    this.httpClient = new HttpClient({
      baseUrl: resolvedBaseUrl,
      timeout: config.timeout ?? 30000,
      headers: {
        'User-Agent': 'RAWG-SDK/1.0.0',
      },
    });

    // Initialize endpoints
    this.games = new GamesEndpoint(this.httpClient, this.apiKey);
    this.platforms = new PlatformsEndpoint(this.httpClient, this.apiKey);
    this.genres = new GenresEndpoint(this.httpClient, this.apiKey);
    this.developers = new DevelopersEndpoint(this.httpClient, this.apiKey);
    this.publishers = new PublishersEndpoint(this.httpClient, this.apiKey);
    this.tags = new TagsEndpoint(this.httpClient, this.apiKey);
    this.stores = new StoresEndpoint(this.httpClient, this.apiKey);
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