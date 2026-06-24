import { Component, input, output } from '@angular/core';

export type SortOrder = 'newest' | 'oldest'

@Component({
  selector: 'app-ordenar-lista',
  imports: [],
  templateUrl: './ordenar-lista.component.html',
  styleUrl: './ordenar-lista.component.css',
})


export class OrdenarListaComponent {
  active = input <SortOrder>('newest');
  changed = output<SortOrder>();

  toggle() {
    const newValue: SortOrder = this.active() === 'newest' ? 'oldest' : 'newest';
    this.changed.emit(newValue);
  }
}
