<script lang="ts">
	import TitleCard from './TitleCard.svelte';

	export let accordionId = 0;
	export let accordionTitle = `Info Set #${accordionId + 1}`;
	export let isExpanded = false;
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
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
				<div class="col">
					<div class="p-2">
						<TitleCard />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
</style>
