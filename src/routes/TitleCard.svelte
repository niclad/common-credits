<script lang="ts">
	import type { BasicMedia } from '$lib/media';
	import { BASE_IMG_URL, BASE_TMDB_URL, SMALL_TMDB_LOGO_URL } from '$lib/tmdb.config';

	export let testTitle: BasicMedia = {
		backdropPath: '/kuf6dutpsT0vSVehic3EZIqkOBt.jpg',
		id: 315162,
		name: 'Puss in Boots: The Last Wish',
		releaseDate: '2022-12-07'
	};

    // Format the year text if the given title is a TV show
    let releaseDate: string = new Date(testTitle.releaseDate).getFullYear().toString();
    if (testTitle.lastAirDate && (testTitle.inProduction !== undefined)) {
        releaseDate = `${releaseDate}\u2013`;
        if (!testTitle.inProduction) {
            releaseDate += new Date(testTitle.lastAirDate).getFullYear().toString();
        }
    }

    console.debug(testTitle);
    console.debug(`${testTitle.name}: ${releaseDate}`);

	const titleLink = `${BASE_TMDB_URL}/movie/${testTitle.id}`;
</script>

<div class="card">
	<img src={BASE_IMG_URL + testTitle.backdropPath} class="card-img-top" alt="title card" />
	<div class="card-body">
		<div class="row row-cols-2">
			<div class="col-md-auto">
				<h5 class="card-title">{testTitle.name}</h5>
			</div>
			<div class="col">
				<h5 class="card-title">({releaseDate})</h5>
			</div>
		</div>
		<!-- <p class="card-text">
			Put year (and <i>start</i> to <i>end</i> years if series)
		</p> -->
		<a href="{titleLink}" class="stretched-link" target="_blank" rel="noopener noreferrer">View @ TMDb</a>
	</div>
</div>

<style>
	a {
		opacity: 0;
		display: block;
		height: 0;
		width: 0;
		z-index: -1;
	}
</style>
