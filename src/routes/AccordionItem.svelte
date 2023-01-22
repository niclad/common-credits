<script lang="ts">
	import type { BasicMedia, MediaCast, MediaCrew } from '$lib/media.d';
	import { instanceOfBasicMedia } from '$lib/media.lib';
	import TitleCard from './TitleCard.svelte';

	export let accordionId = 0;
	export let accordionTitle = `Info Set #${accordionId + 1}`;
	export let isExpanded = false;

	export let data: BasicMedia[] | MediaCast[] | MediaCrew[];
</script>

<div class="accordion-item">
	<h2 class="accordion-header" id="panel-{accordionId}">
		<button
			class="accordion-button"
			class:collapsed={!isExpanded}
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#panel-collapse{accordionId}"
			aria-expanded={isExpanded}
			aria-controls="panel-collapse{accordionId}"
		>
			{accordionTitle}
		</button>
	</h2>
	<div
		id="panel-collapse{accordionId}"
		class="accordion-collapse collapse"
		class:show={isExpanded}
		aria-labelledby="panel-{accordionId}"
	>
		<div class="accordion-body">
			<div class="row row-cols-6 g-2">
				{#each data as mediaItem}
					{#if instanceOfBasicMedia(mediaItem)}
						<div class="col">
							<div class="p-2">
								<TitleCard title={mediaItem}/>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
</style>
