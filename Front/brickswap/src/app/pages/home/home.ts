import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header],
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
