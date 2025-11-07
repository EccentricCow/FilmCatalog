import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { FilmsService } from '../../../services/films.service';
import {
  FilmsResponseType, GenresResponseType,
} from '../../../../types/responses/films-response.type';
import { FilmCard } from '../../../components/film-card/film-card';
import {finalize} from 'rxjs';
import {Loader} from '../../../components/loader/loader';
import {FilmType, Genre} from '../../../../types/film.type';
import {PaginationComponent} from '../../../components/pagination/pagination';

@Component({
  selector: 'app-films',
  imports: [FilmCard, Loader, PaginationComponent],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export class Films implements OnInit {
  private readonly _filmsService = inject(FilmsService);

  protected _isLoading = signal<boolean>(false);
  protected _films = signal<FilmsResponseType>({} as FilmsResponseType);
  protected _filmsPages = computed<{total: number, current: number}>((): {total: number, current: number} => ({total: this._films().total_pages, current: this._films().page}));
  protected _genres = signal<Genre[]>([]);
  protected readonly _filmsWithGenres = computed((): FilmType[] =>
    this._films().results.map(film => ({
      ...film,
      genres: film.genre_ids.map(id => (this._genres() ?? []).find(g => g.id === id)?.name ?? '')
    }))
  );

  public ngOnInit(): void {
    this._fetchPage();

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

  protected _loadPage(page: number): void {
   this._fetchPage(page);
  }

  private _fetchPage(page?: number): void {
    this._isLoading.set(true);
    this._filmsService.getFilms(page)
      .pipe(finalize((): void => this._isLoading.set(false)))
      .subscribe({
        next: (filmsResponse: FilmsResponseType): void => {
          if (filmsResponse) {
            this._films.set({...filmsResponse, total_pages: filmsResponse.total_pages > 100 ?  100 : filmsResponse.total_pages});
          }
        },
        error: (err): void => {
          console.error('Error loading films', err);
        },
      });
  }
}
