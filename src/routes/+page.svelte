<script lang="ts">
	import axios from 'axios';
	let test = '{}'
	export async function onClick() {
		console.log(';)');
		const queryParams: string = new URLSearchParams([
			['id', '585511'], 
			// ['id', '1234'], 
			// ['id', '5678'],
			['type', '0'],
			// ['type', '0'],
			// ['type', '0'],
		]).toString();
		const url: string = '/api/tmdb' + '?' + queryParams;
		console.log(url);
		axios.get(url).then((response: any) => test = JSON.stringify(response.data));
	}
</script>

<h1>Common Credits</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button type="button" class="btn btn-outline-primary" on:click={onClick}>Click me!</button>

<p>{test}</p>

<style>
	p {
		margin: 2rem;
	}
</style>