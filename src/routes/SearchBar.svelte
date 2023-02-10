<script lang="ts">
	import axios from 'axios';
	import { debug } from 'svelte/internal';

	// The requested media data
	export let mediaData;

	// Whether the 'Go' button has been clicked
	export let isSubmitted = false;

	// Search bar settings
	const numSearchBars = 2;
	const idPlaceholder = 'Movie or TV show ID...';
	const goBtnText = 'Go';

	// Acceptable media types
	const mediaTypes = [
		{ label: 'Movie', value: '0' },
		{ label: 'TV Show', value: '1' }
	];

	// Entered values
	let selectedMedia = Array(numSearchBars);
	let enteredId = Array(numSearchBars);

	let errorMessage: string;

	// Get the movie info
	async function getMediaInfo() {
		isSubmitted = true;

    
		// Check if it's being tested
		if (selectedMedia.includes(undefined) || enteredId.includes(undefined)) {
      selectedMedia = ['0', '0'];
			enteredId = ['9718', '12133'];
		}
    
		// Build the search parameters
		let searchParams = [];
		for (const id of enteredId) {
      searchParams.push(['id', id]);
		}
		for (const mediaType of selectedMedia) {
      searchParams.push(['type', mediaType]);
		}
		const queryParams = new URLSearchParams(searchParams).toString();
    
		// Build the request URL
		const url = `/api/tmdb?${queryParams}`;
    
		// Request the results
		axios.get(url).then(
      (response) => {
        mediaData = response.data;
				console.log('Successfully obtained media data.');

        // Check if there's an error message and clear it
        if (errorMessage) {
          errorMessage = '';
        }
			},
			(error) => {
        errorMessage = error.response.data.message;
				console.log(errorMessage);
			}
      );
	}
</script>

<!-- Search bars -->
<form>
	{#each Array(numSearchBars) as _, i}
		<div class="input-group mb-3">
			{#each mediaTypes as mediaType, index}
				<input
					type="radio"
					class="btn-check"
					name="btnradio{i}"
					id="{mediaType.value}-btnradio{i}"
					value={mediaType.value}
					bind:group={selectedMedia[i]}
					autocomplete="off"
					required
				/>
				<label
					class:first-radio={index === 0}
					class="btn btn-outline-secondary"
					for="{mediaType.value}-btnradio{i}">{mediaType.label}</label
				>
			{/each}
			<input
				bind:value={enteredId[i]}
				type="text"
				class="form-control id-entry"
				placeholder={idPlaceholder}
				aria-label=""
				required
			/>
		</div>
	{/each}
</form>

<!-- Go button -->
<button
	class="btn btn-primary mx-auto d-block"
	type="submit"
	on:click={() => getMediaInfo()}
	disabled={(selectedMedia.includes(undefined) || enteredId.includes(undefined)) && false}
	>{goBtnText}</button
>

<!-- Error alert -->
{#if errorMessage}
	<div class="alert alert-danger alert-dismissible d-flex align-items-center mt-3" role="alert">
		<i class="bi bi-exclamation-triangle-fill me-2" />
		<div>
			{errorMessage ?? 'Test message for an alert!'}
		</div>
	</div>
{/if}

<style>
	.first-radio {
		border-radius: 0.375rem 0 0 0.375rem !important;
	}

	button {
		width: 10%;
	}

	.id-entry {
		font-family: monospace;
	}
</style>
