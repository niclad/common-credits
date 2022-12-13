<script lang="ts">
	import axios from 'axios';
	import SearchBar from './SearchBar.svelte';
	import type { CompositeMedia } from '$lib/media';

	let mediaData: CompositeMedia;
</script>

<h1 class="title-logo">Common Credits</h1>

<SearchBar bind:mediaData={mediaData}/>

<p>{"test"}</p>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&display=swap');
	.title-logo {
		font-family: 'Courier Prime', monospace;
	}

	p {
		margin: 2rem;
	}
</style>
