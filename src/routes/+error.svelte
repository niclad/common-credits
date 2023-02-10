<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="">
	<h1 class="pg-error">{$page.status}</h1>
	<h3 class="pg-error">{$page.error?.message}</h3>
	<p class="mx-auto">Nothing to see here... Move along now.</p>
</div>

<style>
	p {
		font-weight: bold;
		text-align: center;
	}

	.pg-error {
		text-align: center;
	}
</style>
