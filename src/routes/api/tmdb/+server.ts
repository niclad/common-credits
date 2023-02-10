import { error, json } from '@sveltejs/kit';
import { getAllMediaCredits } from '$lib/server/tmdb.lib';
import type { RequestHandler } from './$types';
import type * as Media from '$lib/media';

const apiUrl = 'https://api.themoviedb.org/3';

export const GET: RequestHandler = async ({ url }) => {
	const ids = url.searchParams.getAll('id');
	const mediaTypes = url.searchParams.getAll('type');

	// Create a map of types and IDs
	let medias: Media.QueryParams[] = [];
	ids.forEach((id, idx) => {
		medias.push({ mediaType: parseInt(mediaTypes[idx]), id: parseInt(id) });
	});
	console.log(medias)

	let result: Media.CompositeMedia;
	try {
		result = await getAllMediaCredits(medias);
		return json(result);
	} catch (err: unknown) {
		throw err;
	}
}