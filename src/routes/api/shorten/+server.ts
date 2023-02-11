import axios from 'axios';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BITLY_API_TOKEN } from '$env/static/private';

/**
 * Use the Bitly API to shorten a URL...
 * 
 * Currently, this will go unused, but it's here in case we want to use it in the future.
 */
export const POST = (async ({ request }) => {
  const headerToken = request.headers.get('Authorization');
  if (!headerToken || headerToken !== BITLY_API_TOKEN) {
    throw error(401, 'Unauthorized');
  }

  const { url }: { url: string } = await request.json();

  try {
    const response = await axios.post('https://api-ssl.bitly.com/v4/shorten', { long_url: url }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BITLY_API_TOKEN}`,
      }
    });

    /**
     * Possible future enhancements:
     * - track creation date and remove after a certain amount of time
     */


    return json({ shortUrl: response.data.link });
  } catch (err) {
    throw error(500, 'Something went wrong generating the short link.');
  }
}) satisfies RequestHandler;