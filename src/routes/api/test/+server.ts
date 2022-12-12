import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	console.log('Doing stuff');


	return new Response(String(Math.random()));
}