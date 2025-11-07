import {
  AfterViewInit,
  Component,
  computed, ElementRef, HostListener,
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
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isDesktop() && this._isPopoverVisible()) {
      const clickedInside = this.el.nativeElement.contains(event.target);
      if (!clickedInside) {
        this._filmPopoverService.setHoveredFilm(null);
      }
    }
  }

  protected readonly _filmPopoverService = inject(FilmPopoverService);
  constructor(private el: ElementRef) {  }
  protected readonly isDesktop = signal(true);

  popoverPosition = signal<'left' | 'right'>('right');
  protected _isPopoverVisible = computed<boolean>((): boolean => {
    return this._filmPopoverService.activeFilm() === this.film().id;
  });

  private readonly _platformId = inject(PLATFORM_ID);
  public ngAfterViewInit(): void {
    if (!isPlatformServer(this._platformId)) {
      const mediaQuery = window.matchMedia('(min-width: 769px)');
      this.isDesktop.set(mediaQuery.matches);

      mediaQuery.addEventListener('change', e => {
        this.isDesktop.set(e.matches);
      });

      if (this.isDesktop()) {
        const cardRect = (this.el.nativeElement as HTMLDivElement).getBoundingClientRect();
        const screenWidth = window.innerWidth;
        cardRect.right + cardRect.width + 10 > screenWidth
          ? this.popoverPosition.set('left')
          : this.popoverPosition.set('right');
      }
    }
  }

  protected _onMouseEnter(): void {
    if (this.isDesktop()) {
      this._filmPopoverService.setHoveredFilm(this.film().id);
    }
  }

  protected _onMouseLeave(): void {
    if (this.isDesktop()) {
      this._filmPopoverService.setHoveredFilm(null);
    }
  }

  protected _onClick(): void {
    if (!this.isDesktop()) {
      const active = this._filmPopoverService.activeFilm() === this.film().id;
      this._filmPopoverService.setHoveredFilm(active ? null : this.film().id);
    }
  }
}
