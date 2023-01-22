interface BaseMedia {
  posterPath: string;
  id: number;
  name: string;
  releaseDate: string;
  voteAverage: number;
}

/**
 * Minimum info needed for a movie
 */
interface Movie extends BaseMedia {
  // Note to self: using this feels hacky though I can't for 
  // the life of me work out how to use this as a class... :(
  type: "movie"; 
}

/**
 * Minimum info needed for a tv show
*/
interface Tv extends BaseMedia {
  type: "tv";
  lastAirDate: string;
  inProduction: boolean;
}

// Union of all BaseMedia types
type BasicMedia = Movie | Tv;

/**
 * Common properties between a title's cast or crew members
 */
interface Person {
  id: number;
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string | null;
}

/**
 * A title's cast member
 */
interface MediaCast extends Person {
  type: "cast";
  character: string;
}

/**
 * A title's crew member
 */
interface MediaCrew extends Person {
  type: "crew";
  original_name: string;
  department: string;
  job: string;
}

/**
 * A title's credits
 */
interface Credits {
  id: number;
  cast: MediaCast[];
  crew: MediaCrew[];
}

interface CompositeMedia {
  titles: BasicMedia[];
  cast: MediaCast[];
  crew: MediaCrew[];
}

// Only two media types that exist in TMDb
enum MediaType {
  Movie,
  TV,
}

// The query parameters received from front-end request
interface QueryParams {
  mediaType: MediaType;
  id: number;
}

// Statuses for a BasicMedia's production
enum Status {
  released = 'Released',
  inProduction = 'In Production',
  announced = 'Announced',
  ended = 'Ended',
  postProduction = 'Post Production',
}

export {
  BasicMedia,
  CompositeMedia,
  Credits,
  MediaCast,
  MediaCrew,
  MediaType,
  Movie,
  Status,
  Tv,
  QueryParams,
}