import { Component, computed, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { UserRole } from '../../../core/constants/user-role';
import { decodeJwtPayload } from '../../../core/utils/jwt';
import { CatalogFiltersService } from '../../../core/services/catalog-filters/catalog-filters.service';
import { UiLogoComponent } from '../../ui/logo/ui-logo.component';

interface HeaderTokenPayload {
  role: UserRole;
  name?: string;
  surname?: string;
  username?: string;
}

interface HeaderNavItem {
  label: string;
  route: string;
  icon?: 'home' | 'search' | 'messages';
}

@Component({
  selector: 'app-header',
  imports: [NgFor, RouterLink, RouterLinkActive, UiLogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  catalogFiltersService = inject(CatalogFiltersService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  role = signal(this.getCurrentRole());
  currentUrl = signal(this.router.url);
  navItems = computed(() => this.getNavItemsByRole(this.role()));
  profileRoute = computed(() => this.role() ? '/profile' : '/login');
  profileLabel = computed(() => this.role() ? 'Perfil' : 'Iniciar sesion');
  userInitials = signal(this.getUserInitials());
  isMenuOpen = signal(false);
  showCatalogFiltersButton = computed(() => this.isCatalogRoute());
  isProfileRoute = computed(() => this.currentUrl().split('?')[0] === '/profile');

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.role.set(null);
    this.userInitials.set('');
    this.closeMenu();
    this.router.navigate(['/home']);
  }

  openCatalogFilters(): void {
    this.catalogFiltersService.open();
  }

  private getCurrentRole(): UserRole | null {
    return this.getTokenPayload()?.role ?? null;
  }

  private getTokenPayload(): HeaderTokenPayload | null {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      return decodeJwtPayload<HeaderTokenPayload>(token);
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  }

  private getUserInitials(): string {
    const payload = this.getTokenPayload();

    if (!payload) {
      return '';
    }

    const firstInitial = payload.name?.trim().charAt(0);
    const secondInitial = payload.surname?.trim().charAt(0) || payload.username?.trim().charAt(0);

    return `${firstInitial || 'U'}${secondInitial || ''}`.toUpperCase();
  }

  private getNavItemsByRole(role: UserRole | null): HeaderNavItem[] {
    if (!role) {
      return [
        { label: 'Buscar', route: '/categories', icon: 'search' },
      ];
    }

    const roleHomeRoutes: Record<UserRole, HeaderNavItem> = {
      [UserRole.USER]: { label: 'Mi panel', route: '/my-panel', icon: 'home' },
      [UserRole.MODERATOR]: { label: 'Panel moderacion', route: '/moderador', icon: 'home' },
      [UserRole.ADMIN]: { label: 'Panel administracion', route: '/administration', icon: 'home' },
    };

    if (role === UserRole.USER) {
      return [
        roleHomeRoutes[role],
        { label: 'Catalogo', route: '/catalog', icon: 'search' },
        { label: 'Mensajes', route: '/messages', icon: 'messages' },
      ];
    }

    return [
      roleHomeRoutes[role],
      { label: 'Catalogo', route: '/catalog', icon: 'search' },
      { label: 'Mensajes', route: '/messages', icon: 'messages' },
    ];
  }

  private isHomeRoute(): boolean {
    return this.currentUrl() === '/home' || this.currentUrl() === '/';
  }

  private isCatalogRoute(): boolean {
    const url = this.currentUrl().split('?')[0];
    return url === '/catalog' || url === '/categories';
  }
}
