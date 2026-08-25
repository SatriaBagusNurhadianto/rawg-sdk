\`\`\`markdown
# Usage Examples

Comprehensive examples for using RAWG SDK.

## Table of Contents

- [Basic Setup](#basic-setup)
- [Games Examples](#games-examples)
- [Platforms Examples](#platforms-examples)
- [Genres Examples](#genres-examples)
- [Developers Examples](#developers-examples)
- [Publishers Examples](#publishers-examples)
- [Tags Examples](#tags-examples)
- [Stores Examples](#stores-examples)
- [Error Handling](#error-handling)
- [Advanced Patterns](#advanced-patterns)

## Basic Setup

\`\`\`typescript
import { RAWGClient } from 'rawg-sdk';

const client = new RAWGClient({
  apiKey: process.env.RAWG_API_KEY,
});
\`\`\`

## Games Examples

### List All Games

\`\`\`typescript
// Get first page of games
const response = await client.games.list({
  page: 1,
  pageSize: 20,
});

console.log(response.data.results); // Array of games
console.log(response.data.count);   // Total games available
\`\`\`

### Search Games

\`\`\`typescript
// Search for games
const results = await client.games.search({
  query: 'The Witcher',
  pageSize: 5,
});

results.data.results.forEach(game => {
  console.log(\`\${game.name} (\${game.released})\`);
});
\`\`\`

### Get Game Details

\`\`\`typescript
// Get by ID
const game = await client.games.getById(3328);
console.log(game.data.name);        // The Witcher 3: Wild Hunt
console.log(game.data.rating);      // 4.5
console.log(game.data.released);    // 2015-05-19

// Get by slug
const witcher = await client.games.getBySlug('the-witcher-3-wild-hunt');
console.log(witcher.data.platforms); // Array of platforms
\`\`\`

### Get Game Screenshots

\`\`\`typescript
const screenshots = await client.games.getScreenshots(3328);

screenshots.data.results.forEach(shot => {
  console.log(shot.image);
});
\`\`\`

### Get Game Trailers

\`\`\`typescript
const trailers = await client.games.getTrailers(3328);

trailers.data.results.forEach(trailer => {
  console.log(\`\${trailer.name}: \${trailer.data.max}\`);
});
\`\`\`

## Platforms Examples

### List All Platforms

\`\`\`typescript
const platforms = await client.platforms.list();

platforms.data.results.forEach(platform => {
  console.log(platform.name); // PC, PlayStation 4, Xbox One, etc.
});
\`\`\`

### Get Platform Details

\`\`\`typescript
// By ID
const steam = await client.platforms.getById(4);
console.log(steam.data.name); // PC

// By slug
const ps4 = await client.platforms.getBySlug('playstation4');
console.log(ps4.data.name);
\`\`\`

## Genres Examples

### List All Genres

\`\`\`typescript
const genres = await client.genres.list();

genres.data.results.forEach(genre => {
  console.log(\`\${genre.name}: \${genre.games_count} games\`);
});
\`\`\`

### Get Genre Details

\`\`\`typescript
// By ID
const action = await client.genres.getById(4);
console.log(action.data.name); // Action

// By slug
const rpg = await client.genres.getBySlug('role-playing-games-rpg');
console.log(rpg.data.games_count);
\`\`\`

## Developers Examples

### List All Developers

\`\`\`typescript
const developers = await client.developers.list({
  pageSize: 10,
});

developers.data.results.forEach(dev => {
  console.log(\`\${dev.name}: \${dev.games_count} games\`);
});
\`\`\`

### Get Developer Details

\`\`\`typescript
// By ID
const cdpr = await client.developers.getById(4);
console.log(cdpr.data.name); // CD Projekt Red

// By slug
const rockstar = await client.developers.getBySlug('rockstar-games');
console.log(rockstar.data.description);
\`\`\`

## Publishers Examples

### List All Publishers

\`\`\`typescript
const publishers = await client.publishers.list({
  pageSize: 15,
});

publishers.data.results.forEach(pub => {
  console.log(pub.name);
});
\`\`\`

### Get Publisher Details

\`\`\`typescript
// By ID
const ea = await client.publishers.getById(1);
console.log(ea.data.name); // Electronic Arts

// By slug
const ubi = await client.publishers.getBySlug('ubisoft');
console.log(ubi.data.games_count);
\`\`\`

## Tags Examples

### List All Tags

\`\`\`typescript
const tags = await client.tags.list();

tags.data.results.forEach(tag => {
  console.log(\`\${tag.name}: \${tag.games_count} games\`);
});
\`\`\`

### Get Tag Details

\`\`\`typescript
// By ID
const singleplayer = await client.tags.getById(1);
console.log(singleplayer.data.name);

// By slug
const multiplayer = await client.tags.getBySlug('multiplayer');
console.log(multiplayer.data.games_count);
\`\`\`

## Stores Examples

### List All Stores

\`\`\`typescript
const stores = await client.stores.list();

stores.data.results.forEach(store => {
  console.log(\`\${store.name}: \${store.domain}\`);
});
\`\`\`

### Get Store Details

\`\`\`typescript
// By ID
const steam = await client.stores.getById(1);
console.log(steam.data.name); // Steam

// By slug
const epic = await client.stores.getBySlug('epic-games-store');
console.log(epic.data.domain); // epicgames.com
\`\`\`

## Error Handling

### Handle Different Error Types

\`\`\`typescript
import {
  RAWGError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
  ResponseParseError,
} from 'rawg-sdk';

async function getGameSafely(gameId: number) {
  try {
    const game = await client.games.getById(gameId);
    return game.data;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed - check your API key');
    } else if (error instanceof NotFoundError) {
      console.error(\`Game with ID \${gameId} not found\`);
    } else if (error instanceof RateLimitError) {
      console.error(\`Rate limited. Wait \${error.retryAfter}s before retrying\`);
    } else if (error instanceof ValidationError) {
      console.error(\`Validation error on field: \${error.field}\`);
    } else if (error instanceof NetworkError) {
      console.error('Network error - check your connection');
    } else if (error instanceof ResponseParseError) {
      console.error('Failed to parse API response');
    } else if (error instanceof RAWGError) {
      console.error(\`API Error: \${error.message}\`);
    }
    return null;
  }
}
\`\`\`

## Advanced Patterns

### Paginating Through Results

\`\`\`typescript
async function getAllGames() {
  const allGames = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await client.games.list({
      page,
      pageSize: 40,
    });

    allGames.push(...response.data.results);
    
    // Check if there are more pages
    hasMore = response.data.next !== null;
    page++;
  }

  return allGames;
}

// Usage
const games = await getAllGames();
console.log(\`Total games fetched: \${games.length}\`);
\`\`\`

### Retry with Exponential Backoff

\`\`\`typescript
import { RateLimitError } from 'rawg-sdk';

async function fetchWithRetry(
  fn: () => Promise<any>,
  maxRetries = 3,
  delayMs = 1000
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof RateLimitError && attempt < maxRetries - 1) {
        const delay = delayMs * Math.pow(2, attempt);
        console.log(\`Rate limited. Retrying in \${delay}ms...\`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Usage
const game = await fetchWithRetry(() => 
  client.games.getById(3328)
);
\`\`\`

### Batch Operations

\`\`\`typescript
async function getMultipleGames(gameIds: number[]) {
  const games = await Promise.all(
    gameIds.map(id => 
      client.games.getById(id)
        .then(res => res.data)
        .catch(err => {
          console.error(\`Failed to fetch game \${id}:\`, err.message);
          return null;
        })
    )
  );

  return games.filter(game => game !== null);
}

// Usage
const games = await getMultipleGames([3328, 5286, 13633]);
\`\`\`

### Cache Results

\`\`\`typescript
const gameCache = new Map();

async function getGameCached(gameId: number) {
  if (gameCache.has(gameId)) {
    console.log('Returning cached result');
    return gameCache.get(gameId);
  }

  const response = await client.games.getById(gameId);
  gameCache.set(gameId, response.data);
  return response.data;
}

// Usage
const game1 = await getGameCached(3328); // API call
const game2 = await getGameCached(3328); // From cache
\`\`\`
\`\`\`