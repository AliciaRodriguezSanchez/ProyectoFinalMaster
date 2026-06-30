import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IStat } from '../../interfaces/istat.interface';
import { ArticleService } from '../../core/services/article/article.service';
import { UserService } from '../../core/services/user/user.service';
import { ReportService } from '../../core/services/report/report.service';
import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../interfaces/icategory.interface';

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

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage {
  totalStadistics=signal<IStat[]>([]);
  categories: ICategory[] = [];
  categoryForm: Pick<ICategory, 'nombre' | 'descripcion' | 'icono'> = this.getEmptyCategoryForm();
  selectedCategory: ICategory | null = null;
  availableIcons = ['🧱', '🏙️', '🧙', '🥷', '🏎️', '🚀', '🏰', '🎨', '💡', '🦸'];
  showCategoryModal = false;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private reportService: ReportService,
    private categoryService: CategoryService
  ){}


ngOnInit(){
  this.obtenerEstadisticasGlobales();
  void this.loadCategories();
}

async loadCategories(): Promise<void> {
  this.isLoading = true;
  this.errorMessage = '';

  try {
    this.categories = await this.categoryService.getCategories();
  } catch (error) {
    console.error(error);
    this.errorMessage = 'No se han podido cargar las categorías';
  } finally {
    this.isLoading = false;
  }
}

openCreateModal(): void {
  this.isEditMode = false;
  this.selectedCategory = null;
  this.categoryForm = this.getEmptyCategoryForm();
  this.successMessage = '';
  this.errorMessage = '';
  this.showCategoryModal = true;
}

openEditModal(category: ICategory): void {
  this.isEditMode = true;
  this.selectedCategory = category;
  this.categoryForm = {
    nombre: category.nombre,
    descripcion: category.descripcion || '',
    icono: category.icono || '',
  };
  this.successMessage = '';
  this.errorMessage = '';
  this.showCategoryModal = true;
}

closeModal(): void {
  if (this.isSaving) {
    return;
  }

  this.showCategoryModal = false;
  this.selectedCategory = null;
  this.categoryForm = this.getEmptyCategoryForm();
  this.successMessage = '';
  this.errorMessage = '';
}

async saveCategory(): Promise<void> {
  const category = {
    nombre: this.categoryForm.nombre.trim(),
    descripcion: this.categoryForm.descripcion?.trim() || '',
    icono: this.categoryForm.icono?.trim() || '',
  };

  if (!category.nombre) {
    this.errorMessage = 'El nombre de la categoría es obligatorio';
    return;
  }

  this.isSaving = true;
  this.successMessage = '';
  this.errorMessage = '';

  try {
    const response = this.isEditMode && this.selectedCategory?.id
      ? await this.categoryService.updateCategory(this.selectedCategory.id, category)
      : await this.categoryService.createCategory(category);

    this.successMessage = response.message;
    await this.loadCategories();
    this.closeModal();
  } catch (error: any) {
    console.error(error);
    this.errorMessage = error?.error?.message || 'No se ha podido guardar la categoría';
  } finally {
    this.isSaving = false;
  }
}

async deleteCategory(category: ICategory): Promise<void> {
  if (!category.id || !confirm(`¿Eliminar la categoría ${category.nombre}?`)) {
    return;
  }

  this.successMessage = '';
  this.errorMessage = '';

  try {
    const response = await this.categoryService.deleteCategory(category.id);
    this.successMessage = response.message;
    await this.loadCategories();
  } catch (error: any) {
    console.error(error);
    this.errorMessage = error?.error?.message || 'No se ha podido eliminar la categoría';
  }
}

private getEmptyCategoryForm(): Pick<ICategory, 'nombre' | 'descripcion' | 'icono'> {
  return {
    nombre: '',
    descripcion: '',
    icono: '',
  };
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
}
