import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getPaginationArray } from '../../shared/utils/pagination-array.util';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class PaginationComponent {
  public allPagesCount = input.required<number>();
  public currentPage = input.required<number>();

  protected readonly _math = Math;

  protected _paginationArray = computed<{
    nums: number[];
    leftBack: boolean;
    rightForward: boolean;
  }>((): { nums: number[]; leftBack: boolean; rightForward: boolean } =>
    getPaginationArray(this.currentPage(), this.allPagesCount())
  );

  pageChange = output<number>();

  protected _onClick(page: number): void {
    if (page < 1 || page > this.allPagesCount()! || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }
}
