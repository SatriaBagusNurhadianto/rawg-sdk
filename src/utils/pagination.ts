export interface FetchAllOptions {
  maxPages?: number;
  maxItems?: number;
  pageSize?: number;
}

export interface FetchAllResult<T> {
  items: T[];
  truncated: boolean;
}

/**
 * Generic pagination helper. `fetchPage(page, pageSize)` should return
 * the items for that page (or a paginated response). Caller decides when
 * there are no more pages (empty page).
 */
export async function fetchAll<T>(
  fetchPage: (page: number, pageSize: number) => Promise<T[]>,
  options: FetchAllOptions = {},
): Promise<FetchAllResult<T>> {
  const maxPages = options.maxPages ?? 10;
  const maxItems = options.maxItems ?? 2000;
  const pageSize = options.pageSize ?? 40;

  const items: T[] = [];
  let truncated = false;

  for (let page = 1; page <= maxPages; page++) {
    const pageItems = await fetchPage(page, pageSize);
    if (!pageItems || pageItems.length === 0) break;

    for (const item of pageItems) {
      if (items.length >= maxItems) {
        truncated = true;
        break;
      }
      items.push(item);
    }
    if (truncated) break;
    if (pageItems.length < pageSize) break;
  }

  if (items.length >= maxItems && !truncated) {
    // hit cap exactly on boundary
    truncated = true;
  }

  return { items, truncated };
}
