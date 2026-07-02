import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';
import { CardPanelComponent } from '../../shared/card-panel/card-panel.component';

import { IStat } from '../../interfaces/istat.interface';
import { ArticleService } from '../../core/services/article/article.service';
import { UserService } from '../../core/services/user/user.service';
import { ReportService } from '../../core/services/report/report.service';
import { AdminPanelCardComponent } from '../../shared/components/admin-panel-card/admin-panel-card.component';
import { IAdminPanelCard } from '../../interfaces/iadmin-panel-card.interface';
import { IUsersTable } from '../../interfaces/iusers-table.interface';
import { Router, RouterLink } from '@angular/router';
import { TableComponent } from '../../shared/table/table.component';
import { APP_NAVIGATION_PATHS } from '../../core/constants/user-role';
import { PillComponent } from '../../shared/ui/pill/pill.component';
import { UiToastService } from '../../core/services/toast/ui-toast.service';
import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { ActionModalComponent } from '../../shared/components/action-modal/action-modal.component';


const CONFIGURACION_GLOBAL: Record<string, any> = {
  'Usuarios totales': {
    icon: 'bi-people-fill',
    color: 'text-primary',
    bgClass: 'bg-primary-subtle',
  },
  'Artículos publicados': {
    icon: 'bi-box-seam',
    color: 'text-success',
    bgClass: 'bg-success-subtle',
  },
  'Artículos vendidos': {
    icon: 'bi-graph-up-arrow',
    color: 'text-info',
    bgClass: 'bg-info-subtle',
  },
  'En revisión': {
    icon: 'bi-exclamation-triangle-fill',
    color: 'text-warning',
    bgClass: 'bg-warning-subtle',
  },
  'Reportes pendientes': {
    icon: 'bi-exclamation-circle-fill',
    color: 'text-danger',
    bgClass: 'bg-danger-subtle',
  },
};

const ORDEN_TARJETAS = [
  'Usuarios totales',
  'Artículos publicados',
  'Artículos vendidos',
  'En revisión',
  'Reportes pendientes',
];

type AdminSection = 'users' | 'categories' | 'moderation';
type UserStatusFilter = 'all' | 'active' | 'blocked';
type UserRoleFilter = 'all' | 'users' | 'moderators' | 'admins';
type UserSortOrder = 'newest' | 'oldest';
type PendingStatusChange = { id: string; userName: string; isActive: boolean };
type PendingRoleChange = { id: number; userName: string; currentRoleId: number; newRoleId: number };

