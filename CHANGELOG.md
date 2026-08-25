# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-25

### Added

#### Core Features
- Initial release of RAWG SDK
- Full TypeScript support with complete type definitions
- RAWGClient main class with configurable options (apiKey, baseUrl, timeout)
- Comprehensive error handling with 7 custom error classes:
  - RAWGError (base class)
  - AuthenticationError
  - ValidationError
  - NotFoundError
  - RateLimitError
  - NetworkError
  - ResponseParseError

#### Phase 1: Core Endpoints
- Games Endpoint
  - list() - Get paginated list of games
  - search() - Search games by query
  - getById() - Get game details by ID
  - getBySlug() - Get game details by slug
  - getScreenshots() - Get game screenshots
  - getTrailers() - Get game videos/trailers

- Platforms Endpoint
  - list() - Get all platforms
  - getById() - Get platform by ID
  - getBySlug() - Get platform by slug

- Genres Endpoint
  - list() - Get all genres
  - getById() - Get genre by ID
  - getBySlug() - Get genre by slug

#### Phase 2: Extended Endpoints
- Developers Endpoint
  - list() - Get all developers
  - getById() - Get developer by ID
  - getBySlug() - Get developer by slug

- Publishers Endpoint
  - list() - Get all publishers
  - getById() - Get publisher by ID
  - getBySlug() - Get publisher by slug

- Tags Endpoint
  - list() - Get all tags
  - getById() - Get tag by ID
  - getBySlug() - Get tag by slug

- Stores Endpoint
  - list() - Get all stores
  - getById() - Get store by ID
  - getBySlug() - Get store by slug

#### Phase 3: Documentation
- Comprehensive README.md with feature overview, installation, and usage guide
- EXAMPLES.md with 50+ code examples for all endpoints
- CONTRIBUTING.md with contribution guidelines and development setup
- Professional API reference documentation

#### Phase 4: CI/CD & Package Management
- GitHub Actions CI workflow
  - Automated testing on Node 18 and 20
  - Linting and type checking
  - Build verification
  - Auto-publish to npm on main branch push
- Complete package.json metadata
- Support for ESM and CommonJS exports

### Technical Details

#### Type Definitions
- Full TypeScript support with 20.46 KB type definitions
- Complete interface definitions for all API responses
- Generic HttpResponse wrapper for type-safe responses
- Proper error type inference

#### Testing
- 42 comprehensive unit tests covering:
  - Client initialization and configuration
  - API key validation
  - Error class behavior
  - All endpoint methods
  - Error handling patterns
- 100% test pass rate
- Vitest framework with coverage support

#### Build & Bundle
- 11.17 KB minified ESM bundle
- TypeScript compilation to ES2020 target
- Source maps included for debugging
- Tree-shakeable exports

#### Quality Assurance
- ESLint configuration for code quality
- TypeScript strict mode enabled
- Pre-publish hooks for quality verification
- Node 18+ engine requirement

### Endpoints Summary

Total: 7 endpoints with 22 methods
- Games (6 methods)
- Platforms (3 methods)
- Genres (3 methods)
- Developers (3 methods)
- Publishers (3 methods)
- Tags (3 methods)
- Stores (1 method)

### Error Classes

All error classes extend the base RAWGError:

```typescript
- AuthenticationError - Invalid API key
- ValidationError - Invalid parameters (with field info)
- NotFoundError - Resource not found (with endpoint info)
- RateLimitError - Rate limit exceeded (with retryAfter)
- NetworkError - Network connection issues
- ResponseParseError - Failed to parse API response

```API Response Format
All endpoints return standardized HttpResponse:
interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

```Configuration Options
interface RAWGClientConfig {
  apiKey: string;              // Required: RAWG API key
  baseUrl?: string;            // Optional: Default https://api.rawg.io/api
  timeout?: number;            // Optional: Default 30000ms
}
```

Features Implemented
- Request/response type safety
- Automatic error classification
- Rate limit handling
- Request timeout management
- API key masking for security
- Pagination support
- Full TypeScript inference
``

Browser & Node Support
- Node.js 18.0.0 or higher
- Full ES module support
- CommonJS compatible via build
``

Known Limitations
- Rate limiting: 60 requests per minute (free tier)
- Monthly quota: 20,000 requests (free tier)
- No built-in request caching (can be implemented by users)
- No automatic retry logic (can be implemented by users)
``

Future Roadmap
Potential improvements for future versions:
- Request caching mechanism
- Automatic retry with exponential backoff
- Batch operations helper
- WebSocket support for real-time updates
- Additional RAWG API endpoints as they become available

Version Numbering
```
This project follows Semantic Versioning (SemVer):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards-compatible manner
- PATCH version for backwards-compatible bug fixes

Migration Guide
```
From 0.x to 1.0.0
This is the first major release. If upgrading from earlier versions:
- All existing APIs remain the same
- New endpoints added (Developers, Publishers, Tags, Stores)
- Error handling improved with more specific error classes
- TypeScript types enhanced for better IDE support
