import { Component, Output, EventEmitter, effect, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-sidebar',
  imports: [FormsModule],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.css'
})
export class FilterSidebar {
  searchText: string = '';
  hasActiveFilters = input(false);
  activeFiltersCount = input(0);
  searchTextValue = input('');

  @Output() onFilterChange = new EventEmitter<string>();
  @Output() onReset = new EventEmitter<void>(); 

  constructor() {
    effect(() => {
      this.searchText = this.searchTextValue();
    });
  }

  applyFilters() {
    
    this.onFilterChange.emit(this.searchText);
  }

  resetFilters() {
    this.searchText = '';
    this.onReset.emit();
  }
}
