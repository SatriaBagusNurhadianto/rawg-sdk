import {
  RAWGError,
  NetworkError,
  RateLimitError,
  ResponseParseError,
  NotFoundError,
} from '../errors';

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retry?: number;
}

/**
 * HTTP response wrapper
 */
export interface HttpResponse<T> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

/**
 * HTTP Client for making requests to RAWG API
 */
export class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(options: {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
  }) {
    this.baseUrl = options.baseUrl;
    this.defaultTimeout = options.timeout ?? 30000; // 30 seconds
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  /**
   * Make HTTP request
   */
  async request<T = unknown>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint);
    const mergedOptions = this.mergeOptions(options);

    try {
      const response = await this.fetchWithTimeout(url, mergedOptions);
      return await this.handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof RAWGError) {
        throw error;
      }
      if (error instanceof TypeError) {
        throw new NetworkError(`Network request failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Make GET request
   */
  async get<T = unknown>(
    endpoint: string,
    options: Omit<HttpRequestOptions, 'method' | 'body'> = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Make POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<HttpRequestOptions, 'method' | 'body'> = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Merge request options with defaults
   */
  private mergeOptions(options: HttpRequestOptions): HttpRequestOptions {
    return {
      method: options.method ?? 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      timeout: options.timeout ?? this.defaultTimeout,
      retry: options.retry ?? 0,
      body: options.body,
    };
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: HttpRequestOptions,
  ): Promise<Response> {
    const timeout = options.timeout ?? this.defaultTimeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method: options.method,
        headers: options.headers,
        signal: controller.signal,
      };

      if (options.body) {
        fetchOptions.body = typeof options.body === 'string' 
          ? options.body 
          : JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle HTTP response and parse JSON
   */
  private async handleResponse<T>(
    response: Response,
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const headers = this.parseHeaders(response.headers);

    // Handle non-2xx status codes
    if (!response.ok) {
      this.handleErrorStatus(response.status, endpoint, headers);
    }

    try {
      const data = await response.json() as T;
      return {
        status: response.status,
        headers,
        data,
      };
    } catch (error) {
      throw new ResponseParseError(
        `Failed to parse JSON response from ${endpoint}`,
      );
    }
  }

  /**
   * Parse response headers
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Handle HTTP error status codes
   */
  private handleErrorStatus(
    status: number,
    endpoint: string,
    headers: Record<string, string>,
  ): never {
    switch (status) {
      case 400:
        throw new RAWGError('Bad request', {
          status,
          code: 'BAD_REQUEST',
          endpoint,
        });

      case 401:
        throw new RAWGError('Unauthorized', {
          status,
          code: 'UNAUTHORIZED',
          endpoint,
        });

      case 403:
        throw new RAWGError('Forbidden', {
          status,
          code: 'FORBIDDEN',
          endpoint,
        });

      case 404:
        throw new NotFoundError(`Resource not found at ${endpoint}`, endpoint);

      case 429:
        const retryAfter = headers['retry-after'] 
          ? parseInt(headers['retry-after'], 10)
          : undefined;
        throw new RateLimitError('Too many requests', { retryAfter });

      case 500:
      case 502:
      case 503:
      case 504:
        throw new RAWGError('Server error', {
          status,
          code: 'SERVER_ERROR',
          endpoint,
        });

      default:
        throw new RAWGError(`HTTP ${status}`, {
          status,
          code: `HTTP_${status}`,
          endpoint,
        });
    }
  }
}