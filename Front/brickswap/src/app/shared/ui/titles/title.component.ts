import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent {
    text = input<string>();
    size = input<'small' | 'medium' | 'large'>('medium');
}
