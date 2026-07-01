import { ChangeDetectorRef, Component, signal } from '@angular/core';

import { IStat } from '../../interfaces/istat.interface';
import { ArticleService } from '../../core/services/article/article.service';
import { UserService } from '../../core/services/user/user.service';
import { ReportService } from '../../core/services/report/report.service';

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

@Component({
  selector: 'app-admin',
  imports: [
    TitleComponent,
    DescriptionsComponent,
    CardPanelComponent,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage {
  totalStadistics = signal<IStat[]>([]);

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    void this.obtenerEstadisticasGlobales();
  }

  async obtenerEstadisticasGlobales(): Promise<void> {
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

      const estadisticasMapeadas = ORDEN_TARJETAS.map((label) => {
        let total = 0;

        if (label === 'Usuarios totales') {
          total = totalUsuarios[0]['COUNT(*)'];
        }

        if (label === 'Artículos publicados') {
          total = totalPublicados[0]['COUNT(*)'];
        }

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
      this.cdr.detectChanges();
    } catch (error) {
      console.error(
        'Error general al cargar las estadísticas:',
        error
      );
    }
  }
}
