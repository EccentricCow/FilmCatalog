import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';

@Component({
  selector: 'search-input',
  imports: [ReactiveFormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);

  protected _searchedField = new FormControl('');

  public search = output<string>();

  public ngOnInit(): void {
    this._searchedField.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) => this.search.emit(value || '')),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }
}
