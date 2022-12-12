<script>
	import { TMDB_LOGO_URL } from '$lib/tmdb.config';
	import socials from '$lib/socials.json';

	const socialKeys = Object.keys(socials);
	const socialValues = Object.values(socials);
	const entries = Object.entries(socials);

	export let links = ['About', 'How to Use'];
	const API_NAME = 'TMDb';

	let modalIds = links.map((str) => str.toLowerCase().replaceAll(' ', ''));
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
	/>
</svelte:head>

<footer class="footer mt-auto py-3 border-top">
	<div class="container-xl d-flex flex-wrap justify-content-between align-items-center">
		<p class="col-md-4 mb-0 text-begin" />
		<a
			class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto text-decoration-none bottom-logo"
			href="/">Common Credits</a
		>
		<ul class="nav col-md-4 justify-content-end">
			{#each links as link, i}
				<li class="nav-item text-end">
					<a
						class="nav-link pe-0"
						href="#{modalIds[i]}"
						data-bs-toggle="modal"
						data-bs-target="#{modalIds[i]}-modal">{link}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</footer>

{#each modalIds as modalId, i}
	<div class="modal fade" id="{modalId}-modal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">{links[i]}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body text-start">
					{#if links[i] === 'About'}
						<div class="card text-bg-light mb-3">
							<div class="card-body">
								<div class="row align-items-center">
									<div class="col-4">
										<a
											class="stretched-link"
											href="https://www.themoviedb.org/"
											target="_blank"
											rel="noreferrer"><img src={TMDB_LOGO_URL} alt="TMDb Logo" /></a
										>
									</div>
									<div class="col">
										<p>
											This product uses the {API_NAME} API but is not endorsed or certified by {API_NAME}.
										</p>
										<p class="mb-0">All data and images are sourced from {API_NAME}.</p>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col">
								<p class="text-center">
									Created with ❤️ by me, Nick. Questions or comments? Feel free to reach out 📫.
								</p>
							</div>
						</div>
						<div class="row">
							<div class="col d-flex justify-content-center">
								{#each entries as [key, value]}
									<a
										class="link-secondary fs-2 px-2"
										href={value.link}
										target="_blank"
										rel="noreferrer"><i class={value.icon} /></a
									>
								{/each}
							</div>
						</div>
					{:else if links[i] === 'How to Use'}
						<p class="text-center fs-2">Information TBD! 😰</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/each}

<style>
  :root {
    --text-color: #a5a5a5;
  }

	.text-begin {
		text-align: start;
	}

	.bottom-logo {
    color: var(--text-color);
		font-weight: bold;
		font-size: 1.25rem;
	}

	.bottom-logo:hover {
    color: var(--text-color);
		filter: drop-shadow(0 0 0.35em var(--fg-bright));
	}

  .footer {
    background-color: var(--fg-dark);
    border-top-color: var(--fg-dark) !important;
  }

  a {
    color: var(--text-color);
  }

  a:hover {
    color: var(--fg-bright);
  }
</style>
