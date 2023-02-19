import type { BaseCredit } from "./tmdb.d";

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

/**
 * Info related to a cast member's role in a TV show
 */
interface TvRole {
  credit_id: string;
  character: string;
  episode_count: number;
}

// Union of all BaseMedia types
type BasicMedia = Movie | Tv;

interface Role {
  [id: string]: string;
}
// interface Role {
//   id: number;       // ID of the title the role is associated with
//   roles: string[];  // List of the role's names
// }

/**
 * A title's cast member
 */
interface MediaCast extends BaseCredit {
  type: "cast";
  characters: Role; // All the actor's characters
}

/**
 * A title's crew member
 */
interface MediaCrew extends BaseCredit {
  type: "crew";
  department: string;
  jobs: Role;
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

export {
  BasicMedia,
  CompositeMedia,
  Credits,
  MediaCast,
  MediaCrew,
  MediaType,
  Movie,
  Tv,
  TvRole,
  QueryParams,
}