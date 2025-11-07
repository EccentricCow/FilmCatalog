import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';

@Directive({
  selector: '[appRatingColor]'
})
export class RatingColor implements OnChanges {
  @Input('appRatingColor') rating: number | undefined = undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(): void {
    if (this.rating == null) return;

    let color = '';

    if (this.rating < 5) color = 'red';
    else if (this.rating < 7) color = 'orange';
    else color = 'green';

    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
