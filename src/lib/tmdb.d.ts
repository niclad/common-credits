interface BaseCredit {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
}

interface Cast extends BaseCredit {
  character: string;
  order: number;
}

interface MovieCast extends Cast {
  cast_id: number; 
}

interface Crew extends BaseCredit {
  department: string;
  job: string;
}

type GuestStar = Cast;

interface MovieCredits {
  id: number;
  cast: MovieCast[];
  crew: Crew[];
}

interface TvCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

interface EpisodeCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
  guest_stars: GuestStar[];
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

// Statuses for a production
enum Status {
  announced = 'Announced',
  cancelled = 'Cancelled' | 'Canceled',
  ended = 'Ended',
  inProduction = 'In Production',
  pilot = 'Pilot',
  planned = 'Planned',
  postProduction = 'Post Production',
  released = 'Released',
  returningSeries = 'Returning Series',
  rumored = 'Rumored',
}

export {
  BaseCredit,
  Cast,
  Crew,
  GuestStar,
  MovieCast,
  MovieCredits,
  EpisodeCredits,
  Season,
  TvCredits
}

/**
 * Don't export these interfaces... They would be used for a broken endpoint
 */

interface TvRole {
  credit_id: string;
  character: string;
  episode_count: number;
}

interface TvJob {
  credit_id: string;
  job: string;
  episode_count: number;
}

interface TvCast extends BaseCredit {
  roles: TvRole[];
  total_episode_count: number;
  order: number;
}

interface TvCrew extends BaseCredit {
  jobs: TvJob[];
  department: string;
  total_episode_count: number;
}
