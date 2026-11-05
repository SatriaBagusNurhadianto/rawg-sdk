import { describe, it, expect, beforeEach } from 'vitest';
import {
  RAWGClient,
  RAWGError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
  ResponseParseError,
  VERSION,
} from './index';

describe('RAWG SDK', () => {
  describe('Exports', () => {
    it('should export VERSION', () => {
      expect(VERSION).toBe('1.1.0');
    });

    it('should export RAWGClient', () => {
      expect(RAWGClient).toBeDefined();
    });

    it('should export error classes', () => {
      expect(RAWGError).toBeDefined();
      expect(AuthenticationError).toBeDefined();
      expect(ValidationError).toBeDefined();
      expect(NotFoundError).toBeDefined();
      expect(RateLimitError).toBeDefined();
      expect(NetworkError).toBeDefined();
      expect(ResponseParseError).toBeDefined();
    });
  });

  describe('RAWGClient Initialization', () => {
    it('should throw AuthenticationError when API key is missing', () => {
      expect(() => {
        new RAWGClient({ apiKey: '' });
      }).toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError when API key is not a string', () => {
      expect(() => {
        new RAWGClient({ apiKey: null as unknown as string });
      }).toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError when API key is whitespace', () => {
      expect(() => {
        new RAWGClient({ apiKey: '   ' });
      }).toThrow(AuthenticationError);
    });

    it('should initialize with valid API key', () => {
      const client = new RAWGClient({ apiKey: 'test-api-key-123' });
      expect(client).toBeDefined();
      expect(client.isInitialized()).toBe(true);
    });

    it('should initialize with custom baseUrl', () => {
      const client = new RAWGClient({
        apiKey: 'test-key',
        baseUrl: 'https://custom.api.com',
      });
      expect(client).toBeDefined();
    });

    it('should initialize with custom timeout', () => {
      const client = new RAWGClient({
        apiKey: 'test-key',
        timeout: 60000,
      });
      expect(client).toBeDefined();
    });
  });

  describe('Client Properties', () => {
    let client: RAWGClient;

    beforeEach(() => {
      client = new RAWGClient({ apiKey: 'test-api-key-123' });
    });

    it('should have games endpoint', () => {
      expect(client.games).toBeDefined();
    });

    it('should have platforms endpoint', () => {
      expect(client.platforms).toBeDefined();
    });

    it('should have genres endpoint', () => {
      expect(client.genres).toBeDefined();
    });

    it('should mask API key for security', () => {
      const masked = client.getApiKeyMasked();
      expect(masked).toContain('*');
      expect(masked).toMatch(/^test/);
      expect(masked).toMatch(/3$/);
    });

    it('should return isInitialized as true', () => {
      expect(client.isInitialized()).toBe(true);
    });
  });

  describe('Error Classes', () => {
    it('should create RAWGError with default properties', () => {
      const error = new RAWGError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('RAWGError');
      expect(error).toBeInstanceOf(RAWGError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should create RAWGError with status and code', () => {
      const error = new RAWGError('Test error', {
        status: 500,
        code: 'SERVER_ERROR',
        endpoint: '/games',
      });
      expect(error.status).toBe(500);
      expect(error.code).toBe('SERVER_ERROR');
      expect(error.endpoint).toBe('/games');
    });

    it('should create AuthenticationError', () => {
      const error = new AuthenticationError();
      expect(error.message).toBe('API key is missing or invalid');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error).toBeInstanceOf(AuthenticationError);
    });

    it('should create AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Custom auth error');
      expect(error.message).toBe('Custom auth error');
      expect(error).toBeInstanceOf(AuthenticationError);
    });

    it('should create NotFoundError with endpoint', () => {
      const error = new NotFoundError('Not found', '/games/999');
      expect(error.status).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.endpoint).toBe('/games/999');
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it('should create RateLimitError with retryAfter', () => {
      const error = new RateLimitError('Too many requests', { retryAfter: 60 });
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.retryAfter).toBe(60);
      expect(error).toBeInstanceOf(RateLimitError);
    });

    it('should create ValidationError with field', () => {
      const error = new ValidationError('Invalid value', { field: 'pageSize' });
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.field).toBe('pageSize');
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should create NetworkError', () => {
      const error = new NetworkError('Connection failed');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error).toBeInstanceOf(NetworkError);
    });

    it('should create ResponseParseError', () => {
      const error = new ResponseParseError();
      expect(error.code).toBe('RESPONSE_PARSE_ERROR');
      expect(error).toBeInstanceOf(ResponseParseError);
    });
  });

  describe('Error instanceof checks', () => {
    it('AuthenticationError should pass instanceof checks', () => {
      const error = new AuthenticationError();
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toBeInstanceOf(RAWGError);
      expect(error).toBeInstanceOf(Error);
    });

    it('NotFoundError should pass instanceof checks', () => {
      const error = new NotFoundError();
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error).toBeInstanceOf(RAWGError);
      expect(error).toBeInstanceOf(Error);
    });

    it('RateLimitError should pass instanceof checks', () => {
      const error = new RateLimitError();
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error).toBeInstanceOf(RAWGError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('New Endpoints (Phase 2)', () => {
    let client: RAWGClient;

    beforeEach(() => {
      client = new RAWGClient({ apiKey: 'test-api-key-123' });
    });

    it('should have developers endpoint', () => {
      expect(client.developers).toBeDefined();
    });

    it('should have publishers endpoint', () => {
      expect(client.publishers).toBeDefined();
    });

    it('should have tags endpoint', () => {
      expect(client.tags).toBeDefined();
    });

    it('should have stores endpoint', () => {
      expect(client.stores).toBeDefined();
    });

    it('developers endpoint should have list method', () => {
      expect(client.developers.list).toBeDefined();
      expect(typeof client.developers.list).toBe('function');
    });

    it('developers endpoint should have getById method', () => {
      expect(client.developers.getById).toBeDefined();
      expect(typeof client.developers.getById).toBe('function');
    });

    it('developers endpoint should have getBySlug method', () => {
      expect(client.developers.getBySlug).toBeDefined();
      expect(typeof client.developers.getBySlug).toBe('function');
    });

    it('publishers endpoint should have list method', () => {
      expect(client.publishers.list).toBeDefined();
      expect(typeof client.publishers.list).toBe('function');
    });

    it('publishers endpoint should have getById method', () => {
      expect(client.publishers.getById).toBeDefined();
      expect(typeof client.publishers.getById).toBe('function');
    });

    it('publishers endpoint should have getBySlug method', () => {
      expect(client.publishers.getBySlug).toBeDefined();
      expect(typeof client.publishers.getBySlug).toBe('function');
    });

    it('tags endpoint should have list method', () => {
      expect(client.tags.list).toBeDefined();
      expect(typeof client.tags.list).toBe('function');
    });

    it('tags endpoint should have getById method', () => {
      expect(client.tags.getById).toBeDefined();
      expect(typeof client.tags.getById).toBe('function');
    });

    it('tags endpoint should have getBySlug method', () => {
      expect(client.tags.getBySlug).toBeDefined();
      expect(typeof client.tags.getBySlug).toBe('function');
    });

    it('stores endpoint should have list method', () => {
      expect(client.stores.list).toBeDefined();
      expect(typeof client.stores.list).toBe('function');
    });

    it('stores endpoint should have getById method', () => {
      expect(client.stores.getById).toBeDefined();
      expect(typeof client.stores.getById).toBe('function');
    });

    it('stores endpoint should have getBySlug method', () => {
      expect(client.stores.getBySlug).toBeDefined();
      expect(typeof client.stores.getBySlug).toBe('function');
    });
  });
});