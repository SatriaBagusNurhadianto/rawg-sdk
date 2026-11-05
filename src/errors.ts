/**
 * Base error class for RAWG SDK
 */
export class RAWGError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly endpoint?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      endpoint?: string;
      details?: unknown;
    },
  ) {
    super(message);
    this.name = 'RAWGError';
    this.status = options?.status;
    this.code = options?.code;
    this.endpoint = options?.endpoint;
    this.details = options?.details;

    // Ensure prototype chain is correct for instanceof checks
    Object.setPrototypeOf(this, RAWGError.prototype);
  }
}

/**
 * Error thrown when API key is missing or invalid
 */
export class AuthenticationError extends RAWGError {
  constructor(message: string = 'API key is missing or invalid') {
    super(message, { code: 'AUTHENTICATION_ERROR' });
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends RAWGError {
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    options?: { retryAfter?: number },
  ) {
    super(message, { code: 'RATE_LIMIT_ERROR' });
    this.name = 'RateLimitError';
    this.retryAfter = options?.retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Error thrown when resource is not found
 */
export class NotFoundError extends RAWGError {
  constructor(message: string = 'Resource not found', endpoint?: string) {
    super(message, { status: 404, code: 'NOT_FOUND', endpoint });
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends RAWGError {
  public readonly field?: string;

  constructor(
    message: string,
    options?: { field?: string },
  ) {
    super(message, { code: 'VALIDATION_ERROR' });
    this.name = 'ValidationError';
    this.field = options?.field;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when API returns invalid response
 */
export class ResponseParseError extends RAWGError {
  constructor(message: string = 'Failed to parse API response') {
    super(message, { code: 'RESPONSE_PARSE_ERROR' });
    this.name = 'ResponseParseError';
    Object.setPrototypeOf(this, ResponseParseError.prototype);
  }
}

/**
 * Error thrown for server-side (5xx) errors
 */
export class ServerError extends RAWGError {
  constructor(message: string = 'Server error', options?: { status?: number; code?: string; endpoint?: string }) {
    super(message, { status: options?.status, code: options?.code ?? 'SERVER_ERROR', endpoint: options?.endpoint });
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
/**
 * Error thrown for network/connection issues
 */
export class NetworkError extends RAWGError {
  constructor(message: string = 'Network request failed') {
    super(message, { code: 'NETWORK_ERROR' });
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}