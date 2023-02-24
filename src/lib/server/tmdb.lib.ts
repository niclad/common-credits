import type { Cast, Crew, GuestStar, MovieCast, MovieCredits, EpisodeCredits, Season, TvCredits } from '$lib/tmdb.d';
import { MediaType, type QueryParams, type Credits, type MediaCast, type Tv, type Movie, type BasicMedia, type MediaCrew, type CompositeMedia } from '$lib/media.d';
import { BASE_TMDB_API_URL, TMDB_API_VERSION } from '$lib/tmdb.config';
import { TMDB_API_KEY } from '$env/static/private';
import axios from 'axios';
import { error } from '@sveltejs/kit';

const API_BASE_URL = `${BASE_TMDB_API_URL}/${TMDB_API_VERSION}`;

/**
 * Get the list of credits that appear in ALL of the given titles
 * @param titles List of titles to get credits for
 * @returns A list of all cast and crew members that appear in all titles, with their roles in each title
 */
async function getAllMediaCredits(titles: QueryParams[]): Promise<CompositeMedia> {
  let commonCast: MediaCast[] = [];
  let commonCrew: MediaCrew[] = [];
  let allTitles: BasicMedia[] = [];

  for (const title of titles) {
    let titleInfo: { details: Tv | Movie, credits: MovieCredits | TvCredits };
    const titleType: string = title.mediaType === MediaType.Movie ? 'movie' : 'tv';

    // If given a movie, get the credits for that movie
    if (title.mediaType === MediaType.Movie) {
      titleInfo = await getMovieCredits(title.id);
    } else if (title.mediaType === MediaType.TV) {
      titleInfo = await getTVCredits(title.id);
    } else {
      throw error(400, `Invalid media type ${title.mediaType} for media with ID ${title.id}.`);
    }

    // Push the title details to the list of all titles
    allTitles.push(titleInfo.details);

    // If this is the first title, just set the common cast and crew to the credits for this title
    if (commonCast.length === 0 && commonCrew.length === 0) {
      commonCast = titleInfo.credits.cast.map((castMember): MediaCast => {
        return {
          type: 'cast',
          adult: castMember.adult,
          gender: castMember.gender,
          id: castMember.id,
          known_for_department: castMember.known_for_department,
          name: castMember.name,
          original_name: castMember.original_name,
          popularity: castMember.popularity,
          profile_path: castMember.profile_path,
          credit_id: castMember.credit_id,
          characters: {
            [`${title.id}${titleType}`]: castMember.character,
          },
        }
      });

      commonCrew = titleInfo.credits.crew.map((crewMember): MediaCrew => {
        return {
          type: 'crew',
          adult: crewMember.adult,
          gender: crewMember.gender,
          id: crewMember.id,
          known_for_department: crewMember.known_for_department,
          name: crewMember.name,
          original_name: crewMember.original_name,
          popularity: crewMember.popularity,
          profile_path: crewMember.profile_path,
          credit_id: crewMember.credit_id,
          department: crewMember.department,
          jobs: {
            [`${title.id}${titleType}`]: crewMember.job,
          },
        }
      });
      continue;
    }

    // Otherwise, filter out the cast and crew that don't appear in all titles and append
    // roles for common credit members
    for (let i = 0; i < commonCast.length; i++) {
      const currCastMember = titleInfo.credits.cast.find((castMember) => castMember.id === commonCast[i].id);

      if (!currCastMember) {
        delete commonCast[i]; // This will leave the element as undefined, so we'll filter it out later
        continue;
      }

      commonCast[i].characters[`${title.id}${titleType}`] = currCastMember.character;
    }

    for (let i = 0; i < commonCrew.length; i++) {
      const currCrewMember = titleInfo.credits.crew.find((crewMember) => crewMember.id === commonCrew[i].id);

      if (!currCrewMember) {
        delete commonCrew[i]; // This will leave the element as undefined, so we'll filter it out later
        continue;
      }

      commonCrew[i].jobs[`${title.id}${titleType}`] = currCrewMember.job;
    }
  }

  // Filter empty elements out of the common cast and crew arrays
  commonCast = commonCast.filter((member) => member !== undefined);
  commonCrew = commonCrew.filter((member) => member !== undefined);

  return {
    cast: commonCast,
    crew: commonCrew,
    titles: allTitles,
  };
}

/**
 * Get the full credits for a TV show
 * @param id ID of a TV show to get the credits for
 * @returns The details of the TV show and the credits for the show
 */
