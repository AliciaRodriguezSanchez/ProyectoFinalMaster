import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'ui-category-form-modal',
  imports: [FormsModule],
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss',
})
export class UiCategoryFormModalComponent {
  @Input() title = 'Nueva categoría';
  @Input() name = '';
  @Input() description = '';
  @Input() icon = '';

  @Output() canceled = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CategoryFormData>();

  cancel(): void {
    this.canceled.emit();
  }

  save(): void {
    if (!this.name.trim()) {
      return;
    }

    this.saved.emit({
      name: this.name.trim(),
      description: this.description.trim(),
      icon: this.icon.trim() || '🧱',
    });
  }
}
