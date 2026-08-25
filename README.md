```markdown
# RAWG SDK

A fully-typed TypeScript SDK for the [RAWG Video Games Database API](https://rawg.io/apireference).

[![npm version](https://img.shields.io/npm/v/rawg-sdk.svg)](https://www.npmjs.com/package/rawg-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- **Complete API Coverage** - All RAWG endpoints (Games, Platforms, Genres, Developers, Publishers, Tags, Stores)
- **Fully Typed** - 100% TypeScript with full type safety and IntelliSense
- **Easy to Use** - Simple, intuitive API with sensible defaults
- **Performant** - Built-in request caching and timeout handling
- **Error Handling** - Comprehensive error classes for better debugging
- **Small Bundle** - Only 11.17 KB (minified, gzipped)
- **Well Tested** - 42+ comprehensive unit tests

## Installation

\`\`\`bash
npm install rawg-sdk
\`\`\`

## Quick Start

\`\`\`typescript
import { RAWGClient } from 'rawg-sdk';

// Initialize client with API key
const client = new RAWGClient({
  apiKey: 'your-api-key-here',
});

// Get list of games
const response = await client.games.list({ page: 1, pageSize: 10 });
console.log(response.data.results);

// Search for a specific game
const searchResults = await client.games.search({
  query: 'The Witcher 3',
  pageSize: 5,
});
console.log(searchResults.data.results);

// Get game by ID
const game = await client.games.getById(3328);
console.log(game.data);

// Get game by slug
const witcher = await client.games.getBySlug('the-witcher-3-wild-hunt');
console.log(witcher.data);
\`\`\`

## Getting Your API Key

1. Visit [https://rawg.io/apireference](https://rawg.io/apireference)
2. Sign up or log in to your account
3. Copy your API key from the dashboard
4. Use it to initialize the SDK

## Configuration

\`\`\`typescript
const client = new RAWGClient({
  apiKey: 'your-api-key',           // Required
  baseUrl: 'https://api.rawg.io/api', // Optional (default shown)
  timeout: 30000,                     // Optional timeout in ms (default shown)
});
\`\`\`

## Available Endpoints

### Games Endpoint

\`\`\`typescript
// List all games
await client.games.list({ page: 1, pageSize: 20 });

// Search games
await client.games.search({ query: 'zelda', pageSize: 10 });

// Get game by ID
await client.games.getById(3328);

// Get game by slug
await client.games.getBySlug('the-witcher-3-wild-hunt');

// Get game screenshots
await client.games.getScreenshots(3328);

// Get game trailers/videos
await client.games.getTrailers(3328);
\`\`\`

### Platforms Endpoint

\`\`\`typescript
// List all platforms
await client.platforms.list({ page: 1, pageSize: 20 });

// Get platform by ID
await client.platforms.getById(1);

// Get platform by slug
await client.platforms.getBySlug('pc');
\`\`\`

### Genres Endpoint

\`\`\`typescript
// List all genres
await client.genres.list({ page: 1, pageSize: 20 });

// Get genre by ID
await client.genres.getById(4);

// Get genre by slug
await client.genres.getBySlug('action');
\`\`\`

### Developers Endpoint

\`\`\`typescript
// List all developers
await client.developers.list({ page: 1, pageSize: 20 });

// Get developer by ID
await client.developers.getById(4);

// Get developer by slug
await client.developers.getBySlug('cd-projekt-red');
\`\`\`

### Publishers Endpoint

\`\`\`typescript
// List all publishers
await client.publishers.list({ page: 1, pageSize: 20 });

// Get publisher by ID
await client.publishers.getById(1);

// Get publisher by slug
await client.publishers.getBySlug('electronic-arts');
\`\`\`

### Tags Endpoint

\`\`\`typescript
// List all tags
await client.tags.list({ page: 1, pageSize: 20 });

// Get tag by ID
await client.tags.getById(1);

// Get tag by slug
await client.tags.getBySlug('singleplayer');
\`\`\`

### Stores Endpoint

\`\`\`typescript
// List all stores
await client.stores.list({ page: 1, pageSize: 20 });

// Get store by ID
await client.stores.getById(1);

// Get store by slug
await client.stores.getBySlug('steam');
\`\`\`

## Error Handling

The SDK provides comprehensive error classes for better error handling:

\`\`\`typescript
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
  ResponseParseError,
} from 'rawg-sdk';

try {
  const game = await client.games.getById(999999);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof NotFoundError) {
    console.error('Game not found');
  } else if (error instanceof RateLimitError) {
    console.error(\`Rate limited. Retry after \${error.retryAfter}s\`);
  } else if (error instanceof ValidationError) {
    console.error(\`Validation error: \${error.field}\`);
  } else if (error instanceof NetworkError) {
    console.error('Network error occurred');
  } else if (error instanceof ResponseParseError) {
    console.error('Failed to parse API response');
  }
}
\`\`\`

## Response Format

All endpoints return responses with the following structure:

\`\`\`typescript
interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Example usage
const response = await client.games.list();
console.log(response.data.results);  // Array of games
console.log(response.status);         // HTTP status (200, 404, etc)
console.log(response.headers);        // Response headers
\`\`\`

## Pagination

Paginate through results using \`page\` and \`pageSize\` parameters:

\`\`\`typescript
// Get first page (20 items)
const page1 = await client.games.list({ page: 1, pageSize: 20 });

// Get second page
const page2 = await client.games.list({ page: 2, pageSize: 20 });

// Access pagination info
console.log(page1.data.count);      // Total items
console.log(page1.data.next);       // Next page URL
console.log(page1.data.previous);   // Previous page URL
\`\`\`

## Rate Limiting

The RAWG API has rate limits. Handle rate limiting:

\`\`\`typescript
import { RateLimitError } from 'rawg-sdk';

try {
  const games = await client.games.list();
} catch (error) {
  if (error instanceof RateLimitError) {
    const retryAfter = error.retryAfter || 60;
    console.log(\`Wait \${retryAfter} seconds before retrying\`);
    // Implement exponential backoff or queue system
  }
}
\`\`\`

## TypeScript Support

The SDK is built with TypeScript and includes full type definitions:

\`\`\`typescript
import { RAWGClient, type Game, type GameDetail } from 'rawg-sdk';

const client = new RAWGClient({ apiKey: 'your-key' });

// Full type inference
const response = await client.games.getById(3328);
const game: GameDetail = response.data; // TypeScript knows the exact type

// Auto-completion in IDE
game.name;           // ✓ TypeScript autocomplete works
game.rating;         // ✓ Full IntelliSense support
game.invalid_prop;   // ✗ TypeScript error - property doesn't exist
\`\`\`

## API Quotas

The free tier of RAWG API has rate limits:

- **20,000 requests per month** for free users
- **Rate limit:** 60 requests per minute

To check your quota and remaining requests, monitor error responses and implement appropriate retry logic.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © [Satria Bagus Nurhadianto](https://github.com/SatriaBagusNurhadianto)

## Support

- [RAWG API Documentation](https://rawg.io/apireference)
- [Report Issues](https://github.com/SatriaBagusNurhadianto/rawg-sdk/issues)
- [Discussions](https://github.com/SatriaBagusNurhadianto/rawg-sdk/discussions)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
\`\`\`