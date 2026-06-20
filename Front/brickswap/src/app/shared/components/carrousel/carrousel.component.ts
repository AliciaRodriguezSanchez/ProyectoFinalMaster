import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
} from '@angular/core';

export interface UiCarrouselItem {
  id?: number;
  icon: string;
  color: string;
  text: string;
}

@Component({
  selector: 'ui-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCarrouselComponent {
  items = input<UiCarrouselItem[]>([]);
  isLoading = input(false);
  skeletonItems = input(7);

  @ViewChild('track')
  private track?: ElementRef<HTMLElement>;

  scrollBy(direction: -1 | 1): void {
    this.track?.nativeElement.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  }
}
