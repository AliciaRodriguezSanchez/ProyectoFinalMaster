import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-sidebar',
  imports: [FormsModule],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.css'
})
export class FilterSidebar {
  searchText: string = '';

  @Output() onFilterChange = new EventEmitter<string>();
  @Output() onReset = new EventEmitter<void>(); 

  applyFilters() {
    
    this.onFilterChange.emit(this.searchText);
  }

  resetFilters() {
    this.searchText = '';
    this.onReset.emit();
  }
}
