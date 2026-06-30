import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../core/services/category/category.service';
import type { ICategory } from '../../core/interfaces/icategory.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage implements OnInit {

  categories: ICategory[] = [];

  availableIcons: string[] = [
  '🧱', '🏠', '🏛️', '🏙️', '🚗',
  '🏎️', '🚀', '✈️', '🚂', '🚢',
  '🦸', '🧙', '🥷', '🤖', '👮',
  '🐉', '🦖', '🐾', '🏰', '⚙️',
  '🎨', '💡', '⭐', '❤️', '🎮',
  '⚽', '🏀', '🎵', '📦', '🔧'
  ];

  isLoading = false;
  isSaving = false;

  showCategoryModal = false;
  isEditMode = false;

  selectedCategoryId: number | null = null;

  categoryForm: ICategory = {
    nombre: '',
    descripcion: '',
    icono: '',
  };

  successMessage = '';
  errorMessage = '';

  constructor(
  private categoryService: CategoryService,
  private changeDetectorRef: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.changeDetectorRef.detectChanges();

    try {
      this.categories = await this.categoryService.getCategories();

      console.log('Categorías recibidas:', this.categories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.errorMessage = 'No se pudieron cargar las categorías';
    } finally {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCategoryId = null;

    this.categoryForm = {
      nombre: '',
      descripcion: '',
      icono: '',
    };

    this.successMessage = '';
    this.errorMessage = '';
    this.showCategoryModal = true;
  }

  openEditModal(category: ICategory): void {
    this.isEditMode = true;
    this.selectedCategoryId = category.id ?? null;

    this.categoryForm = {
      nombre: category.nombre,
      descripcion: category.descripcion ?? '',
      icono: category.icono ?? '',
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
  }

  async saveCategory(): Promise<void> {
  const nombre = this.categoryForm.nombre.trim();
  const descripcion = this.categoryForm.descripcion?.trim() ?? '';
  const icono = this.categoryForm.icono?.trim() ?? '';

  if (!nombre) {
    this.errorMessage = 'El nombre de la categoría es obligatorio';
    this.changeDetectorRef.detectChanges();
    return;
  }

  this.isSaving = true;
  this.successMessage = '';
  this.errorMessage = '';
  this.changeDetectorRef.detectChanges();

  try {
    if (this.selectedCategoryId !== null) {
      await this.categoryService.updateCategory(
        this.selectedCategoryId,
        { nombre, descripcion, icono }
      );

      this.successMessage = 'Categoría actualizada correctamente';
    } else {
      await this.categoryService.createCategory({
        nombre,
        descripcion,
        icono,
      });

      this.successMessage = 'Categoría creada correctamente';
    }

    await this.loadCategories();

    this.isSaving = false;
    this.changeDetectorRef.detectChanges();

    setTimeout(() => {
      this.showCategoryModal = false;
      this.successMessage = '';
      this.errorMessage = '';
      this.changeDetectorRef.detectChanges();
    }, 700);

  } catch (error: any) {
    console.error('Error al guardar categoría:', error);

    this.errorMessage =
      error?.error?.message ??
      'No se pudo guardar la categoría';

    this.isSaving = false;
    this.changeDetectorRef.detectChanges();
  }
}

  async deleteCategory(category: ICategory): Promise<void> {
    if (!category.id) {
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la categoría "${category.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    try {
      await this.categoryService.deleteCategory(category.id);

      this.successMessage = 'Categoría eliminada correctamente';
      await this.loadCategories();

    } catch (error: any) {
      console.error('Error al eliminar categoría:', error);

      this.errorMessage =
        error?.error?.message ??
        'No se pudo eliminar la categoría';
    }
  }
}
