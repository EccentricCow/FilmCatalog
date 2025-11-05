import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FilmsResponseType } from '../../types/responses/films-response.type';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  private readonly _http = inject(HttpClient);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _apiKey = isPlatformServer(this._platformId)
    ? process.env['TMDB_API_KEY'] || environment.tmdbApiKey
    : environment.tmdbApiKey;

  private readonly _headers = new HttpHeaders({
    Authorization: `Bearer ${this._apiKey}`,
    'Content-Type': 'application/json',
  });

  public getFilms(page?: number): Observable<FilmsResponseType> {
    return this._http.get<FilmsResponseType>(environment.tmdbApiUrl + '/movie/popular', {
      headers: this._headers,
      params: { page: (page || 1).toString(), language: 'ru-RU' },
    });
  }
}
