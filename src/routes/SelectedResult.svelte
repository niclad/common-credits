<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let searchInfo: { type: 'movie' | 'tv'; id: number; title: string; releaseYear: string; selected: boolean; } =
		{
			type: 'movie',
			id: 0,
			title: "Bob's Biopic",
			releaseYear: '2005',
			selected: false,
		};

	const iconClass = searchInfo.type === 'movie' ? 'bi-film' : 'bi-tv';
	let isSelected: boolean = false;

	function sendInfo() {
		dispatch('info', searchInfo);
	}

  function sendDelete() {
    dispatch('remove', searchInfo);
  }

	let isMousedOver: boolean = false;
	function invertMousedOver(event: any) {
		isMousedOver = !isMousedOver;
	}
</script>

<!-- class:visually-hidden={isSelected} -->
<a
	class="d-flex justify-content-between list-group-item list-group-item-action"
	class:list-group-item-success={searchInfo.selected && !isMousedOver}
	class:list-group-item-danger={isMousedOver}
	on:click={() => {
		searchInfo.selected = !searchInfo.selected;
	}}
	on:click
	on:mouseenter={invertMousedOver}
	on:focus={invertMousedOver}
	on:mouseleave={invertMousedOver}
	on:blur={invertMousedOver}
	href="#"
>
	<span
		><i class="bi {iconClass}" />
		<span class:fw-bold={() => {
        console.debug('searchInfo.selected: ', searchInfo.selected);
        return searchInfo.selected;
      }}>{searchInfo.title} ({searchInfo.releaseYear || '???'})</span
		></span
	>

	{#if searchInfo.selected && !isMousedOver}
		<i class="bi bi-check-lg" />
	{:else if isMousedOver}
		<i class="bi bi-x-lg" />
	{/if}
</a>

<style>
</style>
