<script lang="ts">
	import './styles.css';
	import Footer from './Footer.svelte';
</script>

<main class="flex-shrink-0">
	<div class="container-xl">
		<slot />
	</div>
</main>

<Footer />

<style>
</style>
