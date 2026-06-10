import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardPanelComponent } from './shared/card-panel/card-panel.component';
import { InfoCardComponent } from './shared/info-card/info-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardPanelComponent, InfoCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('brickswap');
}
