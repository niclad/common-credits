<script lang="ts">
	import axios from 'axios';

	let searchValue: string;

	function search() {
		console.debug(searchValue);
		const url: string = `/api/search`;

		axios
			.get(url, {
				params: {
					q: searchValue
				}
			})
			.then(
				(response) => {
					console.debug(response.data);
				},
				(error) => {
					console.error(error);
				}
			);
	}
</script>

<div class="input-group mb-3">
	<input
		type="text"
		class="form-control"
		placeholder="Search for a title..."
		aria-label="Movie or TV show title"
		aria-describedby="search-button"
		bind:value={searchValue}
		on:keyup={() => {
			search();
		}}
	/>
	<button class="btn btn-outline-secondary" type="button" id="search-button"
		><i class="bi bi-search" /></button
	>
</div>

<style>
</style>
