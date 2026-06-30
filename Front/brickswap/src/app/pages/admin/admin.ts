import { Component, signal } from '@angular/core';
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
import { IAdminCategoryRow } from '../../interfaces/iadmin-category-row.interface';
import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../core/interfaces/icategory.interface';
import { Router } from '@angular/router';
import { TableComponent } from '../../shared/table/table.component';

const CONFIGURACION_GLOBAL: Record<string, any> = {
  'Usuarios totales': { icon: 'bi-people-fill', color: 'text-primary', bgClass: 'bg-primary-subtle' },
  'Artículos publicados': { icon: 'bi-box-seam', color: 'text-success', bgClass: 'bg-success-subtle' },
  'Artículos vendidos': { icon: 'bi-graph-up-arrow', color: 'text-info', bgClass: 'bg-info-subtle' },
  'En revisión': { icon: 'bi-exclamation-triangle-fill', color: 'text-warning', bgClass: 'bg-warning-subtle' },
  'Reportes pendientes': { icon: 'bi-exclamation-circle-fill', color: 'text-danger', bgClass: 'bg-danger-subtle' }
};

const ORDEN_TARJETAS = [
  'Usuarios totales',
  'Artículos publicados',
  'Artículos vendidos',
  'En revisión',
  'Reportes pendientes'
];

type AdminSection = 'users' | 'categories' | 'moderation';

@Component({
  selector: 'app-admin',
  imports: [TitleComponent, DescriptionsComponent, CardPanelComponent, AdminPanelCardComponent, TableComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage {
  totalStadistics=signal<IStat[]>([]);
  activeSection = signal<AdminSection | null>(null);
  users = signal<IUsersTable[]>([]);
  categories = signal<IAdminCategoryRow[]>([]);
  isLoading = signal(false);

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
    private categoryService: CategoryService
  ){}


ngOnInit(){
  this.obtenerEstadisticasGlobales();
}

async seleccionarCard(card: IAdminPanelCard) {
    if (card.id === 'moderation') {
      this.router.navigate(['/moderador']);
      return;
    }

    if (this.activeSection() === card.id) {
      this.activeSection.set(null);
      return;
    }

    this.activeSection.set(card.id);

    if (card.id === 'users') {
      this.cargarUsuarios();
    }

    if (card.id === 'categories') {
      await this.cargarCategorias();
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
        totalReportes
      ] = await Promise.all([
        this.userService.getNumberUsers().catch(() => fallback),
        this.articleService.getNumberArticles().catch(() => fallback),
        this.articleService.getNumberArticlesSold().catch(() => fallback),
        this.articleService.getNumberArticlesReview().catch(() => fallback),
        this.reportService.getReportsP().catch(() => fallback) 
      ]);

      console.log('Respuesta del backend', totalUsuarios, totalPublicados, totalVendidos, totalRevision, totalReportes);


      const estadisticasMapeadas = ORDEN_TARJETAS.map(label => {
        
        let total = 0;
        
        if (label === 'Usuarios totales') total = totalUsuarios[0]['COUNT(*)'];
        if (label === 'Artículos publicados') total = totalPublicados[0]['COUNT(*)'];
        if (label === 'Artículos vendidos') total = totalVendidos[0]['COUNT(*)'];
        if (label === 'En revisión') total = totalRevision[0]['COUNT(*)'];
        if (label === 'Reportes pendientes') total = totalReportes[0]['COUNT(*)'];

        const configVisual = CONFIGURACION_GLOBAL[label] || {
          icon: 'bi-question-circle', 
          color: 'text-secondary', 
          bgClass: 'bg-secondary-subtle'
        };

        return {
          label: label,
          stadistics: total,
          icon: configVisual.icon,
          color: configVisual.color,
          bgClass: configVisual.bgClass
        };
      });

      this.totalStadistics.set(estadisticasMapeadas);
      console.log('Estadísticas Globales generadas:', estadisticasMapeadas);

    } catch (error) {
      console.log('Error general al cargar las estadísticas:', error);
    }
  }

  async cargarUsuarios(){
    this.users.set([
      {
        id: 1,
        name: 'Carlos Martínez',
        email: 'carlos.admin@legohub.com',
        role: 'Admin',
        isActive: true,
      },
      {
        id: 3,
        name: 'Miguel Fernández',
        email: 'miguel.mod@legohub.com',
        role: 'Moderador',
        isActive: true,
      },
      {
        id: 19,
        name: 'Sergio Morales',
        email: 'sergio@correo.com',
        role: 'Usuario',
        isActive: false,
      },
    ]);
  }

  async cargarCategorias() {
    this.isLoading.set(true);

    try {
      const data = await this.categoryService.getCategories();

      const categoriasMapeadas = data.map((category: ICategory, index: number) => ({
        id: category.id || index + 1,
        name: category.nombre,
        description: category.descripcion || 'Sin descripción',
      }));

      this.categories.set(categoriasMapeadas);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.categories.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
