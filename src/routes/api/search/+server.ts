import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BASE_TMDB_API_URL } from '$lib/tmdb.config';
import { searchTMDb } from '$lib/server/tmdb.lib';
import searchResult from '../../../../test objects/search-result.json';

const SEARCH_DEBUG = false;

export const GET = (async ({ url }) => {
  const search = url.searchParams.get('q');
  const debugMode = url.searchParams.get('debug');
  if (!search) throw error(400, 'Missing search query');

  if (SEARCH_DEBUG) {
    const searchTestResult = searchTest();
    return json(searchTestResult);
  } else {
    try {
      const searchResult = await searchTMDb(search);
      return json(searchResult);
    } catch (err: unknown) {
      throw err;
    }
  }
}) satisfies RequestHandler;

function searchTest(): unknown {
  // Want to filter test data to only include movies and TV shows
  searchResult.results = searchResult.results.filter((result) =>{
    return result.media_type === 'movie' || result.media_type === 'tv';
  });

  return searchResult;
}