import { Injectable, signal } from '@angular/core';
import { debounce, distinctUntilChanged, of, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilmPopoverService {
  private _hoveredFilmId$ = new Subject<number | null>();
  private _activeFilm = signal<number | null>(null);
  private readonly _debounce = 300;

  constructor() {
    this._hoveredFilmId$
      .pipe(
        debounce((id) => (id ? timer(this._debounce) : of(null))),
        distinctUntilChanged()
      )
      .subscribe((id) => this._activeFilm.set(id));
  }

  public setHoveredFilm(id: number | null): void {
    this._hoveredFilmId$.next(id);
  }

  public activeFilm(): number | null {
    return this._activeFilm();
  }
}