async function getTVCredits(id: number): Promise<{ details: Tv, credits: TvCredits }> {
  // This will need to get ALL the credits for a TV show, on an epidode-by-episode basis...
  // Get the list of all episodes for the given TV show
  const tvDetailsUrl = `${API_BASE_URL}/tv/${id}`;
  let response;
  try {
    response = await axios.get(tvDetailsUrl, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
      }
    });
  } catch (err) {
    console.error(err);
    throw error(404, `TV show with ID ${id} could not be found.`);
  }

  const seasons = response.data?.seasons as Season[];
  if (!seasons) {
    throw error(404, `No seasons found for TV show with ID ${id}.`);
  }

  const details: Tv = {
    type: 'tv',
    id: id,
    name: response.data.name,
    posterPath: response.data.poster_path,
    releaseDate: response.data.first_air_date,
    lastAirDate: response.data.last_air_date,
    inProduction: response.data.in_production,
    voteAverage: response.data.vote_average,
  };

  let credits: TvCredits = {
    id: id,
    cast: [],
    crew: [],
  };

  // Loop through all seasons getting the credits for each episode
  for (const season of seasons) {
    if (season.season_number === 0) continue; // Skip "specials" seasons

    const sznCreditsUrl = `${API_BASE_URL}/tv/${id}/season/${season.season_number}`;
    let response;
    try {
      response = await axios.get(sznCreditsUrl, {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: 'credits',
          language: 'en-US',
        }
      });
    } catch (err) {
      throw error(404, `Season ${season.season_number} of TV show with ID ${id} could not be found.`);
    }

    // Get the primary credits for the season
    // Note: "primary" here means the actor is credited for every episode in the season
    //       i.e. not a guest star
    const primaryCredits = response.data?.credits;
    if (!primaryCredits) {
      throw error(404, `No credits found for season ${season.season_number} of TV show with ID ${id}.`);
    }

    // Get the list of episodes for the given season
    const episodes = response.data?.episodes;
    if (!episodes) {
      throw error(404, `No episodes found for season ${season.season_number} of TV show with ID ${id}.`);
    }

    // Loop through the primary credits, adding them to the TV show's credits...
    // Get the primary cast and add it to the TV show's cast
    for (const castMember of primaryCredits.cast) {
      if (credits.cast.some((member) => member.credit_id === castMember.credit_id)) continue;
      credits.cast.push(castMember);
    }

    // Get the primary crew and add it to the TV show's crew
    for (const crewMember of primaryCredits.crew) {
      if (credits.crew.some((member) => member.credit_id === crewMember.credit_id)) continue;
      credits.crew.push(crewMember);
    }

    // Loop through the episodes getting the credits for each episode
    for (const episode of episodes) {
      // Get the episode's cast
      for (const castMember of episode.guest_stars) {
        if (credits.cast.some((member) => member.credit_id === castMember.credit_id)) continue;
        credits.cast.push(castMember);
      }

      // Get the episode's crew
      for (const crewMember of episode.crew) {
        if (credits.crew.some((member) => member.credit_id === crewMember.credit_id)) continue;
        credits.crew.push(crewMember);
      }
    }
  }

  return {
    details: details,
    credits: {
      id: id,
      cast: credits.cast,
      crew: mergeDuplicates(credits.crew),
    }
  };
}

/**
 * Get a movie's cast and crew from TMDb.
 * @param id The ID of the movie to get credits for
 * @returns The credits for the movie with the given ID
 */
async function getMovieCredits(id: number): Promise<{ details: Movie, credits: MovieCredits }> {
  const url = `${API_BASE_URL}/movie/${id}`; // ?api_key=${TMDB_API_KEY}&language=en-US`;

  let response;
  try {
    // Attempt to get a movie's credits
    response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits',
        language: 'en-US',
      }
    });
  } catch (err) {
    // Otherwise, throw an error
    console.error(err);
    throw error(404, `Credits for movie with ID ${id} could not be found.`);
  }

  const details: Movie = {
    type: 'movie',
    id: id,
    name: response.data.title,
    posterPath: response.data.poster_path,
    releaseDate: response.data.release_date,
    voteAverage: response.data.vote_average,
  };

  // Merge duplicate members of the crew
  const crew = response.data.credits.crew;

  return {
    details: details,
    credits: {
      id: id,
      cast: response.data.credits.cast,
      crew: mergeDuplicates(crew)
    }
  };
}

/**
 * Merge members that appear more than once in a list of credits.
 * Note: Currently only supports lists of crew members.
 * @param members List of credits to merge duplicates from
 * @returns List with only unique members
 */
function mergeDuplicates(crew: Crew[]): Crew[] {
  const merged: Crew[] = [];

  for (const crewMember of crew) {
    const existing = merged.find((member) => member.id === crewMember.id);
    if (existing) {
      existing.job = `${existing.job}, ${crewMember.job}`;
    } else {
      merged.push(crewMember);
    }
  }

  return merged;
}

function searchTMDb(search: string): Promise<any[]> {
  const url = `${API_BASE_URL}/search/multi`;

  return axios.get(url, {
    params: {
      api_key: TMDB_API_KEY,
      query: search,
      language: 'en-US',
    }
  })
    .then((response) => {
      const results = response.data.results as any[];
      return results.filter(
        (result) => { return result.media_type === 'movie' || result.media_type === 'tv'; }
      );
    })
    .catch((err) => {
      console.error(err);
      throw error(404, `No results found for "${search}".`);
    });
}

export { 
  getAllMediaCredits, 
  searchTMDb 
}