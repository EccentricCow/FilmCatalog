import {
  afterNextRender,
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  Inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FilmPopoverService } from '../../services/film-popover.service';
import { FilmPopover } from '../film-popover/film-popover';
import { isPlatformServer, NgOptimizedImage } from '@angular/common';
import { FilmType } from '../../../types/film.type';
import { ImageService } from '../../services/img-size.service';

@Component({
  selector: 'film-card',
  imports: [FilmPopover, NgOptimizedImage],
  templateUrl: './film-card.html',
  styleUrl: './film-card.scss',
})
export class FilmCard implements AfterViewInit, OnInit {
  public film = input.required<FilmType>();
  public priority = input.required<boolean>();

  protected readonly _posterPath = computed((): string => {
    if (!this.film().poster_path) return '/no-movie.png';

    if (this._hasHydrated()) {
      return this._imageService.getPosterUrl(this.film().poster_path);
    }

    return '';
  });

  private _isDesktop = signal(true);
  protected _popoverPosition = signal<'left' | 'right'>('right');
  protected _enterClass = signal('enter-animation');

  protected readonly _isPopoverVisible = computed<boolean>((): boolean => {
    return this._filmPopoverService.activeFilm() === this.film().id;
  });

  private _hasHydrated = signal<boolean>(false);
  protected _imageLoaded = signal<boolean>(false);

  constructor(
    private readonly _el: ElementRef,
    @Inject(PLATFORM_ID) private readonly _platformId: Object,
    private readonly _filmPopoverService: FilmPopoverService,
    private readonly _imageService: ImageService
  ) {
    afterNextRender(() => this._setPopoverPosition());
  }

  public ngOnInit(): void {
    if (!isPlatformServer(this._platformId)) {
      this._hasHydrated.set(true);
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this._platformId)) return;

    const mediaQuery = window.matchMedia('(min-width: 769px)');
    this._isDesktop.set(mediaQuery.matches);

    mediaQuery.addEventListener('change', (e) => this._isDesktop.set(e.matches));
  }

  private _setPopoverPosition(): void {
    const rect = this._el.nativeElement.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const shouldBeLeft = rect.right + rect.width + 10 > screenWidth;
    this._popoverPosition.set(shouldBeLeft ? 'left' : 'right');
  }

  protected _onMouseEnter(): void {
    if (this._isDesktop()) {
      this._filmPopoverService.setHoveredFilm(this.film().id);
    }
  }

  protected _onMouseLeave(): void {
    if (this._isDesktop()) {
      this._filmPopoverService.setHoveredFilm(null);
    }
  }

  protected _onClick(): void {
    if (!this._isDesktop()) {
      const active = this._filmPopoverService.activeFilm() === this.film().id;
      this._filmPopoverService.setHoveredFilm(active ? null : this.film().id);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this._isDesktop() && this._isPopoverVisible()) {
      const clickedInside = this._el.nativeElement.contains(event.target);
      if (!clickedInside) {
        this._filmPopoverService.setHoveredFilm(null);
      }
    }
  }
}
