import { Component, computed, Inject, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FilmsService } from '../../services/films.service';
import {
  FilmsResponseType,
  GenresResponseType,
} from '../../../types/responses/films-response.type';
import { FilmCard } from '../../components/film-card/film-card';
import { debounceTime, finalize, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Loader } from '../../components/loader/loader';
import { FilmType, Genre } from '../../../types/film.type';
import { PaginationComponent } from '../../components/pagination/pagination';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-films',
  imports: [FilmCard, Loader, PaginationComponent, ReactiveFormsModule],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export class Films implements OnInit {
  private readonly _filmsService = inject(FilmsService);

  protected _isLoading = signal<boolean>(false);
  protected _isError = signal<string>('');
  protected _films = signal<FilmsResponseType>({} as FilmsResponseType);

  protected readonly _filmsPages = computed<{
    total: number;
    current: number;
    totalResults: number;
  }>((): { total: number; current: number; totalResults: number } => ({
    total: this._films().total_pages,
    current: this._films().page,
    totalResults: this._films().total_results,
  }));
  protected _genres = signal<Genre[]>([]);
  protected readonly _filmsWithGenres = computed((): FilmType[] =>
    this._films().results.map((film) => ({
      ...film,
      genres: film.genre_ids.map(
        (id) => (this._genres() ?? []).find((g) => g.id === id)?.name ?? ''
      ),
    }))
  );

  protected _searchedField = new FormControl('');

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: Object) {}

  public ngOnInit(): void {
    this._fetchFilms(1);

    this._filmsService.getGenres().subscribe({
      next: (genresResponse: GenresResponseType): void => {
        if (genresResponse?.genres.length > 0) {
          this._genres.set(genresResponse.genres);
        }
      },
      error: (err): void => {
        console.error('Error loading genres: ', err);
      },
    });

    this._searchedField.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        map((search) => search ?? ''),
        switchMap((search: string): Observable<FilmsResponseType | null> => {
          if (search.trim()) {
            this._fetchFilms(1);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (): void => {
          if (!this._searchedField.value) {
            this._fetchFilms(1);
          }
        },
      });
  }

  protected _loadNewPage(page: number): void {
    this._fetchFilms(page);
  }

  private _fetchFilms(page: number): void {
    this._isLoading.set(true);

    const search = this._searchedField.value;

    if (isPlatformServer(this._platformId)) {
      this._films.set({ results: [], page: 1, total_pages: 0, total_results: 0 });
      return;
    }

    const films$ = search?.trim()
      ? this._filmsService.searchFilms(search, page)
      : this._filmsService.getFilms(page);

    films$.pipe(finalize((): void => this._isLoading.set(false))).subscribe({
      next: (filmsResponse: FilmsResponseType): void => {
        if (filmsResponse) {
          this._films.set({
            ...filmsResponse,
            total_pages: Math.min(filmsResponse.total_pages, 100),
          });
        }
      },
      error: (err): void => {
        this._isError.set(err.message);
        console.error('Error loading films', err);
      },
    });
  }
}
