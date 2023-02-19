<script lang="ts">
	import axios from 'axios';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { QueryParams } from '$lib/media';
	import { hexEncode, hexDecode } from '$lib/utils';

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

	/**
	 * Get the media info from the API
	 */
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
				errorMessage = error.response?.data.message ?? 'An unknown error occurred.';
				console.log(errorMessage);
			}
		);
	}

	// Check the URL for a query
	const url = new URL($page.url.toString());
	const query = url.searchParams.get('q');
	if (query) {
		const decodedQuery = JSON.parse(hexDecode(query)) as QueryParams[];
		for (const [i, query] of decodedQuery.entries()) {
			selectedMedia[i] = query.mediaType;
			enteredId[i] = query.id;
		}
		getMediaInfo();
	}

	/**
	 * Build the encoded link to the query
	 */
	function buildEncodedLink(): string {
		const defaultUrl = $page.url.origin;
		if (selectedMedia.includes(undefined) || enteredId.includes(undefined)) {
			return defaultUrl;
		}

		// Push QueryParams into an array
		let queryArray: QueryParams[] = [];
		for (const [i, id] of enteredId.entries()) {
			if (id) {
				queryArray.push({
					id: id,
					mediaType: selectedMedia[i]
				});
			} else {
				// Shouldn't get here!
				return defaultUrl;
			}
		}

		// If nothing was pushed into the array, return the current URL
		if (queryArray.length <= 0) {
			// Shouldn't get here!
			return defaultUrl;
		}

		const encodedQuery: string = hexEncode(JSON.stringify(queryArray));
		const fullUrl: string = `${defaultUrl}?q=${encodedQuery}`;

		if (fullUrl.length > 2000) {
			// URL is too long
			console.error('The generated share link is too long. Unable to share.');
			return defaultUrl;
		}

		return fullUrl;
	}

	// Make copyable link reactive
	let copyLink: string = $page.url.toString(); // The link to copy
	let copyMsg: string; // Message to display when copying
	let copySuccess: boolean = false; // Whether the copy was successful

	/**
	 * Copy the link to the clipboard
	 */
	function copyToClipboard() {
		// Actually copy the link to the clipboard
		navigator.clipboard.writeText(copyLink).then(
			() => {
				// Copy success
				console.log(`Copied ${copyLink} to clipboard!`);
				copyMsg = 'Copied to clipboard!';
				copySuccess = true;
				setTimeout(() => {
					copyMsg = '';
					copySuccess = false;
				}, 2000);
			},
			() => {
				// Copy error
				console.log('Failed to copy to clipboard! Highlight and copy manually.');
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

<div class="d-flex justify-content-center align-items-center">
	<!-- Go button -->
	<button
		class="btn btn-primary me-1"
		title="Run a query"
		type="submit"
		on:click={() => {
			getMediaInfo();
			copyLink = buildEncodedLink();
		}}
		disabled={(selectedMedia.includes(undefined) || enteredId.includes(undefined)) && false}
		>{goBtnText}</button
	>
	<!-- Share button -->
	<div class="dropdown">
		<button
			type="button"
			class="btn btn-secondary ms-1"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			data-bs-auto-close="outside"
			title="Get a link to share!"
			on:click={() => {
				copyLink = buildEncodedLink();
			}}
		>
			<i class="bi bi-share-fill" />
		</button>
		<div class="dropdown-menu p-1 share-menu">
			<div class="d-flex flex-row justify-content-center align-items-center">
				<!-- Link display -->
				<div
					class="alert alert-dark user-select-all mb-0 overflow-auto text-nowrap flex-shrink-1 lh-1 link-box"
				>
					{copyLink}
				</div>

				<!-- Copy button -->
				<button
					class:btn-success={copySuccess}
					class="btn btn-primary btn-sm ms-1 flex-shrink-0"
					on:click={copyToClipboard}
				>
					{#if copySuccess}
						<i class="bi bi-check2" />
					{:else}
						<i class="bi bi-clipboard2-fill" />
					{/if}
					Copy</button
				>
			</div>
			{#if copyMsg && false}
				<div class="badge text-bg-success mt-1 mb-0 text-center" out:fade>{copyMsg}</div>
			{/if}
		</div>
	</div>
	<!-- </div> -->
</div>

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

	.share-menu {
		max-width: 400px;
	}

	.link-box {
		padding: 0.6rem;
	}

	.id-entry {
		font-family: monospace;
	}
</style>
