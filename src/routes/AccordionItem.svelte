<script lang="ts">
	import type { BasicMedia, MediaCast, MediaCrew } from '$lib/media.d';
	import { instanceOfBasicMedia } from '$lib/media.lib';
	import PersonCard from './PersonCard.svelte';
	import TitleCard from './TitleCard.svelte';

	export let accordionId = 0;
	export let accordionTitle = `Info Set #${accordionId + 1}`;
	export let isExpanded = false;

	export let data: BasicMedia[] | MediaCast[] | MediaCrew[];
	export let titleOrder: BasicMedia[] = [];
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
			<div class="row row-cols-lg-6 row-cols-md-4 row-cols-sm-3 row-cols-2 g-2">
				{#each data as mediaItem, i}
					<div class="col">
						<div class="p-2">
							{#if instanceOfBasicMedia(mediaItem)}
								<TitleCard title={mediaItem} titleOrder={i} />
							{:else}
                <PersonCard person={mediaItem} titles={titleOrder} />
              {/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
</style>
