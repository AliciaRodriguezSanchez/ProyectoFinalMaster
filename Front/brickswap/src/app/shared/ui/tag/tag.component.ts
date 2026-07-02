import { Component, input } from '@angular/core';

export type TagVariant = 'neutral' | 'brand' | 'dark' | 'success' | 'danger';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent {
  label = input.required<string>();
  icon = input('');
  variant = input<TagVariant>('neutral');
}
