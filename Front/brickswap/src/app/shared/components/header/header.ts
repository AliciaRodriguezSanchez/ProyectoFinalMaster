import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { APP_NAVIGATION_PATHS, UserRole } from '../../../core/constants/user-role';
import { decodeJwtPayload } from '../../../core/utils/jwt';
import { CatalogFiltersService } from '../../../core/services/catalog-filters/catalog-filters.service';
import { UiLogoComponent } from '../../ui/logo/ui-logo.component';
import { TOKEN_KEY } from '../../../core/constants/auth';
import { HeaderNavItem, HeaderTokenPayload } from './header.interface';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, UiLogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  catalogFiltersService = inject(CatalogFiltersService);

  constructor() {
    // Se suscribe a los eventos de navegación del Router y,
    //  al finalizar cada cambio de ruta, actualiza la URL actual y refresca el estado de autenticación/autorización del usuario.
    //Usuario pulsa "Catálogo". => Router navega a /catalog => NavigationEnd => currentUrl = "/catalog" => refreshUserState() => Se recalculan login, rol y permisos => Navbar se actualiza
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.refreshUserState();
      });
  }

  role = signal(this.getCurrentRole());
  currentUrl = signal(this.router.url);
  navItems = computed(() => this.getNavItemsByRole(this.role()));
  profileRoute = computed(() => this.role() ? APP_NAVIGATION_PATHS.profile : APP_NAVIGATION_PATHS.login);
  profileLabel = computed(() => this.role() ? 'Perfil' : 'Iniciar sesion');
  userInitials = signal(this.getUserInitials());
  isMenuOpen = signal(false);
  showCatalogFiltersButton = computed(() => this.isCatalogRoute());
  isProfileRoute = computed(() => this.currentUrl().split('?')[0] === APP_NAVIGATION_PATHS.profile);

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 991.98) {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.refreshUserState();
    this.closeMenu();
    this.router.navigate([APP_NAVIGATION_PATHS.home]);
  }

  openCatalogFilters(): void {
    this.catalogFiltersService.open();
  }

  private getCurrentRole(): UserRole | null {
    return this.getTokenPayload()?.role ?? null;
  }

  private refreshUserState(): void {
    this.role.set(this.getCurrentRole());
    this.userInitials.set(this.getUserInitials());
  }

  private getTokenPayload(): HeaderTokenPayload | null {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    try {
      return decodeJwtPayload<HeaderTokenPayload>(token);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
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
        { label: 'Buscar', route: APP_NAVIGATION_PATHS.categories, icon: 'search' },
      ];
    }

    const roleHomeRoutes: Record<UserRole, HeaderNavItem> = {
      [UserRole.USER]: { label: 'Mi panel', route: APP_NAVIGATION_PATHS.myPanel, icon: 'home' },
      [UserRole.MODERATOR]: { label: 'Panel moderacion', route: APP_NAVIGATION_PATHS.moderator, icon: 'home' },
      [UserRole.ADMIN]: { label: 'Panel administracion', route: APP_NAVIGATION_PATHS.administration, icon: 'home' },
    };

    if (role === UserRole.USER) {
      return [
        roleHomeRoutes[role],
        { label: 'Catalogo', route: APP_NAVIGATION_PATHS.catalog, icon: 'search' },
        { label: 'Mensajes', route: APP_NAVIGATION_PATHS.messages, icon: 'messages' },
      ];
    }

    return [
      roleHomeRoutes[role],
      { label: 'Catalogo', route: APP_NAVIGATION_PATHS.catalog, icon: 'search' },
      { label: 'Mensajes', route: APP_NAVIGATION_PATHS.messages, icon: 'messages' },
    ];
  }

  private isHomeRoute(): boolean {
    return this.currentUrl() === APP_NAVIGATION_PATHS.home || this.currentUrl() === '/';
  }

  private isCatalogRoute(): boolean {
    const url = this.currentUrl().split('?')[0];
    return url === APP_NAVIGATION_PATHS.catalog || url === APP_NAVIGATION_PATHS.categories;
  }
}
