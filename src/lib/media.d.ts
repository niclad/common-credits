/**
 * Minimum info needed for a title
 */
interface BasicMedia {
	backdropPath: string;
	id: number;
	name: string;
	releaseDate: string;
}

/**
 * A title's cast member
 */
interface MediaCast {
	id: number;
	known_for_department: string;
	name: string;
	popularity: number;
	profile_path: string | null;
	character: string;
}

/**
 * A title's crew member
 */
interface MediaCrew {
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;	
	profile_path: string | null;
	department: string;
	job: string;
}

/**
 * A title's credits
 */
interface Credits {
	id: number;
	cast: MediaCast[];
	crew: MediaCrew[];
}

// Only two media types that exist in TMDb
enum MediaType {
	Movie,
	TV,
}

// The query parameters received from front-end request
interface QueryParams {
	mediaType: MediaType;
	id: number;
}

export { 
	BasicMedia,
	MediaCast,
	MediaCrew,
	Credits,
	MediaType,
	QueryParams,
}