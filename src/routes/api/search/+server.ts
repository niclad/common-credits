import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BASE_TMDB_API_URL } from '$lib/tmdb.config';
import { searchTMDb } from '$lib/server/tmdb.lib';

export const GET = (async ({ url }) => {
  const search = url.searchParams.get('q');
  if (!search) throw error(400, 'Missing search query');

  try {
    const searchResult = await searchTMDb(search);
    return json(searchResult);
  } catch (err: unknown) {
    throw err;
  }
}) satisfies RequestHandler;