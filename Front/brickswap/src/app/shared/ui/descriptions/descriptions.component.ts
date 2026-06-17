import { Component, input } from '@angular/core';

@Component({
  selector: 'app-descriptions',
  imports: [],
  templateUrl: './descriptions.component.html',
  styleUrl: './descriptions.component.css',
})
export class DescriptionsComponent {
    text = input<string>();
    format = input<'body' | 'label'>('body');
}
