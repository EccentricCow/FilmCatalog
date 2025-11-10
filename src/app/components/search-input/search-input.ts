import { isPlatformServer } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  makeStateKey,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export const SEARCH = makeStateKey<any>('search');

@Component({
  selector: 'search-input',
  imports: [ReactiveFormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);

  protected _hasHydrated = signal<boolean>(false);

  public search = output<string>();

  protected _searchedField = new FormControl('');

  public ngOnInit(): void {
    if (isPlatformServer(this._platformId)) return;

    this._hasHydrated.set(true);

    this._searchedField.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) => this.search.emit(value || '')),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }
}
