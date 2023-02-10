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
// Take note! This is important!
class MovieImpl implements Movie {
  constructor(
    public posterPath: string,
    public id: number,
    public name: string,
    public releaseDate: string,
    public voteAverage: number,
  ) { 
    this.type = "movie";
    this.posterPath = posterPath;
    this.id = id;
    this.name = name;
    this.releaseDate = releaseDate;
    this.voteAverage = voteAverage;
  }
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
  character: string | string[];
}

/**
 * A title's crew member
 */
interface MediaCrew extends Person {
  type: "crew";
  original_name: string;
  department: string;
  job: string | string[];
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