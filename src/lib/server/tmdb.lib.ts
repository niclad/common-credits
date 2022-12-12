import * as Media from '$lib/media.d';
import { TMDB_API_KEY } from '$env/static/private';
import axios from 'axios';

interface CreditMap {
	credit: Media.MediaCast | Media.MediaCrew;
	count: number;
}

async function getAllMediaCredits(titles: Media.QueryParams[]) {
	const apiBaseUrl = 'https://api.themoviedb.org';
	const apiVer = '3';
	let titleDetails: Media.BasicMedia[] = [];
	console.log(titles[0])

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
		const creditCast: Media.MediaCast[] = creditInfo.cast;
		for (const castMember of creditCast) {
			// Attempt to get a cast member. If there's no entry, will be undefined.
			let count = castMap.get(castMember.id);
			count = count ? count++ : 1;

			// Update the value
			castMap.set(castMember.id, count);
		}

		// Parse the crew
		const creditCrew: Media.MediaCrew[] = creditInfo.crew;
		for (const crewMember of creditCrew) {
			// Attempt to get a crew member
			let count = crewMap.get(crewMember.id);
			count = count ? count++ : 1;

			// Update the value
			crewMap.set(crewMember.id, count);
		}

		// Get the title details
		const detailsUrl = `${apiBaseUrl}/${apiVer}/${mediaType}/${title.id}?${queryParams}`;
		response = await axios.get(detailsUrl);
		const titleDetails = response.data;

		// Create the title object
		const titleInfo: Media.BasicMedia = {
			backdropPath: titleDetails.backdrop_path,
			id: titleDetails.id,
			name: titleDetails.name,
			releaseDate: Media.MediaType.Movie ? titleDetails.release_date : titleDetails.first_air_date
		};

		titleDetails.push(titleInfo);
	}
}

export {
	getAllMediaCredits,
}
