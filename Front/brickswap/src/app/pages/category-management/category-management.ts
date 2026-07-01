import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../interfaces/icategory.interface';

@Component({
  selector: 'app-category-management',
  imports: [FormsModule],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css',
})
export class CategoryManagement {
  categories: ICategory[] = [];

  categoryForm: Pick<ICategory, 'nombre' | 'descripcion' | 'icono'> =
    this.getEmptyCategoryForm();

  selectedCategory: ICategory | null = null;

  availableIcons = [
    '🧱',
    '🏙️',
    '🧙',
    '🥷',
    '🏎️',
    '🚀',
    '🏰',
    '🎨',
    '💡',
    '🦸',
  ];

  showCategoryModal = false;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
  private categoryService: CategoryService,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
      this.cdr.detectChanges();
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
      const response =
        this.isEditMode && this.selectedCategory?.id
          ? await this.categoryService.updateCategory(
              this.selectedCategory.id,
              category
            )
          : await this.categoryService.createCategory(category);

      this.successMessage = response.message;

      await this.loadCategories();

      this.showCategoryModal = false;
      this.selectedCategory = null;
      this.categoryForm = this.getEmptyCategoryForm();
    } catch (error: any) {
      console.error(error);

      this.errorMessage =
        error?.error?.message ||
        'No se ha podido guardar la categoría';
    } finally {
      this.isSaving = false;
    }
  }

  async deleteCategory(category: ICategory): Promise<void> {
    if (
      !category.id ||
      !confirm(`¿Eliminar la categoría ${category.nombre}?`)
    ) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    try {
      const response =
        await this.categoryService.deleteCategory(category.id);

      this.successMessage = response.message;

      await this.loadCategories();
    } catch (error: any) {
      console.error(error);

      this.errorMessage =
        error?.error?.message ||
        'No se ha podido eliminar la categoría';
    }
  }

  private getEmptyCategoryForm(): Pick<
    ICategory,
    'nombre' | 'descripcion' | 'icono'
  > {
    return {
      nombre: '',
      descripcion: '',
      icono: '',
    };
  }
}
