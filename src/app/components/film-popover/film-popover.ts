import {Component, computed, input} from '@angular/core';
import {DecimalPipe, SlicePipe} from '@angular/common';
import {environment} from '../../../environments/environment';
import {FilmResponseType} from '../../../types/responses/films-response.type';
import {RatingColor} from '../../shared/directives/rating-color';

@Component({
  selector: 'film-popover',
  imports: [
    DecimalPipe,
    SlicePipe,
    RatingColor
  ],
  templateUrl: './film-popover.html',
  styleUrl: './film-popover.scss',
})
export class FilmPopover {
  public readonly film = input<FilmResponseType>();
  public readonly position = input<'left' | 'right'>('right');

  protected readonly _backdropPath = computed((): string =>
    this.film()?.backdrop_path
      ? environment.tmdbApiPosterBaseUrl + this.film()?.backdrop_path
      : '/no-movie.png'
  );
}
