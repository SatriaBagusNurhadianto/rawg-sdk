import {
  RAWGError,
  NetworkError,
  RateLimitError,
  ResponseParseError,
  NotFoundError,
  ServerError,
} from '../errors';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retry?: number;
}

export interface HttpResponse<T> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

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
    this.defaultTimeout = options.timeout ?? 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  async request<T = unknown>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint);
    const mergedOptions = this.mergeOptions(options);
    const method = mergedOptions.method ?? 'GET';
    const maxAttempts = method === 'GET' ? (mergedOptions.retry ?? 3) : 0;

    let lastError: unknown;
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, mergedOptions);
        if (
          method === 'GET' &&
          attempt < maxAttempts &&
          [429, 502, 503, 504].includes(response.status)
        ) {
          const retryAfter = this.parseRetryAfter(response.headers);
          await this.sleep(retryAfter ?? this.backoff(attempt));
          continue;
        }
        return await this.handleResponse<T>(response, endpoint);
      } catch (error) {
        if (error instanceof RAWGError) {
          if (
            method === 'GET' &&
            attempt < maxAttempts &&
            error instanceof RateLimitError
          ) {
            const retryAfter = Math.min(error.retryAfter ?? 1, 30) * 1000;
            await this.sleep(retryAfter);
            lastError = error;
            continue;
          }
          if (error instanceof ServerError && method === 'GET' && attempt < maxAttempts) {
            await this.sleep(this.backoff(attempt));
            lastError = error;
            continue;
          }
          throw error;
        }
        if (error instanceof TypeError) {
          if (method === 'GET' && attempt < maxAttempts) {
            await this.sleep(this.backoff(attempt));
            lastError = error;
            continue;
          }
          throw new NetworkError('Network request failed');
        }
        throw error;
      }
    }
    if (lastError instanceof TypeError) {
      throw new NetworkError('Network request failed');
    }
    if (lastError instanceof RAWGError) {
      throw lastError;
    }
    throw new NetworkError('Request failed after retries');
  }

  async get<T = unknown>(
    endpoint: string,
    options: Omit<HttpRequestOptions, 'method' | 'body'> = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<HttpRequestOptions, 'method' | 'body'> = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  private mergeOptions(options: HttpRequestOptions): HttpRequestOptions {
    return {
      method: options.method ?? 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      timeout: options.timeout ?? this.defaultTimeout,
      retry: options.retry ?? 3,
      body: options.body,
    };
  }

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
        fetchOptions.body =
          typeof options.body === 'string'
            ? options.body
            : JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async handleResponse<T>(
    response: Response,
    endpoint: string,
  ): Promise<HttpResponse<T>> {
    const headers = this.parseHeaders(response.headers);

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

  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

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

      case 429: {
        const raw = headers['retry-after'];
        const parsed = raw ? parseInt(raw, 10) : undefined;
        const retryAfter =
          parsed && !isNaN(parsed) ? Math.min(parsed, 30) : undefined;
        throw new RateLimitError('Too many requests', { retryAfter });
      }

      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(`Server error (${status})`, {
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

  private parseRetryAfter(headers: Headers | Record<string, string>): number | undefined {
    const raw =
      headers instanceof Headers
        ? headers.get('retry-after')
        : headers['retry-after'];
    if (!raw) return undefined;
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) return undefined;
    return Math.min(parsed, 30) * 1000;
  }

  private backoff(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 8000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
