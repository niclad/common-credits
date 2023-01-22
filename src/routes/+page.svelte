<script lang="ts">
  import AccordionItem from './AccordionItem.svelte';
  import SearchBar from './SearchBar.svelte';
  import type { CompositeMedia } from '$lib/media.d';
  import { slide } from 'svelte/transition';

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

<!-- Display the medias' data if it's available -->
{#if mediaData}
  <div class="accordion py-5" transition:slide>
    <AccordionItem accordionId={0} accordionTitle={'Titles'} isExpanded={true} data={mediaData.titles} />
    <AccordionItem accordionId={1} accordionTitle={'Cast'} data={mediaData.cast}/>
    <AccordionItem accordionId={2} accordionTitle={'Crew'} data={mediaData.crew}/>
  </div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&display=swap');
  :global(.title-logo) {
    font-family: 'Courier Prime', monospace;
  }
</style>
