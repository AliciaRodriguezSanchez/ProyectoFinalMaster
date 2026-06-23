import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-empty-state',
  standalone: false,
  templateUrl: './message-empty-state.html',
  styleUrl: './message-empty-state.css',
})
export class MessageEmptyStateComponent {
  @Input() text =
    'Inicia la conversación enviando un mensaje, haciendo una oferta de precio o proponiendo un método de entrega.';
}
