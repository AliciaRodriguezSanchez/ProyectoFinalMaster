import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
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
  canScrollPrevious = signal(false);
  canScrollNext = signal(false);

  private track = viewChild<ElementRef<HTMLElement>>('track');
  private destroyRef = inject(DestroyRef);
  private animationFrameId: number | null = null;

  constructor() {
    afterNextRender(() => this.queueScrollControlUpdate());

    effect(() => {
      this.isLoading();
      this.items();
      this.skeletonItems();
      this.skeletonVariant();
      this.queueScrollControlUpdate();
    });

    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.queueScrollControlUpdate();
  }

  scrollBy(direction: -1 | 1): void {
    this.track()?.nativeElement.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  }

  updateScrollControls(): void {
    const track = this.track()?.nativeElement;

    if (!track) {
      this.canScrollPrevious.set(false);
      this.canScrollNext.set(false);
      return;
    }

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const hasOverflow = maxScrollLeft > 1;

    this.canScrollPrevious.set(hasOverflow && track.scrollLeft > 1);
    this.canScrollNext.set(hasOverflow && track.scrollLeft < maxScrollLeft - 1);
  }

  private queueScrollControlUpdate(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = null;
      this.updateScrollControls();
    });
  }
}
