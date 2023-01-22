import type { BasicMedia, MediaCast, Movie, Tv } from "./media";

function instanceOfBasicMedia(obj: any): obj is BasicMedia {
  return obj.type === "movie" || obj.type === "tv";
}

function instanceOfMovie(obj: any): obj is Movie {
  return obj.type === "movie";
}

function instanceOfTv(obj: any): obj is Tv {
  return obj.type === "tv";
}

function instanceOfMediaCast(obj: any): obj is MediaCast {
  return obj.type === "cast";
}

export {
    instanceOfBasicMedia,
    instanceOfMediaCast,
    instanceOfMovie,
    instanceOfTv,
}