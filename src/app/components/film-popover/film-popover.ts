import { Component, computed, inject, input, signal } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { RatingColor } from '../../shared/directives/rating-color';
import { FilmType } from '../../../types/film.type';
import { Loader } from '../../components/loader/loader';
import { ImageService } from '../../services/img-size.service';

@Component({
  selector: 'film-popover',
  imports: [DecimalPipe, SlicePipe, RatingColor, Loader],
  templateUrl: './film-popover.html',
  styleUrl: './film-popover.scss',
})
export class FilmPopover {
  private readonly _imageService = inject(ImageService);
  public readonly film = input.required<FilmType>();
  public readonly position = input<'left' | 'right'>('right');

  protected _isLoading = signal<boolean>(true);

  protected readonly _backdropPath = computed((): string =>
    this.film().backdrop_path
      ? this._imageService.getBackdropUrl(this.film().backdrop_path)
      : '/no-movie-sm.png'
  );
}
