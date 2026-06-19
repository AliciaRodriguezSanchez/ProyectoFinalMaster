import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'BrickSwap';

  readonly isAuthLayout = signal(false);
  readonly isHomeLayout = signal(false);

  constructor(private router: Router) {
    this.updateLayout(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateLayout(event.urlAfterRedirects));
  }

  private updateLayout(url: string): void {
    this.isAuthLayout.set(url.startsWith('/login') || url.startsWith('/auth/'));
    this.isHomeLayout.set(url === '/home' || url === '/');
  }
}