@Component({
  selector: 'app-admin',
  imports: [FormsModule, TitleComponent, DescriptionsComponent, CardPanelComponent, AdminPanelCardComponent, TableComponent, RouterLink, PillComponent, ActionModalComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage {
  totalStadistics = signal<IStat[]>([]);
  activeSection = signal<AdminSection | null>(null);
  users = signal<IUsersTable[]>([]);
  usersSearchText = '';
  activeUserStatusFilter: UserStatusFilter = 'all';
  activeUserRoleFilter: UserRoleFilter = 'all';
  showUserFilters = false;
  userSortOrder: UserSortOrder = 'newest';
  roleSelectResetKey = signal(0);
  pendingStatusChange: PendingStatusChange | null = null;
  pendingRoleChange: PendingRoleChange | null = null;
  @ViewChild('userListSection') userListSection!: ElementRef;

  userStatusFilters: Array<{ label: string; value: UserStatusFilter }> = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Bloqueados', value: 'blocked' },
  ];

  userRoleFilters: Array<{ label: string; value: UserRoleFilter }> = [
    { label: 'Todos los roles', value: 'all' },
    { label: 'Usuarios', value: 'users' },
    { label: 'Moderadores', value: 'moderators' },
    { label: 'Admins', value: 'admins' },
  ];

  adminCards: IAdminPanelCard[] = [
    {
      id: 'users',
      icon: 'bi bi-people',
      title: 'Usuarios y roles',
      description: 'Gestionar usuarios',
      colorClass: 'bg-primary-subtle text-primary',
    },
    {
      id: 'categories',
      icon: 'bi bi-tags',
      title: 'Categorías',
      description: 'Crear, editar, eliminar',
      colorClass: 'bg-warning-subtle text-warning',
    },
    {
      id: 'moderation',
      icon: 'bi bi-shield',
      title: 'Panel de moderación',
      description: 'Revisar reportes',
      colorClass: 'bg-danger-subtle text-danger',
    },
  ];

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private userService: UserService,
    private reportService: ReportService,
    private toastService: UiToastService
  ) {}

  ngOnInit(){
    if (this.router.url === APP_NAVIGATION_PATHS.administrationUsers) {
      this.activeSection.set('users');
      this.cargarUsuarios();
      return;
    }

    this.obtenerEstadisticasGlobales();
  }

  isUsersManagementPage(): boolean {
    return this.router.url === APP_NAVIGATION_PATHS.administrationUsers;
  }

  get filteredUsers(): IUsersTable[] {
    const normalizedSearch = this.usersSearchText.trim().toLowerCase();

    return this.users().filter((user) => {
      const name = user.name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const role = user.role?.toLowerCase() || '';
      const matchesSearch = !normalizedSearch ||
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        role.includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      return this.matchesUserQuickFilter(user);
    });
  }

  selectUserStatusFilter(filter: string): void {
    this.activeUserStatusFilter = filter as UserStatusFilter;
  }

  selectUserRoleFilter(filter: string): void {
    this.activeUserRoleFilter = filter as UserRoleFilter;
    this.showUserFilters = false;
  }

  activeUserFilterLabel(): string {
    const statusLabel = this.userStatusFilters.find((filter) => filter.value === this.activeUserStatusFilter)?.label || 'Todos';
    const roleLabel = this.userRoleFilters.find((filter) => filter.value === this.activeUserRoleFilter)?.label || 'Todos los roles';

    return `${statusLabel} · ${roleLabel}`;
  }

  toggleUserFilters(): void {
    this.showUserFilters = !this.showUserFilters;
  }

  getUserSortLabel(): string {
    return this.userSortOrder === 'newest' ? 'Más reciente' : 'Más antiguo';
  }

  ordenarUsuarios(): void {
    this.userSortOrder = this.userSortOrder === 'newest' ? 'oldest' : 'newest';
    this.users.update((users) => this.sortUsers(users));
  }

  private sortUsers(users: IUsersTable[]): IUsersTable[] {
    return [...users].sort((firstUser, secondUser) => {
      const firstId = Number(firstUser.id) || 0;
      const secondId = Number(secondUser.id) || 0;

      return this.userSortOrder === 'newest'
        ? secondId - firstId
        : firstId - secondId;
    });
  }

  private matchesUserQuickFilter(user: IUsersTable): boolean {
    const role = user.role?.toLowerCase() || '';

    if (this.activeUserStatusFilter === 'active' && !user.isActive) {
      return false;
    }

    if (this.activeUserStatusFilter === 'blocked' && user.isActive) {
      return false;
    }

    if (this.activeUserRoleFilter === 'users') {
      return role === 'usuario' || role === 'user';
    }

    if (this.activeUserRoleFilter === 'moderators') {
      return role === 'moderador' || role === 'moderator';
    }

    if (this.activeUserRoleFilter === 'admins') {
      return role === 'admin' || role === 'administrador';
    }

    return true;
  }

  async seleccionarCard(card: IAdminPanelCard) {
    if (card.id === 'users') {
      this.router.navigate([APP_NAVIGATION_PATHS.administrationUsers]);
      return;
    }

    if (card.id === 'moderation') {
      this.router.navigate([APP_NAVIGATION_PATHS.administrationModerator]);
      return;
    }

    if (card.id === 'categories') {
      this.router.navigate([APP_NAVIGATION_PATHS.administrationCategories]);
      return;
    }

    if (this.activeSection() === card.id) {
      this.activeSection.set(null);
      return;
    }

    this.activeSection.set(card.id);

    if (card.id === 'users') {
      this.cargarUsuarios();
      setTimeout(() => {
        this.userListSection?.nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }

  async obtenerEstadisticasGlobales() {
    try {
      const fallback = [{ 'COUNT(*)': 0 }];

      const [
        totalUsuarios,
        totalPublicados,
        totalVendidos,
        totalRevision,
        totalReportes,
      ] = await Promise.all([
        this.userService.getNumberUsers().catch(() => fallback),
        this.articleService.getNumberArticles().catch(() => fallback),
        this.articleService.getNumberArticlesSold().catch(() => fallback),
        this.articleService.getNumberArticlesReview().catch(() => fallback),
        this.reportService.getReportsP().catch(() => fallback),
      ]);

      const estadisticasMapeadas = ORDEN_TARJETAS.map(label => {
        let total = 0;
        
        if (label === 'Usuarios totales') total = totalUsuarios[0]['COUNT(*)'];
        if (label === 'Artículos publicados') total = totalPublicados[0]['COUNT(*)'];
        if (label === 'Artículos vendidos') total = totalVendidos[0]['COUNT(*)'];
        if (label === 'En revisión') total = totalRevision[0]['COUNT(*)'];
        if (label === 'Reportes pendientes') total = totalReportes[0]['COUNT(*)'];

        if (label === 'Artículos vendidos') {
          total = totalVendidos[0]['COUNT(*)'];
        }

        if (label === 'En revisión') {
          total = totalRevision[0]['COUNT(*)'];
        }

        if (label === 'Reportes pendientes') {
          total = totalReportes[0]['COUNT(*)'];
        }

        const configVisual = CONFIGURACION_GLOBAL[label] || {
          icon: 'bi-question-circle',
          color: 'text-secondary',
          bgClass: 'bg-secondary-subtle',
        };

        return {
          label,
          stadistics: total,
          icon: configVisual.icon,
          color: configVisual.color,
          bgClass: configVisual.bgClass,
        };
      });

      this.totalStadistics.set(estadisticasMapeadas);

    } catch (error) {
      console.error(
        'Error general al cargar las estadísticas:',
        error
      );
    }
  }

  async cargarUsuarios() {
    try {
      const data: any = await this.userService.getUsuarios();

      const usuariosMapeados: IUsersTable[] = data.map((user: any) => ({
        id: user.id,
        name: `${user.nombre} ${user.apellidos}`.trim(),
        email: user.email,
        role: user.nombre_rol,
        roleId: this.getUserRoleId(user),
        isActive: user.estado_cuenta === 'Activo' 
      }));

      this.users.set(this.sortUsers(usuariosMapeados));

    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.users.set([]);
    }
  }

  private getUserRoleId(user: any): number {
    const roleId = Number(user.rol_id);

    if ([1, 2, 3].includes(roleId)) {
      return roleId;
    }

    const normalizedRole = String(user.nombre_rol || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    if (normalizedRole === 'moderador' || normalizedRole === 'moderator') {
      return 2;
    }

    if (normalizedRole === 'administrador' || normalizedRole === 'admin') {
      return 3;
    }

    return 1;
  }

  private getRoleLabel(roleId: number): string {
    const labels: Record<number, string> = {
      1: 'Usuario',
      2: 'Moderador',
      3: 'Administrador',
    };

    return labels[roleId] || labels[1];
  }

  async eliminarUsuario(userId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
      try {
        await this.userService.deleteUser(userId);
        this.users.update(users => users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  toogleState(id:string){
    const user = this.users().find((currentUser) => String(currentUser.id) === String(id));

    if (!user) {
      return;
    }

    this.pendingStatusChange = {
      id: String(id),
      userName: user.name,
      isActive: user.isActive,
    };
  }

  closeStatusChangeModal(): void {
    this.pendingStatusChange = null;
  }

  getStatusChangeModalTitle(): string {
    return MESSAGE_TEXT.admin.statusChangeModalTitle;
  }

  getStatusChangeModalDescription(): string {
    if (!this.pendingStatusChange) {
      return '';
    }

    const action = this.pendingStatusChange.isActive ? 'bloquear' : 'activar';

    return `${MESSAGE_TEXT.admin.statusChangeModalMessage} Vas a ${action} a ${this.pendingStatusChange.userName}.`;
  }

  getStatusChangeModalSubmitLabel(): string {
    return MESSAGE_TEXT.admin.statusChangeModalSubmit;
  }

  getStatusChangeModalCancelLabel(): string {
    return MESSAGE_TEXT.admin.statusChangeModalCancel;
  }

  async confirmStatusChange(): Promise<void> {
    if (!this.pendingStatusChange) {
      return;
    }

    const statusChange = this.pendingStatusChange;

    try{
      await this.userService.getStateChange(statusChange.id);
      await this.cargarUsuarios();

      this.toastService.success(MESSAGE_TEXT.admin.statusChangeSuccess);
      this.closeStatusChangeModal();
    }catch (error){
      console.error('Error al cambiar el estado del perfil', error);
      this.toastService.error(MESSAGE_TEXT.admin.statusChangeError);
    }
  }

  async cambiarRolUsuario(evento: { id: number, newRole: string }) {
    const user = this.users().find((currentUser) => currentUser.id === evento.id);
    const newRoleId = Number(evento.newRole);

    if (!user || user.roleId === newRoleId) {
      return;
    }

    this.pendingRoleChange = {
      id: evento.id,
      userName: user.name,
      currentRoleId: user.roleId,
      newRoleId,
    };
  }

  closeRoleChangeModal(): void {
    this.pendingRoleChange = null;
    this.roleSelectResetKey.update((value) => value + 1);
  }

  getRoleChangeModalTitle(): string {
    return MESSAGE_TEXT.admin.roleChangeModalTitle;
  }

  getRoleChangeModalDescription(): string {
    if (!this.pendingRoleChange) {
      return '';
    }

    return `¿Seguro que quieres cambiar el rol de ${this.pendingRoleChange.userName}?`;
  }

  getRoleChangeModalSubmitLabel(): string {
    return MESSAGE_TEXT.admin.roleChangeModalSubmit;
  }

  getRoleChangeModalCancelLabel(): string {
    return MESSAGE_TEXT.admin.roleChangeModalCancel;
  }

  async confirmRoleChange(): Promise<void> {
    if (!this.pendingRoleChange) {
      return;
    }

    const roleChange = this.pendingRoleChange;

    try {
      await this.userService.getRolChange(roleChange.id, String(roleChange.newRoleId));
      this.users.update((users) =>
        users.map((user) => {
          if (Number(user.id) !== Number(roleChange.id)) {
            return user;
          }

          return {
            ...user,
            role: this.getRoleLabel(roleChange.newRoleId),
            roleId: roleChange.newRoleId,
          };
        })
      );
      this.toastService.success(MESSAGE_TEXT.admin.roleChangeSuccess);
      this.pendingRoleChange = null;
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      this.toastService.error(MESSAGE_TEXT.admin.roleChangeError);
      this.roleSelectResetKey.update((value) => value + 1);
      this.pendingRoleChange = null;
    }
  }
}
