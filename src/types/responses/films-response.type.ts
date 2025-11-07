import { Genre } from '../film.type';

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

export type GenresResponseType = {
  genres: Genre[];
};
