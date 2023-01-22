<script lang="ts">
	import type { BasicMedia } from '$lib/media.d';
	import { instanceOfTv } from '$lib/media.lib';
	import { BASE_IMG_URL, BASE_TMDB_URL, SMALL_TMDB_LOGO_URL } from '$lib/tmdb.config';
	import { fade } from 'svelte/transition';

	export let title: BasicMedia = {
		type: 'movie',
		posterPath: '/kuf6dutpsT0vSVehiposterPathpg',
		id: 315162,
		name: 'Puss in Boots: The Last Wish',
		releaseDate: '2022-12-07'
	};

	// Format the year if the title is a TV show
	$: releaseDate = formatDate(title);
	
	// Format the title's link
	$: titleLink = `${BASE_TMDB_URL}/${title.type}/${title.id}`;

	/**
	 * Format the release date to display differently for movies and tv
	 * @param title The title's details with the releaseDate we want to format
	 */
	function formatDate(title: BasicMedia): string {
		let releaseDate: string = new Date(title.releaseDate).getFullYear().toString();
		
		// If the title is a TV show, we need to format the date differently
		if (instanceOfTv(title)) {
			releaseDate = `${releaseDate}\u2013`;
			if (!title.inProduction) {
				releaseDate += new Date(title.lastAirDate).getFullYear().toString();
			}
		}

		return releaseDate;
	}

</script>

<div class="card" transition:fade>
	<img src={BASE_IMG_URL + title.posterPath} class="card-img-top" alt="title card" />
	<div class="card-body">
		<div class="row row-cols-2">
			<div class="col-md-auto">
				<h5 class="card-title"><a href={titleLink} class="stretched-link" target="_blank" rel="noopener noreferrer">{title.name}</a></h5>
			</div>
			<!-- <div class="col-6">
				<h5 class="card-title">({releaseDate})</h5>
			</div> -->
		</div>
		<h5 class="card-title">({releaseDate})</h5>
	</div>
</div>

<style>
	/* a {
		opacity: 0;
		display: block;
		height: 0;
		width: 0;
		z-index: -1;
	} */

	a {
		font-weight: bold;
		text-decoration: none;
	}

	a:hover {
		font-weight: bold;
	}
</style>
