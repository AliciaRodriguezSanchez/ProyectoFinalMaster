import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api';
import type { ICategory } from '../../interfaces/icategory.interface';

interface CategoryResponse {
  message: string;
  category: ICategory;
}

interface MessageResponse {
  message: string;
}

type CategoryPayload = Pick<
  ICategory,
  'nombre' | 'descripcion' | 'icono'
>;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategories(): Promise<ICategory[]> {
    return firstValueFrom(
      this.http.get<ICategory[]>(`${API_URL}/categories`)
    );
  }

  // Crear una categoría
  createCategory(
    category: CategoryPayload
  ): Promise<CategoryResponse> {
    return firstValueFrom(
      this.http.post<CategoryResponse>(
        `${API_URL}/categories`,
        category
      )
    );
  }

  // Actualizar una categoría
  updateCategory(
    id: number,
    category: CategoryPayload
  ): Promise<CategoryResponse> {
    return firstValueFrom(
      this.http.put<CategoryResponse>(
        `${API_URL}/categories/${id}`,
        category
      )
    );
  }

  // Eliminar una categoría
  deleteCategory(id: number): Promise<MessageResponse> {
    return firstValueFrom(
      this.http.delete<MessageResponse>(
        `${API_URL}/categories/${id}`
      )
    );
  }
}
