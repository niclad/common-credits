import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import axios from 'axios';
import querystring from 'node:querystring';
import { json } from '@sveltejs/kit';
import type * as Media from '$lib/media.d';
import { getAllMediaCredits } from '$lib/server/tmdb.lib';


const apiUrl = 'https://api.themoviedb.org/3';

export const GET: RequestHandler = async ({ url }) => {
	const ids = url.searchParams.getAll('id');
	const mediaTypes = url.searchParams.getAll('type');

	// Create a map of types and IDs
	let medias: Media.QueryParams[] = [];
	ids.forEach((id, idx) => {
		medias.push({ mediaType: parseInt(mediaTypes[idx]), id: parseInt(id)});
	});
	console.log(medias)
	let result = await getAllMediaCredits(medias);

	let movieInfo = { data: 1234 };
	return json(result);
}