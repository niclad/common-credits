<script lang="ts">
	import axios from 'axios';
	import AccordionItem from './AccordionItem.svelte';
	import SearchBar from './SearchBar.svelte';
	import TitleCard from './TitleCard.svelte';
	import type { CompositeMedia } from '$lib/media';

	let mediaData: CompositeMedia;

	let testTitle = {
		backdropPath: '/f2l5hUk63hPqYTucnFy2HmElFV0.jpg',
		id: 4620,
		name: 'Eureka',
		releaseDate: '2006-07-18',
		lastAirDate: '2012-07-16',
		inProduction: false
	};
</script>

<h1 class="title-logo text-center">Common Credits</h1>

<SearchBar bind:mediaData />

<p>{'test'}</p>

<div class="accordion pb-5">
	<AccordionItem accordionId={0} accordionTitle={'Titles'} isExpanded={true}/>
	<AccordionItem accordionId={1} accordionTitle={'Cast'}/>
	<AccordionItem accordionId={2} accordionTitle={'Crew'}/>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&display=swap');
	.title-logo {
		font-family: 'Courier Prime', monospace;
	}

	p {
		margin: 2rem;
	}
</style>
