export type FilmsResponseType = {
  page: number;
  results: FilmResponseType[];
  total_pages: number;
  total_results: number;
};

export type FilmResponseType = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: Genre['id'][];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type FilmDetailsResponseType = FilmResponseType & {
  belongs_to_collection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
};

type Genre = {
  id: string;
  name: string;
};
