import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';
import { CardPanelComponent } from '../../shared/card-panel/card-panel.component';
import { ChangeDetectorRef, Component, signal } from '@angular/core';

import { IStat } from '../../interfaces/istat.interface';
import { ArticleService } from '../../core/services/article/article.service';
import { UserService } from '../../core/services/user/user.service';
import { ReportService } from '../../core/services/report/report.service';
import { AdminPanelCardComponent } from '../../shared/components/admin-panel-card/admin-panel-card.component';
import { IAdminPanelCard } from '../../interfaces/iadmin-panel-card.interface';
import { IUsersTable } from '../../interfaces/iusers-table.interface';
import { isActive, Router } from '@angular/router';
import { TableComponent } from '../../shared/table/table.component';

import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';
import { CardPanelComponent } from '../../shared/card-panel/card-panel.component';

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

@Component({
  selector: 'app-admin',
  imports: [TitleComponent, DescriptionsComponent, CardPanelComponent, AdminPanelCardComponent, TableComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage {
  totalStadistics = signal<IStat[]>([]);
  activeSection = signal<AdminSection | null>(null);
  users = signal<IUsersTable[]>([]);
  @ViewChild('userListSection') userListSection!: ElementRef;

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(){
    this.obtenerEstadisticasGlobales();
  }

  async seleccionarCard(card: IAdminPanelCard) {
    if (card.id === 'moderation') {
      this.router.navigate(['/moderador']);
      return;
    }

    if (card.id === 'categories') {
      this.router.navigate(['/categorias']);
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
        isActive: user.estado_cuenta === 'Activo' 
      }));

      this.users.set(usuariosMapeados);

    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.users.set([]);
    }
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

  async toogleState(id:string){
    try{
      await this.userService.getStateChange(id);

      this.users.update(usuario => usuario.map(user =>{
        if(user.id === id){
          return {...user, isActive:!user.isActive};
        }
        return user;
      }))
    }catch (error){
      console.error('Error al cambiar el estado del perfil', error)
    }
  }

  async cambiarRolUsuario(evento: { id: number, newRole: string }) {
    try {
      await this.userService.getRolChange(evento.id, evento.newRole);

      this.users.update(usuariosActuales => 
        usuariosActuales.map(user => {
          if (user.id === evento.id) {
            return { ...user, role: evento.newRole };
          }
          return user;
        })
      );
      
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
    }
  }
}