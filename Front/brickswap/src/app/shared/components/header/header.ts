import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../../core/constants/user-role';
import { decodeJwtPayload } from '../../../core/utils/jwt';
import { UiLogoComponent } from '../../ui/logo/ui-logo.component';

interface HeaderTokenPayload {
  role: UserRole;
}

interface HeaderNavItem {
  label: string;
  route: string;
  icon?: 'home' | 'search';
}

@Component({
  selector: 'app-header',
  imports: [NgFor, RouterLink, RouterLinkActive, UiLogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) {}

  role = this.getCurrentRole();
  navItems = this.getNavItemsByRole(this.role);
  profileRoute = this.role ? '/profile' : '/login';
  profileLabel = this.role ? 'Perfil' : 'Iniciar sesion';
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.closeMenu();
    this.router.navigate(['/home']);
  }

  private getCurrentRole(): UserRole | null {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      return decodeJwtPayload<HeaderTokenPayload>(token).role;
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  }

  private getNavItemsByRole(role: UserRole | null): HeaderNavItem[] {
    if (!role) {
      return [
        { label: 'Buscar', route: '/catalog', icon: 'search' },
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
        { label: 'Mensajes', route: '/messages' },
      ];
    }

    return [
      roleHomeRoutes[role],
      { label: 'Mensajes', route: '/messages' },
    ];
  }
}
