import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { FilmsService } from '../../../services/films.service';
import {
  FilmResponseType,
  FilmsResponseType, GenresResponseType,
} from '../../../../types/responses/films-response.type';
import { FilmCard } from '../../../components/film-card/film-card';
import {finalize} from 'rxjs';
import {Loader} from '../../../components/loader/loader';
import {FilmType, Genre} from '../../../../types/film.type';

@Component({
  selector: 'app-films',
  imports: [FilmCard, Loader],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export class Films implements OnInit {
  private readonly _filmsService = inject(FilmsService);

  protected _isLoading = signal<boolean>(false);
  private _films = signal<FilmResponseType[]>([]);
  protected _genres = signal<Genre[]>([]);
  protected readonly _filmsWithGenres = computed((): FilmType[] =>
    this._films().map(film => ({
      ...film,
      genres: film.genre_ids.map(id => (this._genres() ?? []).find(g => g.id === id)?.name ?? '')
    }))
  );

  constructor() {  }

  public ngOnInit(): void {
    this._isLoading.set(true);
    this._filmsService.getFilms()
      .pipe(finalize((): void => this._isLoading.set(false)))
      .subscribe({
        next: (filmsResponse: FilmsResponseType): void => {
          if (filmsResponse) {
            this._films.set(filmsResponse.results);
          }
        },
        error: (err): void => {
          console.error('Error loading films', err);
        },
      });

    this._filmsService.getGenres()
      .subscribe({
        next: (genresResponse: GenresResponseType): void => {
          if (genresResponse?.genres.length > 0) {
            this._genres.set(genresResponse.genres);
          }
        },
        error: (err): void => {
          console.error('Error loading genres', err);
        },
      });
  }
}
