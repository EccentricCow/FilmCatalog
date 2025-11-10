import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of, tap } from 'rxjs';
import { FilmsResponseType, GenresResponseType } from '../../types/responses/films-response.type';
import { isPlatformServer } from '@angular/common';

export const FILMS_KEY = makeStateKey<any>('films-page-1');
export const GENRES_KEY = makeStateKey<any>('films-genres');

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  private readonly _http = inject(HttpClient);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _apiKey = isPlatformServer(this._platformId)
    ? process.env['TMDB_API_KEY'] || environment.tmdbApiKey
    : environment.tmdbApiKey;

  private readonly _headers = new HttpHeaders({
    Authorization: `Bearer ${this._apiKey}`,
    'Content-Type': 'application/json',
  });

  public getFilms(page: number): Observable<FilmsResponseType> {
    if (page === 1) {
      const existing = this._transferState.get(FILMS_KEY, null);
      if (existing) return of(existing);
    }

    return this._http
      .get<FilmsResponseType>('/api/movies', {
        params: { page: page.toString() },
      })
      .pipe(
        tap((data) => {
          if (isPlatformServer(this._platformId)) {
            if (page === 1) {
              this._transferState.set(FILMS_KEY, data);
            }
          }
        })
      );
  }

  public getGenres(): Observable<GenresResponseType> {
    const existing = this._transferState.get(GENRES_KEY, null);
    if (existing) return of(existing);

    return this._http.get<GenresResponseType>('/api/genres').pipe(
      tap((data) => {
        if (isPlatformServer(this._platformId)) {
          this._transferState.set(GENRES_KEY, data);
        }
      })
    );
  }

  public searchFilms(search: string, page?: number): Observable<FilmsResponseType> {
    return this._http.get<FilmsResponseType>('/api/search', {
      params: { query: search, page: (page || 1).toString() },
    });
  }
}
