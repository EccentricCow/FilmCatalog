import {
  AfterViewInit,
  Component,
  computed, ElementRef,
  inject,
  input, PLATFORM_ID, signal,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import {FilmPopoverService} from '../../services/film-popover.service';
import {FilmPopover} from '../film-popover/film-popover';
import {isPlatformServer} from '@angular/common';
import {FilmType} from '../../../types/film.type';

@Component({
  selector: 'film-card',
  imports: [
    FilmPopover
  ],
  templateUrl: './film-card.html',
  styleUrl: './film-card.scss',
})
export class FilmCard implements AfterViewInit {
  public film = input.required<FilmType>();

  protected readonly _posterPath = computed((): string =>
    this.film().poster_path
      ? environment.tmdbApiPosterBaseUrl + this.film().poster_path
      : '/no-movie.png'
  );

  // popover logic
  protected readonly _filmPopoverService = inject(FilmPopoverService);
  constructor(private el: ElementRef) {  }

  popoverPosition = signal<'left' | 'right'>('right');
  protected _isPopoverVisible = computed<boolean>((): boolean => {
    return this._filmPopoverService.activeFilm() === this.film().id;
  });

  private readonly _platformId = inject(PLATFORM_ID);
  public ngAfterViewInit(): void {
    if (!isPlatformServer(this._platformId)) {
      const cardRect = (this.el.nativeElement as HTMLDivElement).getBoundingClientRect();
      const screenWidth = window.innerWidth;
      cardRect.right + cardRect.width + 10 > screenWidth ? this.popoverPosition.set('left') : this.popoverPosition.set('right');
    }
  }

  protected _onMouseEnter(): void {
    this._filmPopoverService.setHoveredFilm(this.film().id)
  }

  protected _onMouseLeave(): void {
    this._filmPopoverService.setHoveredFilm(null)
  }
}
