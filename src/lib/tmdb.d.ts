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

interface EpisodeCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
  guest_stars: GuestStar[];
}

export {
  Cast,
  Crew,
  GuestStar,
  MovieCast,
  MovieCredits,
  EpisodeCredits,
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

interface TvCredits {
  // Note: Currently the TMDb aggregate credits endpoint fails
  // to correctly return all credits for a TV show.
  id: number;
  cast: TvCast[];
  crew: TvCrew[];
}