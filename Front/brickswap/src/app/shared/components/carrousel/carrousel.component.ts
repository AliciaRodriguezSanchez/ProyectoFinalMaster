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
  standalone: true,
  imports: [UiCategoryCardComponent],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCarrouselComponent {
  readonly items = input.required<UiCarrouselItem[]>();

  @ViewChild('track')
  private readonly track?: ElementRef<HTMLElement>;

  scrollBy(direction: -1 | 1): void {
    this.track?.nativeElement.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  }
}
