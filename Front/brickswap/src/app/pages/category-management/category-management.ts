import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category/category.service';
import { UiToastService } from '../../core/services/toast/ui-toast.service';
import { APP_NAVIGATION_PATHS } from '../../core/constants/user-role';
import { ICategory } from '../../interfaces/icategory.interface';
import { SortOrder } from '../../shared/ui/ordenar-lista/ordenar-lista.component';
import { ActionModalComponent } from '../../shared/components/action-modal/action-modal.component';
import { MESSAGE_TEXT } from '../../core/constants/message-text';

@Component({
  selector: 'app-category-management',
  imports: [FormsModule, ActionModalComponent],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css',
})
export class CategoryManagement {
  readonly adminHomePath = APP_NAVIGATION_PATHS.administration;

  categories = signal<ICategory[]>([]);
  visibleCategories = signal<ICategory[]>([]);
  searchText = signal('');
  sortOrder = signal<SortOrder>('newest');

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
  pendingDeleteCategory: ICategory | null = null;
  isEditMode = false;
  isLoading = signal(false);
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
  private categoryService: CategoryService,
  private toastService: UiToastService,
  private router: Router
  ) {}

  ngOnInit(): void {
    void this.loadCategories();
  }

  updateSearchText(value: string): void {
    this.searchText.set(value);
    this.updateVisibleCategories();
  }

  updateVisibleCategories(): void {
    const normalizedSearch = this.searchText().trim().toLowerCase();

    const visibleCategories = this.categories()
      .filter((category) => {
        if (!normalizedSearch) {
          return true;
        }

        const name = category.nombre?.toLowerCase() || '';
        const description = category.descripcion?.toLowerCase() || '';

        return (
          name.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        );
      })
      .sort((categoryA, categoryB) => {
        const firstId = categoryA.id || 0;
        const secondId = categoryB.id || 0;

        return this.sortOrder() === 'newest'
          ? secondId - firstId
          : firstId - secondId;
      });

    this.visibleCategories.set(visibleCategories);
  }

  updateSortOrder(order: SortOrder): void {
    this.sortOrder.set(order);
    this.updateVisibleCategories();
  }

  goToAdminHome(): void {
    void this.router.navigateByUrl(this.adminHomePath);
  }

  async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage = '';

    try {
      this.categories.set(await this.categoryService.getCategories());
      this.updateVisibleCategories();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No se han podido cargar las categorías';
    } finally {
      this.isLoading.set(false);
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

      const successMessage =
        response.message || MESSAGE_TEXT.categoryManagement.saveSuccess;

      await this.loadCategories();

      this.showCategoryModal = false;
      this.selectedCategory = null;
      this.categoryForm = this.getEmptyCategoryForm();
      this.successMessage = '';
      this.errorMessage = '';
      this.toastService.success(successMessage);
    } catch (error: any) {
      console.error(error);

      this.errorMessage =
        error?.error?.message ||
        MESSAGE_TEXT.categoryManagement.saveError;
      this.toastService.error(this.errorMessage);
    } finally {
      this.isSaving = false;
    }
  }

  deleteCategory(category: ICategory): void {
    if (!category.id) {
      return;
    }

    this.pendingDeleteCategory = category;
  }

  closeDeleteCategoryModal(): void {
    this.pendingDeleteCategory = null;
  }

  getDeleteCategoryModalTitle(): string {
    return MESSAGE_TEXT.categoryManagement.deleteModalTitle;
  }

  getDeleteCategoryModalDescription(): string {
    if (!this.pendingDeleteCategory) {
      return '';
    }

    return `${MESSAGE_TEXT.categoryManagement.deleteModalMessage} ${this.pendingDeleteCategory.nombre}`;
  }

  getDeleteCategoryModalSubmitLabel(): string {
    return MESSAGE_TEXT.categoryManagement.deleteModalSubmit;
  }

  getDeleteCategoryModalCancelLabel(): string {
    return MESSAGE_TEXT.categoryManagement.deleteModalCancel;
  }

  async confirmDeleteCategory(): Promise<void> {
    if (!this.pendingDeleteCategory?.id) {
      return;
    }

    const category = this.pendingDeleteCategory;
    const categoryId = category.id as number;

    this.successMessage = '';
    this.errorMessage = '';
    this.pendingDeleteCategory = null;

    try {
      const response =
        await this.categoryService.deleteCategory(categoryId);

      const successMessage =
        response.message || MESSAGE_TEXT.categoryManagement.deleteSuccess;
      this.toastService.success(successMessage);

      await this.loadCategories();
    } catch (error: any) {
      console.error(error);

      const errorMessage =
        error?.error?.message ||
        MESSAGE_TEXT.categoryManagement.deleteError;
      this.toastService.error(errorMessage);
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
