/**
 * Serialize object to query string
 * Handles arrays, null values, and nested objects
 */
export function serializeQueryParams(
  params: Record<string, unknown>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      // Serialize arrays as comma-separated values
      searchParams.append(key, value.join(','));
    } else if (typeof value === 'object') {
      // Skip objects (shouldn't happen in query params)
      continue;
    } else if (typeof value === 'boolean') {
      // Convert boolean to string
      searchParams.append(key, value ? 'true' : 'false');
    } else {
      // String or number
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Normalize ordering parameter
 * Handles both 'field' and '-field' syntax
 */
export function normalizeOrdering(ordering: string): string {
  if (!ordering) {
    return ordering;
  }

  // Already properly formatted
  if (ordering.startsWith('-') || !ordering.includes('-')) {
    return ordering;
  }

  // Invalid format, return as-is and let API handle error
  return ordering;
}

/**
 * Format date range as required by RAWG API
 * Format: YYYY-MM-DD,YYYY-MM-DD
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${startDate},${endDate}`;
}

/**
 * Escape search query for safe API use
 */
export function escapeSearchQuery(query: string): string {
  return query.trim();
}

/**
 * Convert camelCase to snake_case for API parameters
 * This is useful for converting TypeScript parameter names to API format
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Build complete query string with optional API key
 */
export function buildQueryString(
  params: Record<string, unknown>,
  apiKey?: string,
): string {
  const allParams = {
    ...params,
    ...(apiKey && { key: apiKey }),
  };

  return serializeQueryParams(allParams);
}