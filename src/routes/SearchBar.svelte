<script lang="ts">
	import { page } from '$app/stores';
	import axios from 'axios';
	import { fade, slide } from 'svelte/transition';
	import SearchResult from './SearchResult.svelte';
	import { hexEncode, hexDecode } from '$lib/utils';
	import { type QueryParams, MediaType } from '$lib/media.d';

	let searchValue: string;
	let hasResults: boolean = false;

	const goBtnText = 'Go';

	type mediaEnum = 'movie' | 'tv';
	interface SearchInfo {
		type: mediaEnum;
		id: number;
		title: string;
		releaseYear: string;
		selected: boolean;
	}

	let searchResults: any[] = [];
	let numResults: number = 0;
	let selectedResults: any[] = [];

	function updateHasResults() {
		if (searchValue?.trim()) hasResults = true;
		else hasResults = false;
	}

	/**
	 * Get search results from TMDb based on entered search value
	 */
	function search() {
		const url: string = `/api/search`;
		axios
			.get(url, {
				params: {
					q: searchValue
				}
			})
			.then(
				(response) => {
					if (Array.isArray(response.data)) {
						searchResults = response.data.map((item: any) => {
							return {
								...item,
								selected: false
							};
						});
						updateHasResults();
					} else if (
						Object.hasOwn(response.data, 'results') &&
						Object.hasOwn(response.data, 'total_results')
					) {
						searchResults = response.data.results.map((item: any) => {
							return {
								...item,
								selected: false
							};
						});
						numResults = response.data.total_results;
						updateHasResults();
					} else {
						searchResults = [];
						numResults = 0;
						updateHasResults();
					}
				},
				(error) => {
					console.error(error);
				}
			);
	}

	function displayInfo(searchItem: any): SearchInfo {
		const year: string = Object.hasOwn(searchItem, 'release_date')
			? searchItem.release_date.slice(0, 4)
			: searchItem.first_air_date.slice(0, 4);

		const title: string = Object.hasOwn(searchItem, 'title') ? searchItem.title : searchItem.name;

		return {
			type: searchItem.media_type,
			id: searchItem.id,
			title: title,
			releaseYear: year,
			selected: searchItem.selected
		};
	}

	// The requested media data
	export let mediaData;

	// Whether the 'Go' button has been clicked
	export let isSubmitted = false;

	let errorMessage: string;
	let selectedMedia: QueryParams[] = [];

	/**
	 * Get the media info from the API
	 */
	async function getMediaInfo() {
		isSubmitted = true;
		selectedMedia = []; // Reset the selected media array

		// Check if it's being tested
		if (selectedResults.length < 2) {
			// Movies
			// selectedMedia.push({ type: '0', id: 9718 }); // Taladega Knights
			// selectedMedia.push({ type: '0', id: 12133 }); // Step Brothers

			// TV Shows
			selectedMedia.push({ mediaType: MediaType.TV, id: 1399 }); // Game of Thrones
			selectedMedia.push({ mediaType: MediaType.TV, id: 100088 }); // The Last of Us
		} else {
			// Push selected results into query array
			for (const result of selectedResults) {
				selectedMedia.push({
					mediaType: result.media_type === 'movie' ? MediaType.Movie : MediaType.TV,
					id: result.id
				});
			}
		}

		// Build the search parameters
		let searchParams = [];
		for (const mediaQuery of selectedMedia) {
			searchParams.push(['id', mediaQuery.id.toString()]);
			searchParams.push(['type', mediaQuery.mediaType.toString()]);
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

				// Clear the search and selected results
				searchResults = [];
				hasResults = false;
				searchValue = '';
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
			selectedMedia.push({
				mediaType: query.mediaType,
				id: query.id
			});
		}
		getMediaInfo();
	}

	/**
	 * Build the encoded link to the query
	 */
	function buildEncodedLink(): string {
		const defaultUrl = $page.url.origin;
		if (selectedMedia.length < 2) {
			return defaultUrl;
		}

		// Push QueryParams into an array
		let queryArray: QueryParams[] = [];
		for (const query of selectedMedia) {
			if (query.id) {
				queryArray.push({
					id: query.id,
					mediaType: query.mediaType
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

<!-- Search bar and button -->
<form on:submit|preventDefault={search}>
	<div class="input-group" class:mb-3={!hasResults}>
		<input
			type="text"
			class="form-control"
			placeholder="Search for a title..."
			aria-label="Movie or TV show title"
			aria-describedby="search-button"
			class:rounded-0={hasResults}
			class:custom-rounded-input={hasResults}
			bind:value={searchValue}
			on:keyup={(event) => {
				const disallowedKeys = ['Tab', 'Backspace'];
				if (!disallowedKeys.includes(event.key) && false) search();
			}}
		/>
		<button
			class="btn btn-success"
			type="submit"
			id="search-button"
			class:rounded-0={hasResults}
			class:custom-rounded-btn={hasResults}
			disabled={!searchValue}><i class="bi bi-search" /></button
		>
	</div>
</form>

<!-- Search results list -->
{#if hasResults && searchResults.length > 0}
	<div class="list-group mb-3 rounded-0" class:rounded-bottom={hasResults} transition:slide>
		{#each searchResults.filter((t) => !t.selected) as result, i}
			<SearchResult
				isFirst={i === 0}
				searchInfo={displayInfo(result)}
				on:click={() => {
					result.selected = !result.selected;
					if (
						selectedResults.findIndex(
							(t) => t.id === result.id && t.media_type === result.media_type
						) === -1
					) {
						selectedResults = [...selectedResults, result];
					}
				}}
			/>
		{/each}
		{#if numResults > 0}
			<span
				class="list-group-item list-group-item-action list-group-item-light pe-none user-select-none"
			>
				<i class="bi bi-info-circle" />
				<span class="fst-italic"
					>Showing {searchResults.reduce((acc, curr) => {
						if (!curr.selected) acc++;
						return acc;
					}, 0)} of {numResults} total results</span
				>
			</span>
		{/if}
	</div>
{:else if hasResults && searchResults.length === 0}
	<div class="list-group mb-3 rounded-0" class:rounded-bottom={hasResults} transition:slide>
		<span class="list-group-item list-group-item-warning user-select-none">
			<i class="bi bi-exclamation-circle-fill" />
			<span> No results for your current query. Double check what you entered and try again.</span>
		</span>
	</div>
{/if}

<!-- Selected results list -->
{#if selectedResults.filter((t) => t.selected).length > 0}
	<div class="list-group mb-3" class:rounded-bottom={hasResults} transition:slide>
		<h6 class="list-group-item fw-bold pe-none mb-0">Selected Titles</h6>
		{#each selectedResults.filter((t) => t.selected) as result}
			<SearchResult
				mode={'select'}
				searchInfo={displayInfo(result)}
				on:click={() => {
					result.selected = !result.selected;
					selectedResults = selectedResults.filter((t) => t.selected);

					const updateIdx = searchResults.findIndex(
						(t) => t.id === result.id && t.media_type === result.media_type
					);
					searchResults[updateIdx] = result;
				}}
			/>
		{/each}
	</div>
{/if}

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
		disabled={selectedResults.length < 2 && false}>{goBtnText}</button
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
	/* Override Bootstraps border radius settings */
	.custom-rounded-input {
		border-top-left-radius: 0.375rem !important;
	}

	.custom-rounded-btn {
		border-top-right-radius: 0.375rem !important;
	}
</style>
