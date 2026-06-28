import {
  Component,
  ElementRef,
  computed,
  input,
  viewChild,
} from '@angular/core';

import { UiCarrouselItem } from './carrousel.interface';

export type UiCarrouselSkeletonVariant = 'category' | 'product';

@Component({
  selector: 'ui-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
})
export class UiCarrouselComponent {
  items = input<UiCarrouselItem[]>([]);
  isLoading = input(false);
  skeletonItems = input(7);
  skeletonVariant = input<UiCarrouselSkeletonVariant>('category');
  skeletonPlaceholders = computed(() => Array.from({ length: this.skeletonItems() }));

  private track = viewChild<ElementRef<HTMLElement>>('track');

  scrollBy(direction: -1 | 1): void {
    this.track()?.nativeElement.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  }
}
