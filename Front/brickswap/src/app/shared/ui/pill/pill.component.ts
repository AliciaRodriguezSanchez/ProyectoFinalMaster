import { Component, EventEmitter, input, Output, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-pill',
  imports: [],
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.css',
})
export class PillComponent {
  label = input.required<string>();
  value = input.required<string>();
  active = input<boolean>(false);
  selected = output<string>();
 

  onClick() {
    this.selected.emit(this.value());
  }
}
