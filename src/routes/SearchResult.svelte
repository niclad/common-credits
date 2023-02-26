<script lang="ts">
	export let mode: 'search' | 'select' = 'search';
	export let isFirst: boolean = false;
	export let searchInfo: {
		type: 'movie' | 'tv';
		id: number;
		title: string;
		releaseYear: string;
		selected: boolean;
	} = {
		type: 'movie',
		id: 0,
		title: "Bob's Biopic",
		releaseYear: '2005',
		selected: false
	};

	const iconClass = searchInfo.type === 'movie' ? 'bi-film' : 'bi-tv';

	let isMousedOver: boolean = false;
	function invertMousedOver() {
		isMousedOver = !isMousedOver;
	}
</script>

<button
	class="d-flex justify-content-between list-group-item list-group-item-action"
	class:list-group-item-success={searchInfo.selected}
	class:list-group-item-dark={!searchInfo.selected}
	class:list-group-item-danger={isMousedOver}
	class:border-top-0={isFirst}

	on:click={() => {
		searchInfo.selected = !searchInfo.selected;
	}}
	on:click
	on:mouseenter={invertMousedOver}
	on:focus={invertMousedOver}
	on:mouseleave={invertMousedOver}
	on:blur={invertMousedOver}
>
	<span
		><i class="bi {iconClass}" />
		<span class:fw-bold={searchInfo.selected}
			>{searchInfo.title} ({searchInfo.releaseYear || '???'})</span
		></span
	>

	<!-- Handle mouse over icon change -->
	{#if searchInfo.selected && !isMousedOver}
		<i class="bi bi-check-lg" />
	{:else if isMousedOver && mode === 'select'}
		<i class="bi bi-x-lg" />
	{:else if isMousedOver && mode === 'search'}
		<i class="bi bi-plus-lg" />
	{/if}
</button>

<style>
</style>
