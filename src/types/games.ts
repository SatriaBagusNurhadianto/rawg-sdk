import type {
  PlatformInfo,
  CompanyInfo,
  GenreInfo,
  TagInfo,
  StoreInfo,
  Rating,
} from './common';

/**
 * Game object from RAWG API
 */
export interface Game {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string | null;
  description_raw: string | null;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  background_image_additional: string | null;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
  };
  playtime: number;
  screenshot_count: number;
  movies_count: number;
  creators_count: number;
  media_count: number;
  genres: GenreInfo[];
  stores: Array<{
    id: number;
    url: string;
    store: StoreInfo;
  }>;
  clip: null | {
    clip: string;
    clips: Record<string, string>;
    video: string;
    preview: string;
  };
  platforms: Array<{
    platform: PlatformInfo;
    released_at: string | null;
    requirements_en: {
      minimum: string | null;
      recommended: string | null;
    } | null;
    requirements_ru: {
      minimum: string | null;
      recommended: string | null;
    } | null;
  }>;
  developers: CompanyInfo[];
  publishers: CompanyInfo[];
  is_favorite: boolean;
  metacritic: number | null;
  metacritic_url: string | null;
  parent_platforms: Array<{
    platform: PlatformInfo;
  }>;
  genres_ids: number[];
  stores_ids: number[];
  tags: TagInfo[];
  esrb_rating: {
    id: number;
    slug: string;
    name: string;
  } | null;
  user_game: {
    id: number;
    game: number;
    user: number;
    finished: boolean;
    playtime: number;
    status: number | null;
  } | null;
  reviews_count: number;
  saturated: boolean;
  reddit_url: string;
  reddit_name: string;
  twitch_count: number;
  youtube_count: number;
  reactions: Record<string, number>;
  slug_url: string;
}

/**
 * Game detail - extended version of Game (from single game endpoint)
 */
export interface GameDetail extends Game {
  website: string | null;
  achievements_count: number;
  series_count: number;
  community_rating: number;
  alternative_names: string[];
}

/**
 * Game screenshot
 */
export interface GameScreenshot {
  id: number;
  image: string;
  is_deleted: boolean;
  width: number;
  height: number;
}

/**
 * Game trailer/video
 */
export interface GameTrailer {
  id: number;
  name: string | null;
  preview: string;
  data: {
    [key: string]: string;
  };
}

/**
 * Query parameters for listing games
 */
export interface GamesListParams {
  /** Page number */
  page?: number;
  /** Results per page (1-40, default 20) */
  pageSize?: number;
  /** Filter by genre */
  genres?: number | number[];
  /** Filter by platform */
  platforms?: number | number[];
  /** Filter by developer */
  developers?: number | number[];
  /** Filter by publisher */
  publishers?: number | number[];
  /** Filter by release date range (YYYY-MM-DD,YYYY-MM-DD) */
  dates?: string;
  /** Exclude collection ids */
  excludeCollection?: number;
  /** Filter by minimum rating */
  minRating?: number;
  /** Filter by maximum rating */
  maxRating?: number;
  /** Exclude platforms */
  excludePlatforms?: number | number[];
  /** Filter by store */
  stores?: number | number[];
  /** Order results */
  ordering?: 'name' | '-name' | 'released' | '-released' | 'rating' | '-rating' | 'added' | '-added';
  /** Search by name */
  search?: string;
  /** Search exact match */
  searchExact?: boolean;
  /** Filter by parent platform */
  parentPlatforms?: number | number[];
  /** Filter by ESRB rating */
  esrbRatings?: number | number[];
}

/**
 * Query parameters for searching games
 */
export interface GamesSearchParams extends Omit<GamesListParams, 'search'> {
  /** Search query */
  search: string;
}