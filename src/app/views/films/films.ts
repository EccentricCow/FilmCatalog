import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FilmsService } from '../../services/films.service';
import {
  FilmsResponseType,
  GenresResponseType,
} from '../../../types/responses/films-response.type';
import { FilmCard } from '../../components/film-card/film-card';
import { debounceTime, finalize, tap } from 'rxjs';
import { Loader } from '../../components/loader/loader';
import { Genre } from '../../../types/film.type';
import { PaginationComponent } from '../../components/pagination/pagination';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isPlatformServer } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-films',
  imports: [FilmCard, Loader, PaginationComponent, ReactiveFormsModule],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export class Films implements OnInit, AfterViewInit {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _filmsService = inject(FilmsService);
  private readonly _destroyRef = inject(DestroyRef);

  private _isFirstClientFetchDone = false;

  protected _isLoading = signal<boolean>(false);
  protected _isError = signal<string>('');
  protected _searchedField = new FormControl('');

  protected _films = signal<FilmsResponseType>({} as FilmsResponseType);
  protected _genres = signal<Genre[]>([]);

  protected readonly _filmsPages = computed(() => {
    return {
      total: this._films().total_pages,
      current: this._films().page,
      totalResults: this._films().total_results,
    };
  });

  protected readonly _filmsWithGenres = computed(() => {
    if (isPlatformServer(this._platformId)) return this._films().results?.slice(0, 10);

    const films = this._films()?.results ?? [];
    const genresMap = new Map(this._genres().map((g) => [g.id, g.name]));
    return films.map((film) => ({
      ...film,
      genres: film.genre_ids?.map((id) => genresMap.get(id) ?? '') ?? [],
    }));
  });

  public ngOnInit(): void {
    const skipUiEffects = !isPlatformServer(this._platformId) && !this._isFirstClientFetchDone;
    this._fetchFilms(1, skipUiEffects);
  }

  public ngAfterViewInit(): void {
    if (!isPlatformServer(this._platformId)) {
      this._fetchGenres();
      this._initSearchListener();
    }
  }

  private _fetchGenres() {
    this._filmsService
      .getGenres()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (genresResponse: GenresResponseType): void => {
          if (genresResponse?.genres.length > 0) {
            this._genres.set(genresResponse.genres);
          }
        },
        error: (err): void => console.error('Error loading genres: ', err),
      });
  }

  protected _loadNewPage(page: number): void {
    this._fetchFilms(page);
  }

  private _fetchFilms(page: number = 1, skipUiEffects: boolean = false): void {
    this._isError.set('');

    if (isPlatformServer(this._platformId)) {
      this._filmsService.getFilms(1).subscribe({
        next: (filmsResponse: FilmsResponseType) => {
          if (filmsResponse) {
            this._films.set({
              ...filmsResponse,
              total_pages: Math.min(filmsResponse.total_pages, 100),
            });
          }
        },
        error: (err) => console.error('Error loading films', err),
      });
      return;
    }

    if (!skipUiEffects) this._isLoading.set(true);

    const search = this._searchedField?.value;
    const films$ = search?.trim()
      ? this._filmsService.searchFilms(search, page)
      : this._filmsService.getFilms(page);

    films$
      .pipe(
        finalize(() => {
          if (!skipUiEffects && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          if (!skipUiEffects) {
            this._isLoading.set(false);
            this._isFirstClientFetchDone = true;
          }
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe({
        next: (filmsResponse: FilmsResponseType) => {
          if (filmsResponse) {
            this._films.set({
              ...filmsResponse,
              total_pages: Math.min(filmsResponse.total_pages, 100),
            });
          }
        },
        error: (err) => {
          this._isError.set(err.message);
          console.error('Error loading films', err);
        },
      });
  }

  private _initSearchListener(): void {
    this._searchedField.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this._fetchFilms()),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }
}
