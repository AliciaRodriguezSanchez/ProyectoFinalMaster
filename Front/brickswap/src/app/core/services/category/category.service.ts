import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../config/api';
import type { ICategory } from '../../interfaces/icategory.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Promise<ICategory[]> {
    return firstValueFrom(
      this.http.get<ICategory[]>(`${API_URL}/categories`)
    );
  }
}
