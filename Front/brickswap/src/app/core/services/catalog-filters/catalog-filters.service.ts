import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CatalogFiltersService {
  isOpen = signal(false);
  hasActiveFilters = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  setHasActiveFilters(hasActiveFilters: boolean): void {
    this.hasActiveFilters.set(hasActiveFilters);
  }
}
