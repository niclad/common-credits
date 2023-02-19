<script lang="ts">
	import type { BasicMedia, MediaCast, MediaCrew, Role } from '$lib/media.d';
	import { instanceOfMediaCast } from '$lib/media.lib';
	import { BASE_IMG_URL, BASE_TMDB_URL, SMALL_TMDB_LOGO_URL } from '$lib/tmdb.config';
	import { fade } from 'svelte/transition';
	import headShot from '$lib/assets/user.svg';

	let infoOpen: boolean = false;

	export let titles: BasicMedia[] = [];

	const titleOrder: { [key: string]: string } = Object.fromEntries(
		Array.from(titles, (title, index) => [`${title.id}${title.type}`, (++index).toString()])
	);

	export let person: MediaCast | MediaCrew = {
		type: 'cast',
		id: 0,
		adult: false,
		gender: 0,
		name: 'Person Name',
		profile_path: '/52kqB0Bei1TaTBx2rABrijVhhTG.jpg',
		characters: {
			'123': 'Character Name A',
			'456': 'Character Name B'
		},
		original_name: 'Person Name',
		credit_id: 'DEADBEEF',
		known_for_department: 'Acting',
		popularity: 0
	};

	$: personLink = `${BASE_TMDB_URL}/person/${person.id}`;
	$: imageUrl = headShotImage(person);
	let noHeadShot = false;

	function headShotImage(person: MediaCast | MediaCrew) {
		noHeadShot = person.profile_path === null;
		if (noHeadShot) {
			return headShot;
		} else {
			return `${BASE_IMG_URL}${person.profile_path}`;
		}
	}

	function mergeSameJobs(person: MediaCrew): Role {
		let jobs = person.jobs;
		let jobsArrayMap: { [key: string]: string[] } = {};
		const allJobs: string[] = [];

		// Split job strings into arrays
		for (const [key, value] of Object.entries(person.jobs)) {
			const joblist: string[] = value.split(',');
			jobsArrayMap[key] = joblist.map((job) => job.trim());
			allJobs.push(...jobsArrayMap[key]);
		}

		// Extract duplicate jobs
		const duplicateJobs = allJobs.filter((job, index) => allJobs.indexOf(job) !== index);

		if (duplicateJobs.length === 0) return person.jobs;

		// Remove duplicate jobs from their respective arrays
		duplicateJobs.forEach((job) => {
			for (const [key, value] of Object.entries(jobsArrayMap)) {
				if (value.includes(job)) {
					const newJobs = value.filter((item) => item !== job).join(', ');

					if (newJobs) {
						jobs[key] = newJobs;
					} else {
						delete jobs[key];
					}
				}
			}
		});

		jobs['All'] = duplicateJobs.join(', ');

		console.log(jobs);

		return jobs;
	}
</script>

<div class="card" transition:fade>
	<img src={imageUrl} class="card-img-top" class:noimg={noHeadShot} alt="title card" />
	<div class="card-body">
		<div class="row row-cols-2">
			<div class="col-md-auto">
				<h5 class="card-title">
					<a href={personLink} class="stretched-link-off" target="_blank" rel="noopener noreferrer"
						>{person.name}</a
					>
				</h5>
			</div>
		</div>
	</div>
	<div class="card-footer">
		<div class="accordion accordion-flush" id="accordion-{person.id}-{person.type}">
			<div class="accordion-item rounded-bottom">
				<h2 class="accordion-header" id="flush-heading-{person.id}-{person.type}">
					<button
						class="accordion-button collapsed"
						class:rounded-bottom={!infoOpen}
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#flush-collapse-{person.id}-{person.type}"
						aria-expanded="false"
						aria-controls="flush-collapse-{person.id}-{person.type}"
						on:click={() => (infoOpen = !infoOpen)}
					>
						{#if instanceOfMediaCast(person)}
							Roles
						{:else}
							Jobs
						{/if}
					</button>
				</h2>
				<div
					id="flush-collapse-{person.id}-{person.type}"
					class="accordion-collapse collapse"
					aria-labelledby="flush-heading-{person.id}-{person.type}"
					data-bs-parent="#accordion-{person.id}-{person.type}"
				>
					<div class="accordion-body person-roles">
						<table class="table table-hover table-sm">
							<tbody>
								{#if instanceOfMediaCast(person)}
									{#each Object.entries(person.characters) as [key, value]}
										<tr>
											<td class="title-num">{titleOrder[key]}</td>
											<td>{value}</td>
										</tr>
									{/each}
								{:else}
									{#each Object.entries(mergeSameJobs(person)) as [key, value]}
										<tr>
											{#if key.toLowerCase() === 'all'}
												<td class="title-num user-select-none">All</td>
											{:else}
												<td class="title-num user-select-none">{titleOrder[key]}</td>
											{/if}
											<td class="user-select-none">{value}</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		font-weight: bold;
		text-decoration: none;
	}

	a:hover {
		font-weight: bold;
	}

	.noimg {
		background-color: lightgrey;
		height: calc(1.5 * 186px);
	}

	.card-footer {
		padding: 0;
	}

	.person-roles {
		padding: 0;
	}

	.title-num {
		font-weight: bold;
	}
</style>
