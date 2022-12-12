/**
 * Access the TMDb API
 */

import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
import querystring from 'node:querystring';
import { json } from '@sveltejs/kit';

const apiUrl = 'https://api.themoviedb.org/3';

export const GET: RequestHandler = async ({ url }) => {
	const movieId = '585511';

	const fetchUrl = apiUrl + `/movie/${movieId}?` + querystring.stringify({ api_key: env.TMDB_API_KEY, language: 'en-US' });
	// console.log(fetchUrl);
	const movieInfo = await axios.get(fetchUrl);
	console.log(movieInfo.data);
	console.log('Doing stuff');
	return json(movieInfo.data);
}