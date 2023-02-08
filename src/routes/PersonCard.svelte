<script lang="ts">
  import type { MediaCast, MediaCrew } from '$lib/media.d';
  import { instanceOfMediaCast } from '$lib/media.lib';
  import { BASE_IMG_URL, BASE_TMDB_URL, SMALL_TMDB_LOGO_URL } from '$lib/tmdb.config';
  import { fade } from 'svelte/transition';
  import headShot from '$lib/assets/user.svg';

  export let person: MediaCast | MediaCrew = {
    type: 'cast',
    id: 0,
    name: 'Person Name',
    profile_path: '/52kqB0Bei1TaTBx2rABrijVhhTG.jpg',
    character: 'Character Name',
    known_for_department: 'Acting',
    popularity: 0,
  };

  $: personLink = `${BASE_TMDB_URL}/person/${person.id}`;
  $: infoDisplay = determineInfoDisplay(person);
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

  function determineInfoDisplay(person: MediaCast | MediaCrew): string {
    if (instanceOfMediaCast(person)) {
      if (Array.isArray(person.character)) {
        return person.character.join(', ');
      } else {
        return person.character ?? 'wtf';
      }
    } else {
      if (Array.isArray(person.job)) {
        return person.job.join(', ');
      } else {
        return person.job ?? 'ok?';
      }
    }
  }
</script>

<div class="card" transition:fade>
  <img src={imageUrl} class="card-img-top" class:noimg={noHeadShot} alt="title card" />
  <div class="card-body">
    <div class="row row-cols-2">
      <div class="col-md-auto">
        <h5 class="card-title">
          <a href={personLink} class="stretched-link" target="_blank" rel="noopener noreferrer"
            >{person.name}</a
          >
        </h5>
      </div>
    </div>
    <div class="row">
      <div class="col-md-auto pe-0">
        <p class="card-text"><i>{infoDisplay}</i></p>
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
</style>
