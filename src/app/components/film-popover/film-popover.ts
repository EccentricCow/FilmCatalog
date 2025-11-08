import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RatingColor } from '../../shared/directives/rating-color';
import { FilmType } from '../../../types/film.type';
import { Loader } from '../../components/loader/loader';

@Component({
  selector: 'film-popover',
  imports: [DecimalPipe, SlicePipe, RatingColor, Loader],
  templateUrl: './film-popover.html',
  styleUrl: './film-popover.scss',
})
export class FilmPopover {
  public readonly film = input.required<FilmType>();
  public readonly position = input<'left' | 'right'>('right');
  protected _isLoading = signal<boolean>(true);

  protected readonly _backdropPath = computed((): string =>
    this.film().backdrop_path
      ? environment.tmdbApiPosterBaseUrl + this.film().backdrop_path
      : '/no-movie-sm.png'
  );
}
