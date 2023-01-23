import * as Media from '$lib/media.d';
import { TMDB_API_KEY } from '$env/static/private';
import axios from 'axios';
import { instanceOfMediaCast } from '$lib/media.lib';

async function getAllMediaCredits(titles: Media.QueryParams[]): Promise<Media.CompositeMedia> {
  const apiBaseUrl = 'https://api.themoviedb.org';
  const apiVer = '3';
  let allTitles: Media.BasicMedia[] = [];
  let commonCast: Media.MediaCast[] = [];
  let commonCrew: Media.MediaCrew[] = [];
  var castMap: Map<number, number> = new Map();
  var crewMap: Map<number, number> = new Map();

  // Loop through all the given titles
  for (var i in titles) {
    const title: Media.QueryParams = titles[i];
    const mediaType = title.mediaType === Media.MediaType.Movie ? 'movie' : 'tv';
    const queryParams: string = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'en-US' }).toString();
    const creditsUrl = `${apiBaseUrl}/${apiVer}/${mediaType}/${title.id}/credits?${queryParams}`;

    // Get the credits for the current title
    let response = await axios.get(creditsUrl);
    const creditInfo: Media.Credits = response.data;

    // Parse the cast
    // const creditCast: Media.MediaCast[] = creditInfo.cast;
    const creditCast: Media.MediaCast[] = Array.from(creditInfo.cast, (castMember): Media.MediaCast => {
      return {
        type: 'cast',
        id: castMember.id,
        known_for_department: castMember.known_for_department,
        name: castMember.name,
        popularity: castMember.popularity,
        profile_path: castMember.profile_path,
        character: castMember.character,
      };
    });

    castMap = countOccurance(creditCast, castMap);


    // Parse the crew
    // let creditCrew: Media.MediaCrew[] = creditInfo.crew;
    let creditCrew: Media.MediaCrew[] = Array.from(creditInfo.crew, (crewMember): Media.MediaCrew => {
      return {
        type: 'crew',
        id: crewMember.id,
        known_for_department: crewMember.known_for_department,
        name: crewMember.name,
        popularity: crewMember.popularity,
        profile_path: crewMember.profile_path,
        original_name: crewMember.original_name,
        department: crewMember.department,
        job: crewMember.job,
      };
    });
    creditCrew = mergeDuplicates(creditCrew);
    crewMap = countOccurance(creditCrew, crewMap);

    // Remove singular entries
    // ... For cast
    commonCast = creditCast.filter((castMember) => multiOccurance(castMember, castMap));

    // ... For crew
    commonCrew = creditCrew.filter((crewMember) => multiOccurance(crewMember, crewMap));

    // Get the title details
    const detailsUrl = `${apiBaseUrl}/${apiVer}/${mediaType}/${creditInfo.id}?${queryParams}`;
    response = await axios.get(detailsUrl);
    const titleDetails = response.data;

    // Create the title object
    const titleInfo: Media.BasicMedia = {
      type: mediaType,
      posterPath: titleDetails.poster_path,
      id: titleDetails.id,
      name: Media.MediaType.Movie === title.mediaType ? titleDetails.original_title : titleDetails.name,
      releaseDate: Media.MediaType.Movie === title.mediaType ? titleDetails.release_date : titleDetails.first_air_date,
      lastAirDate: Media.MediaType.Movie === title.mediaType ? undefined : titleDetails.last_air_date,	// Movies don't have an end date
      inProduction: Media.MediaType.Movie === title.mediaType ? undefined : titleDetails.in_production,	// Movies don't have an in production status
      voteAverage: titleDetails.vote_average,
    };


    allTitles.push(titleInfo);
  }

  const allInfo: Media.CompositeMedia = {
    titles: allTitles,
    cast: commonCast,
    crew: commonCrew,
  };

  return allInfo;
}

/**
 * Update the occurance of credit member's occurances in a title's credits
 * @param creditList The Array of credits to count members' occurance
 * @param creditMap The Map to save and update counts in
 * @returns The updated Map
 */
function countOccurance(creditList: Media.MediaCast[] | Media.MediaCrew[], creditMap: Map<number, number>): Map<number, number> {
  for (const member of creditList) {
    // Attempt to get a credits member. If there's no entry, will be undefined.
    let count = creditMap.get(member.id) ?? 0;
    count++;

    // Update the value
    creditMap.set(member.id, count);
  }

  return creditMap;
}

/**
 * Determine if a creditMember occurs multiple times
 * @param creditMember Member of the credits to check
 * @param creditMap The Map holding the counts of credit members
 * @returns A boolean as true if the given credit member occurs more than once, otherwise false
 */
function multiOccurance(creditMember: Media.MediaCast | Media.MediaCrew, creditMap: Map<number, number>): boolean {
  const count = creditMap.get(creditMember.id) ?? 0;
  if (count > 1) {
    return true;
  }
  return false;
}

/**
 * Merge duplicate crew members with multiple jobs
 * @param creditList The list of credits to merge (currently only supports crew)
 * @returns Returns the merged list of credit members
 */
function mergeDuplicates(creditList: Media.MediaCrew[]): Media.MediaCrew[] {
  const mergedCrew: Media.MediaCrew[] = [];

  for (const crewMember of creditList) {
    // Check if the crew member already exists
    const existingMember = mergedCrew.find((member: Media.MediaCrew | Media.MediaCast) => member.id === crewMember.id);

    // If it does, merge the jobs
    if (existingMember) {
      // Check if the existing member has multiple jobs
      if (Array.isArray(existingMember.job) && !Array.isArray(crewMember.job)) {
        existingMember.job.push(crewMember.job);
      } else if (!Array.isArray(existingMember.job) && !Array.isArray(crewMember.job)) {
        // If the existing member has a single job, and the new member has a single job, create an array
        existingMember.job = [existingMember.job, crewMember.job];
      } else {
        // Otherwise, throw an error
        throw new Error('A crew member has a an unexpected number of jobs: ' + existingMember.id + ', ' + existingMember.job);
      }
    } else {
      // Otherwise, add the crew member to the list
      mergedCrew.push(crewMember);
    }
  }

  return mergedCrew;

  // Side note: GitHub Copilot is scary good!
}

export {
  getAllMediaCredits,
}