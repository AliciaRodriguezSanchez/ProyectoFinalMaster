import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
} from '@angular/core';

import { UiCategoryCardComponent } from '../category-card/category-card.component';

export interface UiCarrouselItem {
  icon: string;
  color: string;
  text: string;
}

@Component({
  selector: 'ui-carrousel',
  imports: [UiCategoryCardComponent],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCarrouselComponent {
  items = input.required<UiCarrouselItem[]>();

  @ViewChild('track')
  private track?: ElementRef<HTMLElement>;

  scrollBy(direction: -1 | 1): void {
    this.track?.nativeElement.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  }
}
