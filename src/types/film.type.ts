export type FilmType = {
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
  genres?: Genre['name'][];
};

export type Genre = {
  id: string;
  name: string;
};
