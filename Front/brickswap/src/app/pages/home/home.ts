import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  stats = [
    { value: '2.4K+', label: 'Articulos activos' },
    { value: '800+', label: 'Usuarios' },
    { value: '98%', label: 'Satisfaccion' },
  ];

  categories = [
    'Sets completos',
    'Minifiguras',
    'Piezas sueltas',
    'Colecciones vintage',
  ];
}
